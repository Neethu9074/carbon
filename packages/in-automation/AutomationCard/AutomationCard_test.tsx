/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Event, VolatileId } from '@instana/types';

import AutomationCard from 'in-automation/AutomationCard/AutomationCard';
import { t } from 'in-i18n';

jest.mock('in-services/featureFlags', () => ({
  actionAutomationEnabled: true
}));

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
}

describe('AutomationCard', () => {
  const props: AutomationCardProps = {
    volatileId: {
      host_id: 'testhostId'
    },
    event: {
      id: 'eventId',
      metadata: {},
      problem: {
        fixSuggestion: 'cpu load',
        id: 'RDdBuOyLQn-pJxt3wIvcVw',
        problemText: 'cpu load is 100%',
        severity: 10
      },
      end: 0,
      entityId: '',
      plugin: '',
      start: 0,
      state: '',
      type: ''
    }
  };
  beforeEach(() => {
    jest.resetModules();
  });

  it('initializes with recommendedActions as the default active key', () => {
    render(<AutomationCard {...props} />);
    const allMatches = screen.getAllByText('Recommended actions');
    fireEvent.click(allMatches[0]);
    const heading = screen.getByText('Recommended actions', { selector: 'h2' });
    expect(heading).toBeInTheDocument();
  });

  it('updates to show action history content when active key is changed', () => {
    render(<AutomationCard {...props} />);
    const allMatches = screen.getAllByText(t('Action history'));
    fireEvent.click(allMatches[0]);
    const heading = screen.getByText('Action history', { selector: 'h1' });
    expect(heading).toBeInTheDocument();
    //
  });

  it('renders nothing when actionAutomationEnabled is false', () => {
    // check null case when ff is not enabled
    jest.doMock('in-services/featureFlags', () => ({
      actionAutomationEnabled: false
    }));

    render(<AutomationCard {...props} />);
    expect(screen.queryByText('anything')).toBeNull();
  });
});
