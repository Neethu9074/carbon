/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import {
  teamSettingsAccessLog,
  teamSettingsActionLog,
  teamSettingsActionLogRetention,
  teamSettingsAudit
} from 'in-settings/navigation/paths';
import AuditTrail from 'in-settings/tabs/TeamSettings/pages/audit/AuditTrail';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

const mockGoToPath = jest.fn();
//const mockUseNavigation = jest.fn(() => ({ goToPath: mockGoToPath, location: { pathname: '/config/team/audit' } }));
jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  ...(jest.requireActual('in-stores/navigation/hooks/useNavigation') as any),
  useNavigation: jest.fn()
}));
jest.mock('in-settings/tabs/TeamSettings/pages/audit/ActionLog', () => ({
  __esModule: true,
  default: () => <span>_ActionLog_</span>
}));
jest.mock('in-settings/tabs/TeamSettings/pages/audit/AccessLog', () => ({
  __esModule: true,
  default: () => <span>_AccessLog_</span>
}));

describe('in-settings/tabs/TeamSettings/pages/audit/AuditTrail', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should navigate to ActionLog by default', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      goToPath: mockGoToPath,
      location: { pathname: teamSettingsAudit }
    }));

    render(<AuditTrail />);

    expect(mockGoToPath).toHaveBeenCalledTimes(1);
    expect(mockGoToPath).toHaveBeenCalledWith(teamSettingsActionLog);
  });

  it('should render the actionLog path as expected', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      goToPath: mockGoToPath,
      location: { pathname: teamSettingsActionLog }
    }));

    const { getByText, queryByText } = render(<AuditTrail />);

    expect(mockGoToPath).not.toHaveBeenCalled();
    expect(getByText('in-settings:tabs.auditTrail')).toBeInTheDocument();

    const actionLogBtn = getByText('in-settings:tabs.actionLog');
    expect(actionLogBtn).toBeInTheDocument();
    fireEvent.click(actionLogBtn);
    expect(mockGoToPath).toHaveBeenCalledTimes(1);
    expect(mockGoToPath).toHaveBeenCalledWith(teamSettingsActionLog);

    const accessLogBtn = getByText('in-settings:tabs.accessLog');
    expect(accessLogBtn).toBeInTheDocument();
    fireEvent.click(accessLogBtn);
    expect(mockGoToPath).toHaveBeenCalledTimes(2);
    expect(mockGoToPath).toHaveBeenCalledWith(teamSettingsAccessLog);

    expect(getByText('_ActionLog_')).toBeInTheDocument();
    expect(queryByText('_AccessLog_')).not.toBeInTheDocument();
  });

  it('should render the actionLogRetention path as expected', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      goToPath: mockGoToPath,
      location: { pathname: teamSettingsActionLogRetention }
    }));

    const { getByText, queryByText } = render(<AuditTrail />);

    expect(mockGoToPath).not.toHaveBeenCalled();
    expect(getByText('in-settings:tabs.auditTrail')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.actionLog')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.accessLog')).toBeInTheDocument();
    expect(getByText('_ActionLog_')).toBeInTheDocument();
    expect(queryByText('_AccessLog_')).not.toBeInTheDocument();
  });

  it('should render the accessLog path as expected', () => {
    (useNavigation as jest.Mock).mockImplementation(() => ({
      goToPath: mockGoToPath,
      location: { pathname: teamSettingsAccessLog }
    }));

    const { getByText, queryByText } = render(<AuditTrail />);

    expect(mockGoToPath).not.toHaveBeenCalled();
    expect(getByText('in-settings:tabs.auditTrail')).toBeInTheDocument();

    const actionLogBtn = getByText('in-settings:tabs.actionLog');
    expect(actionLogBtn).toBeInTheDocument();
    fireEvent.click(actionLogBtn);
    expect(mockGoToPath).toHaveBeenCalledTimes(1);
    expect(mockGoToPath).toHaveBeenCalledWith(teamSettingsActionLog);

    const accessLogBtn = getByText('in-settings:tabs.accessLog');
    expect(accessLogBtn).toBeInTheDocument();
    fireEvent.click(accessLogBtn);
    expect(mockGoToPath).toHaveBeenCalledTimes(2);
    expect(mockGoToPath).toHaveBeenCalledWith(teamSettingsAccessLog);

    expect(getByText('_AccessLog_')).toBeInTheDocument();
    expect(queryByText('_ActionLog_')).not.toBeInTheDocument();
  });
});
