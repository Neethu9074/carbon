/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { create } from '@instana/observables';

import { getAccessLog } from 'in-api/auditLog';
import AccessLog from './AccessLog';

jest.mock('in-api/auditLog');

const whenBackendReturns = value => {
  const obs = create();
  obs.emit(value);
  getAccessLog.mockReturnValue(obs);
};

describe('in-settings/tabs/TeamSettings/pages/audit/AccessLog', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 7, 18));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('render access row', async () => {
    whenBackendReturns({
      entries: [
        {
          action: 'FIRST_LOGIN',
          email: 'shinji@nerv.com',
          fullName: 'Shinji Ikari',
          timestamp: new Date(2021, 7, 17).getTime()
        }
      ],
      total: 1
    });
    render(<AccessLog />);

    const userName = screen.getByText('Shinji Ikari');
    expect(userName.parentElement.lastChild.textContent).toBe('shinji@nerv.com');

    expect(screen.getByText('FIRST_LOGIN')).toBeInTheDocument();
    expect(screen.getByText('yesterday (2021-08-17, 00:00:00)')).toBeInTheDocument();
    expect(screen.getByText('Download as JSON')).toBeInTheDocument();
  });
});
