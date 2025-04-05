import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { bitbucketFieldExtension } from './BitbucketFieldExtension';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import '@testing-library/jest-dom';

const mockProjects = [
  { key: 'PROJ1' },
  { key: 'PROJ2' },
];

const mockRepositories = [
  { name: 'repo1' },
  { name: 'repo2' },
];

const mockFetch = jest.fn();

global.fetch = mockFetch;

const getProps = (formData = {}) => ({
  onChange: jest.fn(),
  rawErrors: {},
  formData,
} as unknown as FieldExtensionComponentProps<any>);

describe('BitbucketFieldExtension', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders project autocomplete and fetches projects', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockProjects,
    });

    render(<bitbucketFieldExtension.component {...getProps()} />);

    // Wait for projects to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/bitbucket-api/projects');
    });

    expect(screen.getByLabelText('Bitbucket Project Key')).toBeInTheDocument();
  });

  it('updates repositories when project key is selected', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => mockProjects,
      })
      .mockResolvedValueOnce({
        json: async () => mockRepositories,
      });

    const onChange = jest.fn();
    render(<bitbucketFieldExtension.component {...getProps()} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/bitbucket-api/projects'));

    const input = screen.getByLabelText('Bitbucket Project Key');
    fireEvent.change(input, { target: { value: 'PROJ1' } });

    fireEvent.blur(input);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/bitbucket-api/projects/PROJ1/repos');
    });
  });

  it('displays repository field after selecting project', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => mockProjects,
      })
      .mockResolvedValueOnce({
        json: async () => mockRepositories,
      });

    const formData = { projectKey: 'PROJ1' };
    render(<bitbucketFieldExtension.component {...getProps(formData)} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/bitbucket-api/projects/PROJ1/repos');
    });

    expect(screen.getByLabelText('Bitbucket Repository')).toBeInTheDocument();
  });

  it('shows source branch field only if repository is valid', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => mockProjects,
      })
      .mockResolvedValueOnce({
        json: async () => mockRepositories,
      });

    const formData = {
      projectKey: 'PROJ1',
      repoName: 'repo1',
    };

    render(<bitbucketFieldExtension.component {...getProps(formData)} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Source Branch')).toBeInTheDocument();
    });
  });

  it('validates required fields and shows error messages', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => mockProjects,
    });

    const rawErrors = {
      projectKey: ['Project required'],
      repoName: ['Repo required'],
      sourceBranch: ['Branch required'],
    };

    const formData = {};
    render(
      <bitbucketFieldExtension.component
        {...getProps(formData)}
        rawErrors={rawErrors}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Bitbucket Project Key')).toBeInTheDocument();
    });

    expect(screen.getByText('Project key is required')).toBeInTheDocument();
  });
});
