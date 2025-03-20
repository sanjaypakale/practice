import request from 'supertest';
import express from 'express';
import { createRouter } from '../path-to-router';
import { NotFoundError } from '@backstage/errors';

const mockAuthService = {
  getPluginRequestToken: jest.fn().mockResolvedValue({ token: 'mock-token' }),
  getOwnServiceCredentials: jest.fn().mockResolvedValue('mock-credentials'),
};
const mockConfigService = {};
const mockDiscoveryService = {};
const mockLoggerService = { info: jest.fn(), debug: jest.fn() };
const mockUrlReaderService = { readUrl: jest.fn() };
const mockCacheService = { get: jest.fn(), set: jest.fn() };
const mockCatalogClient = { getEntityByRef: jest.fn() };

jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: jest.fn(() => mockCatalogClient),
}));

const app = express();
let router;

beforeAll(async () => {
  router = await createRouter({
    auth: mockAuthService,
    config: mockConfigService,
    discovery: mockDiscoveryService,
    logger: mockLoggerService,
    reader: mockUrlReaderService,
    cache: mockCacheService,
  });
  app.use(router);
});

describe('Readme Router', () => {
  test('Health check endpoint should return status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('Should return README from cache', async () => {
    mockCacheService.get.mockResolvedValue({
      name: 'README.md',
      type: 'text/markdown',
      content: 'Cached README content',
    });

    const response = await request(app).get('/component/default/test-entity');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Cached README content');
  });

  test('Should return 404 if README not found in cache', async () => {
    mockCacheService.get.mockResolvedValue({
      name: 'NOT_FOUND',
      type: '',
      content: '',
    });

    const response = await request(app).get('/component/default/test-entity');
    expect(response.status).toBe(404);
  });

  test('Should return 500 if no entity found', async () => {
    mockCacheService.get.mockResolvedValue(undefined);
    mockCatalogClient.getEntityByRef.mockResolvedValue(null);

    const response = await request(app).get('/component/default/test-entity');
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('No integration found');
  });

  test('Should return 404 if README URL not valid', async () => {
    mockCacheService.get.mockResolvedValue(undefined);
    mockCatalogClient.getEntityByRef.mockResolvedValue({});
    jest.spyOn(global.console, 'log').mockImplementation(() => {});

    const response = await request(app).get('/component/default/test-entity');
    expect(response.status).toBe(404);
  });

  test('Should handle URL reader errors gracefully', async () => {
    mockCacheService.get.mockResolvedValue(undefined);
    mockCatalogClient.getEntityByRef.mockResolvedValue({
      metadata: {},
      spec: { location: { target: 'https://invalid-url.com' } },
    });
    mockUrlReaderService.readUrl.mockRejectedValue(new NotFoundError());

    const response = await request(app).get('/component/default/test-entity');
    expect(response.status).toBe(500);
  });
});
