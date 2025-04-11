import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Define more accurate types for our mocks
type SelectProps = {
  label: string;
  name: string;
  values: (() => Promise<string[]>) | string[];
  className?: string;
};

// Define a mock for SearchFilter.Select
const mockSelectComponent = jest.fn(({ label, name }: SelectProps) => (
  <div data-testid={`search-filter-select-${name}`}>
    {label} Select Filter
  </div>
));

// Set up mocks before importing any modules
jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(),
  createApiRef: jest.fn(),
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  catalogApiRef: { id: 'catalog-api' },
  CATALOG_FILTER_EXISTS: 'exists',
}));

// Set up mocks before importing any modules
jest.mock('@backstage/plugin-search-react', () => ({
  useSearch: jest.fn().mockReturnValue({ types: ['software-catalog', 'techdocs'] }),
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
  SearchFilter: {
    Select: ({ 
      label, 
      name, 
      values 
    }: { 
      label: string; 
      name: string; 
      values: (() => Promise<string[]>) | string[]; 
    }) => {
      // If values is a function, call it immediately to simulate async loading
      if (typeof values === 'function') {
        React.useEffect(() => {
          const loadValues = async () => {
            try {
              await values();
            } catch (e) {
              console.error('Error loading values:', e);
            }
          };
          loadValues();
        }, [values]);
      }
      return <div data-testid={`search-filter-select-${name}`}>{label} Select Filter</div>;
    },
    Checkbox: ({ label, name }: { label: string; name: string }) => (
      <div data-testid={`search-filter-checkbox-${name}`}>{label} Checkbox Filter</div>
    ),
  },
  SearchResult: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="search-result">{children}</div>
  ),
  SearchPagination: () => <div data-testid="search-pagination">Pagination</div>,
}));

jest.mock('@backstage/core-components', () => ({
  CatalogIcon: () => <div>CatalogIcon</div>,
  DocsIcon: () => <div>DocsIcon</div>,
  Content: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="content">{children}</div>
  ),
  Header: ({ title }: { title: string }) => (
    <div data-testid="header">{title}</div>
  ),
  Page: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page">{children}</div>
  ),
}));

jest.mock('@backstage/plugin-search', () => ({
  SearchType: {
    Accordion: ({ 
      name, 
      types 
    }: { 
      name: string; 
      types: Array<{value: string; name: string; icon: React.ReactNode}>;
    }) => (
      <div data-testid="search-type-accordion">
        {name}
        {types.map((type) => (
          <div key={type.value} data-testid={`search-type-${type.value}`}>
            {type.name}
          </div>
        ))}
      </div>
    ),
  },
}));

jest.mock('@backstage/plugin-catalog', () => ({
  CatalogSearchResultListItem: () => (
    <div data-testid="catalog-search-result">Catalog Result</div>
  ),
}));

jest.mock('@backstage/plugin-techdocs', () => ({
  TechDocsSearchResultListItem: () => (
    <div data-testid="techdocs-search-result">TechDocs Result</div>
  ),
}));

// Import the component AFTER all mocks are set up
import { SearchPage } from './SearchPage';

// Import mocked modules directly
const { useSearch } = jest.requireMock('@backstage/plugin-search-react');
const { useApi } = jest.requireMock('@backstage/core-plugin-api');

describe('SearchPage', () => {
  const mockGetEntities = jest.fn().mockResolvedValue({ 
    items: [{ metadata: { name: 'entity-1' } }] 
  });
  
  const mockCatalogApi = {
    getEntities: mockGetEntities,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the useApi mock to return our mockCatalogApi
    useApi.mockReturnValue(mockCatalogApi);
  });

  it('renders the search page with all components', async () => {
    render(<SearchPage />);

    // Check header and structure
    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('Search');
    expect(screen.getByTestId('content')).toBeInTheDocument();
    
    // Check search bar
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    
    // Check type accordion
    expect(screen.getByTestId('search-type-accordion')).toBeInTheDocument();
    expect(screen.getByTestId('search-type-software-catalog')).toBeInTheDocument();
    expect(screen.getByTestId('search-type-techdocs')).toBeInTheDocument();
    
    // Check filters
    expect(screen.getByTestId('search-filter-select-name')).toBeInTheDocument();
    expect(screen.getByTestId('search-filter-select-kind')).toBeInTheDocument();
    expect(screen.getByTestId('search-filter-checkbox-lifecycle')).toBeInTheDocument();
    
    // Check results
    expect(screen.getByTestId('search-pagination')).toBeInTheDocument();
    expect(screen.getByTestId('search-result')).toBeInTheDocument();
    expect(screen.getByTestId('catalog-search-result')).toBeInTheDocument();
    expect(screen.getByTestId('techdocs-search-result')).toBeInTheDocument();
  });

  it('does not show entity filter when techdocs type is not included', () => {
    useSearch.mockReturnValueOnce({
      types: ['software-catalog'], // Only software-catalog, no techdocs
    });

    render(<SearchPage />);
    
    // The entity filter should not be visible
    expect(screen.queryByTestId('search-filter-select-name')).not.toBeInTheDocument();
    
    // Other filters should still be visible
    expect(screen.getByTestId('search-filter-select-kind')).toBeInTheDocument();
    expect(screen.getByTestId('search-filter-checkbox-lifecycle')).toBeInTheDocument();
  });

  it('calls catalogApi.getEntities when techdocs type is included', async () => {
    useSearch.mockReturnValueOnce({
      types: ['techdocs'],
    });

    // Use act to handle all the async operations
    await act(async () => {
      render(<SearchPage />);
    });
    
    // Wait for effects to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verify API was called with correct parameters
    expect(mockGetEntities).toHaveBeenCalledWith({
      fields: ['metadata.name'],
      filter: {
        'metadata.annotations.backstage.io/techdocs-ref': 'exists',
      },
    });
  });

  it('renders all filter components with correct props', () => {
    render(<SearchPage />);
    
    // Verify Kind filter
    const kindFilter = screen.getByTestId('search-filter-select-kind');
    expect(kindFilter).toHaveTextContent('Kind Select Filter');
    
    // Verify Lifecycle filter
    const lifecycleFilter = screen.getByTestId('search-filter-checkbox-lifecycle');
    expect(lifecycleFilter).toHaveTextContent('Lifecycle Checkbox Filter');
  });
});
