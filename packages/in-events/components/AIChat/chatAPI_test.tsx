/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error not ts file - temporary
import { sendAPIQuery, fetchAPIData } from 'in-events/components/AIChat/chatAPI';

const mockHttpFunc = jest.fn();
jest.mock('in-services/http', () => ({
  __esModule: true,
  get default() {
    return mockHttpFunc;
  }
}));

const sampleReturn = [{ body: {} }];

describe('fetchAPIData', () => {
  it('should remove api_endpoint from payload', () => {
    mockHttpFunc.mockReturnValue(sampleReturn);
    const value = fetchAPIData({ api_endpoint: 654, windowStart: 987 });
    expect(value).not.toBeNull();
    expect(mockHttpFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { windowStart: 987 }
      })
    );
    expect(mockHttpFunc).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: { api_endpoint: 654 }
      })
    );
  });
});

describe('sendAPIQuery', () => {
  it('should correctly structure the request', () => {
    mockHttpFunc.mockReturnValue(sampleReturn);
    const value = sendAPIQuery({ windowStart: 123 });
    expect(value).not.toBeNull();
    expect(mockHttpFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { query: { windowStart: 123 } }
      })
    );
  });
});
