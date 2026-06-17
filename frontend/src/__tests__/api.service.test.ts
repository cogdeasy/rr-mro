import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { apiService } from '../services/api.service';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('apiService', () => {
  it('getRequests sends correct params', async () => {
    const data = { items: [], totalCount: 0, page: 1, pageSize: 20 };
    mockedAxios.get.mockResolvedValue({ data });
    const result = await apiService.getRequests({ page: 1, pageSize: 10, status: 'Submitted' });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:5062/api/variancerequests',
      { params: { page: '1', pageSize: '10', status: 'Submitted' } },
    );
    expect(result).toEqual(data);
  });

  it('getRequests omits empty params', async () => {
    const data = { items: [], totalCount: 0, page: 1, pageSize: 20 };
    mockedAxios.get.mockResolvedValue({ data });
    await apiService.getRequests({ status: '', priority: undefined });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:5062/api/variancerequests',
      { params: {} },
    );
  });

  it('getRequest calls correct URL', async () => {
    const data = { id: 'abc', title: 'Test' };
    mockedAxios.get.mockResolvedValue({ data });
    const result = await apiService.getRequest('abc');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5062/api/variancerequests/abc');
    expect(result).toEqual(data);
  });

  it('createRequest posts data', async () => {
    const data = { id: 'new', referenceNumber: 'VR-001' };
    mockedAxios.post.mockResolvedValue({ data });
    const result = await apiService.createRequest({ title: 'Test' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5062/api/variancerequests',
      { title: 'Test' },
    );
    expect(result).toEqual(data);
  });

  it('updateStatus sends patch', async () => {
    const data = { id: 'abc', status: 'UnderReview' };
    mockedAxios.patch.mockResolvedValue({ data });
    const result = await apiService.updateStatus('abc', 'UnderReview', 'Dr. J');
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      'http://localhost:5062/api/variancerequests/abc/status',
      { status: 'UnderReview', actor: 'Dr. J' },
    );
    expect(result).toEqual(data);
  });

  it('getStats calls stats endpoint', async () => {
    const data = { totalRequests: 12 };
    mockedAxios.get.mockResolvedValue({ data });
    const result = await apiService.getStats();
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5062/api/variancerequests/stats');
    expect(result).toEqual(data);
  });

  it('triageRequest posts to triage endpoint', async () => {
    const data = { severityClassification: 'High' };
    mockedAxios.post.mockResolvedValue({ data });
    const result = await apiService.triageRequest('req-1');
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5062/api/triage/req-1', {});
    expect(result).toEqual(data);
  });

  it('generateDocument posts to documents endpoint', async () => {
    const data = { documentId: 'doc-1' };
    mockedAxios.post.mockResolvedValue({ data });
    const result = await apiService.generateDocument('req-1', 'Dr. J');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5062/api/documents/generate',
      { requestId: 'req-1', authoredBy: 'Dr. J' },
    );
    expect(result).toEqual(data);
  });

  it('getEngineTypes calls correct endpoint', async () => {
    const data = ['Trent 1000', 'Trent XWB'];
    mockedAxios.get.mockResolvedValue({ data });
    const result = await apiService.getEngineTypes();
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5062/api/variancerequests/engine-types');
    expect(result).toEqual(data);
  });

  it('addComment posts to comments endpoint', async () => {
    const commentData = { content: 'test', author: 'Dr. J', authorRole: 'Lead', isInternal: true };
    const data = { id: 'c1', content: 'test' };
    mockedAxios.post.mockResolvedValue({ data });
    const result = await apiService.addComment('req-1', commentData);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5062/api/variancerequests/req-1/comments',
      commentData,
    );
    expect(result).toEqual(data);
  });
});
