/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { TagFilterExpression, TimeConfig } from 'in-types';
import useHasLogs from 'in-logging/hooks/useHasLogs';

jest.mock('in-logging/subscriptions/hasLogs', () => jest.fn());
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('useHasLogs', () => {
  const { useObservable } = require('@instana/hooks');
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

  function MockLogsComponent() {
    hookResult = useHasLogs({ timeConfig, tagFilterExpression });
    return null;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    hookResult = undefined;
  });

  it('returns true when Observable returns true', () => {
    useObservable.mockReturnValue(true);

    render(<MockLogsComponent />);
    expect(hookResult).toBe(true);
  });

  it('returns false when Observable returns false', () => {
    useObservable.mockReturnValue(false);

    render(<MockLogsComponent />);
    expect(hookResult).toBe(false);
  });

  it('returns undefined when useObservable returns undefined', () => {
    useObservable.mockReturnValue(undefined);

    render(<MockLogsComponent />);
    expect(hookResult).toBeUndefined();
  });

  it('returns undefined when useObservable returns null', () => {
    useObservable.mockReturnValue(null);

    render(<MockLogsComponent />);
    expect(hookResult).toBeUndefined();
  });
});
