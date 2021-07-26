/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { create } from '@instana/observables';

import { getAuditLog } from 'in-api/auditLog';
import ActionLog from './ActionLog';

jest.mock('in-api/auditLog');

const whenBackendReturns = value => {
  const obs = create();
  obs.emit(value);
  getAuditLog.mockReturnValue(obs);
};

describe('in-settings/tabs/TeamSettings/pages/audit/ActionLog', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 7, 18));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('render action row with user', async () => {
    whenBackendReturns({
      total: 1,
      entries: [
        {
          action: 'thispersondidthis',
          message: 'this is a test',
          actor: {
            type: 'USER',
            name: 'Lucas Santos',
            email: 'foo@example.com'
          },
          timestamp: new Date(2021, 7, 17).getTime()
        }
      ]
    });
    render(<ActionLog />);
    expect(screen.getByText('User')).toBeInTheDocument();

    const userName = screen.getByText('Lucas Santos');
    expect(userName.parentElement.lastChild.textContent).toBe('foo@example.com');

    expect(screen.getByText('thispersondidthis')).toBeInTheDocument();
    expect(screen.getByText('this is a test')).toBeInTheDocument();
    expect(screen.getByText('yesterday (2021-08-17, 00:00:00)')).toBeInTheDocument();
    expect(screen.getByText('Download as JSON')).toBeInTheDocument();
  });

  it('render action row with API', async () => {
    whenBackendReturns({
      total: 1,
      entries: [
        {
          action: 'thisapididthis',
          message: 'this is an api test',
          actor: {
            type: 'API_TOKEN',
            name: 'UNIT TEST'
          },
          timestamp: new Date(2021, 7, 17).getTime()
        }
      ]
    });
    render(<ActionLog />);
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('UNIT TEST')).toBeInTheDocument();
    expect(screen.getByText('thisapididthis')).toBeInTheDocument();
    expect(screen.getByText('this is an api test')).toBeInTheDocument();
    expect(screen.getByText('yesterday (2021-08-17, 00:00:00)')).toBeInTheDocument();
  });

  it('render message unsafe escapes injections', async () => {
    whenBackendReturns({
      total: 1,
      entries: [
        {
          action: 'thispersondidthis',
          message: `<script>alert('All your base')</script>`,
          actor: {
            type: 'USER',
            name: 'Sacul Sotnas',
            email: 'foo@example.com'
          },
          timestamp: new Date(2021, 7, 17).getTime()
        }
      ]
    });
    render(<ActionLog />);
    expect(screen.getByText(`<script>alert('All your base')</script>`)).toBeInTheDocument();
  });
});
