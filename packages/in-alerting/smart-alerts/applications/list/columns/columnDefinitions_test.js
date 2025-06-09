/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { getEntityNameAsSubtitle } from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';

describe('getEntityNameAsSubtitle', () => {
  jest.mock('@instana/hooks', () => ({
    useObservable: jest.fn()
  }));

  jest.mock('in-i18n', () => ({ t: jest.fn() }));

  jest.mock('in-applications/subscriptions/getApplication', () => ({
    getApplication: jest.fn()
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ApplicationName when applicationId is present and isGlobalSmartAlertConfig is false', () => {
    const config = { applicationId: 'mS5QiJWxRneixWGYN9DGEA' };
    const subtitle = getEntityNameAsSubtitle(config, false);

    const { container } = render(subtitle);
    expect(container.querySelector('[aria-label="icon"]')).toBeInTheDocument();
  });

  it('returns nothing when applicationId is missing and isGlobalSmartAlertConfig is false', () => {
    const config = {};
    const subtitle = getEntityNameAsSubtitle(config, false);
    expect(subtitle).toBeUndefined();
  });

  it('renders icon and label correctly', () => {
    render(<ListSubtitle icon="lib_application" label="Test App" />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByLabelText('icon')).toBeInTheDocument();
  });
});
