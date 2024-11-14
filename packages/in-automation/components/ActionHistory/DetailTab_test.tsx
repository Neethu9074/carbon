/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { ActionInstance } from '@instana/types';
import { useObservable } from '@instana/hooks';

import DetailTab from 'in-automation/components/ActionHistory/DetailTab';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn().mockImplementation(() => [{}])
}));

jest.mock('in-services/formatters/date', () => ({
  formatDateTime: jest.fn().mockImplementation(date => (date ? `formatted-${date.toISOString()}` : 'formatted-null'))
}));

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: () => ({
    createHref: jest.fn().mockReturnValue('mocked-href'),
    location: {
      pathname: '',
      query: {},
      matrix: {}
    }
  })
}));
jest.mock('in-hooks/useTimeConfig', () => jest.fn());
jest.mock('in-logging/navigation/paths', () => ({
  useLinkToLogs: jest.fn().mockReturnValue('log-link')
}));
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-services/formatters/date', () => ({
  formatDateTime: jest.fn().mockImplementation(date => (date ? `formatted-${date}` : 'formatted-null'))
}));

jest.mock('in-automation/components/ActionHistory/DetailTab', () => {
  const originalModule = jest.requireActual('in-automation/components/ActionHistory/DetailTab');
  return {
    ...originalModule,
    getActorLink: jest.fn().mockReturnValue('mocked-user-link')
  };
});

interface DetailTabProps {
  properties: ActionInstance;
  id?: string;
  inActionLane?: boolean;
}

describe('DetailTab', () => {
  it('renders without crashing', () => {
    const props: DetailTabProps = {
      properties: {
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 12344545,
        endDate: 445677
      }
    };
    const { getByText } = render(<DetailTab {...props} />);
    expect(getByText('Action')).toBeInTheDocument();
  });
  it('displays error message when present', () => {
    const props: DetailTabProps = {
      properties: {
        errorMessage: 'Test Error',
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 12344545,
        endDate: 445677
      }
    };
    const { getByText } = render(<DetailTab {...props} />);
    expect(getByText(t('in-automation:actionHistory.errorMessage'))).toBeInTheDocument();
  });

  it('does not display error message when absent', () => {
    const props: DetailTabProps = {
      properties: {
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 12344545,
        endDate: 445677
      }
    };
    const { queryByText } = render(<DetailTab {...props} />);
    expect(queryByText('in-automation:actionHistory.errorMessage')).not.toBeInTheDocument();
  });

  it('displays start time', () => {
    const props: DetailTabProps = {
      properties: {
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 12344545,
        endDate: 445677
      }
    };
    const { getByText } = render(<DetailTab {...props} />);
    expect(getByText(t('in-automation:actionHistory.startTime'))).toBeInTheDocument();
  });

  it('displays end time', () => {
    const props: DetailTabProps = {
      properties: {
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 12344545,
        endDate: 445677
      }
    };
    const { queryByText } = render(<DetailTab {...props} />);
    expect(queryByText('in-automation:actionHistory.endTime')).not.toBeInTheDocument();
  });

  it('displays formatted start time when startDate is provided', () => {
    const props: DetailTabProps = {
      properties: {
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 1714492953772,
        endDate: 445677
      }
    };
    const { getByText } = render(<DetailTab {...props} />);
    expect(formatDateTime).toHaveBeenCalledWith(1714492953772);
    expect(getByText(/formatted-1714492953772/)).toBeInTheDocument();
  });

  it('displays fallback for end  time when endDate is not provided', () => {
    const props: DetailTabProps = {
      properties: {
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'EXTERNAL',
        createdDate: 1,
        returnCode: 1,
        actionId: '1',
        startDate: 12344545,
        endDate: 0
      }
    };
    const { getByText } = render(<DetailTab {...props} />);
    expect(formatDateTime).toHaveBeenCalledWith(null);
    expect(getByText('formatted-null')).toBeInTheDocument();
  });

  it('renders snapshot information if available', async () => {
    // @ts-expect-error jest api apparently not supported by TS
    useObservable.mockReturnValue({ label: 'Snapshot1' });
    const props: DetailTabProps = {
      properties: {
        hostSnapshotId: 'snapshot1',
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'SCRIPT',
        createdDate: 1,
        returnCode: 1,
        startDate: 12344545,
        endDate: 445677,
        actionId: '1'
      }
    };
    const { findByText } = render(<DetailTab {...props} />);
    expect(await findByText('Snapshot1')).toBeInTheDocument();
  });
  it('renders snapshot information if available', async () => {
    // @ts-expect-error jest api apparently not supported by TS
    useObservable.mockImplementation(() => ({ label: 'Snapshot1' }));
    const props: DetailTabProps = {
      properties: {
        hostSnapshotId: 'snapshot1',
        startDate: 12344545,
        endDate: 12344545,
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'SCRIPT',
        createdDate: 1,
        returnCode: 1,
        actionId: '1'
      }
    };
    const { findByText } = render(<DetailTab {...props} />);
    expect(await findByText('Snapshot1')).toBeInTheDocument();
  });

  it('renders link for POLICY type actors correctly', () => {
    const props: DetailTabProps = {
      properties: {
        actorName: 'Policy Name',
        actorType: 'POLICY',
        actorId: 'policy123',
        startDate: 12344545,
        endDate: 12344545,
        actionName: 'Test Action',
        status: 'SUCCESS',
        type: 'SCRIPT',
        createdDate: 1,
        returnCode: 1,
        actionId: '1'
      }
    };

    const { getByText } = render(<DetailTab {...props} />);
    const linkElement = getByText('Policy Name').closest('a');
    expect(linkElement).toHaveAttribute('href', 'mocked-href');
  });
});
