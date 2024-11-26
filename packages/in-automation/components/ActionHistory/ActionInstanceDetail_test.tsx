/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import ActionInstanceDetail from 'in-automation/components/ActionHistory/ActionInstanceDetail';
import { automationActionInstanceFeedbackEnabled } from 'in-services/featureFlags';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-automation/subscriptions/getActionInstance');
jest.mock('in-hooks/useTimeConfig', () => jest.fn());
jest.mock('in-services/featureFlags', () => ({
  automationActionInstanceFeedbackEnabled: true
}));

describe('ActionInstanceDetail', () => {
  const mockId = '123';
  const mockTitle = 'Sample Action Title';
  const mockData = {
    progress: { loading: false },
    data: {
      status: 'SUCCESS',
      metadata: [
        { name: 'feedback', value: '5' },
        { name: 'comment', value: 'Good job!' }
      ],
      output: 'Execution completed successfully',
      inputParameters: [{ displayName: 'Param1', name: 'param1', value: 'Value1', type: 'type1' }]
    },
    errors: []
  };

  beforeEach(() => {
    (useTimeConfig as jest.Mock).mockReturnValue({});
    (useObservable as jest.Mock).mockImplementation(() => mockData);
  });

  it('renders without crashing', () => {
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(screen.getByText('Sample Action Title')).toBeInTheDocument();
  });

  it('displays tabs based on data properties', () => {
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(screen.getByText(t('in-automation:actionHistory.properties'))).toBeInTheDocument();
    expect(screen.getByText(t('in-automation:actionHistory.output'))).toBeInTheDocument();
    expect(screen.getByText(t('in-automation:actionHistory.inputParameters'))).toBeInTheDocument();
    if (automationActionInstanceFeedbackEnabled) {
      expect(screen.getByText(t('in-automation:actionHistory.feedbackTab'))).toBeInTheDocument();
    }
  });

  it('displays error messages when errors are present', () => {
    const errorData = {
      progress: { loading: false },
      errors: [{ code: '401', message: 'Error accessing data' }],
      data: {
        ...mockData.data
      }
    };
    (useObservable as jest.Mock).mockImplementation(() => errorData);
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(screen.getByText('Error accessing data')).toBeInTheDocument();
  });

  it('shows loading indicator while data is loading', () => {
    const loadingData = {
      progress: { loading: true },
      errors: [],
      data: {
        ...mockData.data
      }
    };
    (useObservable as jest.Mock).mockImplementation(() => loadingData);
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(document.querySelector('.local-css-indeterminateLoadingIndicator')).toBeInTheDocument();
  });
});

describe('ActionInstanceDetail - Output Tab Visibility', () => {
  const mockId = '123';
  const mockTitle = 'Sample Action Title';
  const mockData = {
    progress: { loading: false },
    data: {
      status: 'completed',
      metadata: [
        { name: 'feedback', value: '5' },
        { name: 'comment', value: 'Good job!' }
      ],
      inputParameters: [{ displayName: 'Param1', name: 'param1', value: 'Value1', type: 'type1' }]
    },
    errors: []
  };

  beforeEach(() => {
    (useTimeConfig as jest.Mock).mockReturnValue({});
    jest.mock('in-automation/components/ActionHistory/DetailsOutputTab', () => ({
      DetailsOutputTab: ({ output }: { output: string }) => <div data-testid="mock-details-output-tab">{output}</div>
    }));
  });

  it('does not render the output tab when output is null', () => {
    const dataWithNullOutput = { ...mockData, data: { ...mockData.data, output: null } };
    (useObservable as jest.Mock).mockImplementation(() => dataWithNullOutput);
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(screen.queryByText('in-automation:actionHistory.output')).not.toBeInTheDocument();
  });

  it('does not render the output tab when output is an empty string', () => {
    const dataWithEmptyOutput = { ...mockData, data: { ...mockData.data, output: '' } };
    (useObservable as jest.Mock).mockImplementation(() => dataWithEmptyOutput);
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(screen.queryByText('in-automation:actionHistory.output')).not.toBeInTheDocument();
  });

  it('renders the output tab when output is a non-empty string', () => {
    const dataWithNonEmptyOutput = { ...mockData, data: { ...mockData.data, output: 'Example output content' } };
    (useObservable as jest.Mock).mockImplementation(() => dataWithNonEmptyOutput);
    render(<ActionInstanceDetail id={mockId} title={mockTitle} />);
    expect(screen.getByText(t('in-automation:actionHistory.output'))).toBeInTheDocument();
  });
});
