/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import useHasLogs from '../useHasLogs';
import { TagFilterExpression, TimeConfig } from 'in-types';
import hasLogs from 'in-logging/subscriptions/hasLogs';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-logging/subscriptions/hasLogs', () => jest.fn());

describe('useHasLogs - map and hasLogs tests', () => {
  let hookResult: boolean | undefined;
  const timeConfig: TimeConfig = {
    to: Date.now(),
    windowSize: 60000,
    autoRefresh: false
  };
  const tagFilterExpression: TagFilterExpression = {
    elements: [],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };

  function MockComponent() {
    hookResult = useHasLogs({ tagFilterExpression, timeConfig });
    return null;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    hookResult = undefined;
  });

  it('calls hasLogs with correct parameters', () => {
    const hasLogsMock = jest.fn().mockReturnValue({
      map: jest.fn()
    });
    (hasLogs as jest.Mock).mockImplementation(hasLogsMock);
    (useObservable as jest.Mock).mockImplementation(callback => callback());

    render(<MockComponent />);

    expect(hasLogsMock).toHaveBeenCalledWith({
      timeConfig,
      tagFilterExpression
    });
  });

  it('maps result.data.hasLogs to true when it is true', () => {
    const hasLogsMock = jest.fn().mockReturnValue({
      map: jest.fn(callback => callback({ data: { hasLogs: true } }))
    });
    (hasLogs as jest.Mock).mockImplementation(hasLogsMock);
    (useObservable as jest.Mock).mockImplementation(fn => fn());

    render(<MockComponent />);

    expect(hookResult).toBe(true);
  });

  it('maps result.data.hasLogs to false when it is false', () => {
    const hasLogsMock = jest.fn().mockReturnValue({
      map: jest.fn(callback => callback({ data: { hasLogs: false } }))
    });
    (hasLogs as jest.Mock).mockImplementation(hasLogsMock);
    (useObservable as jest.Mock).mockImplementation(fn => fn());

    render(<MockComponent />);

    expect(hookResult).toBe(false);
  });

  it('maps result.data.hasLogs to false when data is undefined', () => {
    const hasLogsMock = jest.fn().mockReturnValue({
      map: jest.fn(callback => callback({ data: undefined }))
    });
    (hasLogs as jest.Mock).mockImplementation(hasLogsMock);
    (useObservable as jest.Mock).mockImplementation(fn => fn());

    render(<MockComponent />);

    expect(hookResult).toBe(false);
  });

  it('maps result.data.hasLogs to false when hasLogs is undefined', () => {
    const hasLogsMock = jest.fn().mockReturnValue({
      map: jest.fn(callback => callback({ data: { hasLogs: undefined } }))
    });
    (hasLogs as jest.Mock).mockImplementation(hasLogsMock);
    (useObservable as jest.Mock).mockImplementation(fn => fn());

    render(<MockComponent />);

    expect(hookResult).toBe(false);
  });
});
