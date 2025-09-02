/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Event, VolatileId } from '@instana/types';

import AutomationCardForPRC from 'in-automation/AutomationCard/AutomationCardForPRC';
import { InvestigationResponse } from 'in-events/subscriptions/rcaInvestigation';

// Mock dependencies
jest.mock('in-automation/AutomationCard/useScoredActions', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      data: [],
      errors: [],
      progress: { loading: false },
      time: Date.now()
    }),
    useUserRecommendedScoredActions: jest.fn().mockReturnValue({
      data: [],
      errors: [],
      progress: { loading: false },
      time: Date.now()
    }),
    useAIRecommendedScoredActions: jest.fn().mockReturnValue({
      data: [],
      errors: [],
      progress: { loading: false },
      time: Date.now()
    })
  };
});

jest.mock('in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext', () => ({
  useRootCauseTopologyDataContext: jest.fn().mockReturnValue({
    nodes: {
      'node-1': {
        id: 'node-1',
        label: 'Test Node',
        entityType: 'host',
        tags: new Set(['RCA'])
      },
      'node-2': {
        id: 'node-2',
        label: 'Triggering Node',
        entityType: 'application',
        tags: new Set(['TRIGGERING'])
      }
    }
  })
}));

jest.mock('in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext', () => ({
  useEntitySelection: jest.fn().mockReturnValue({
    selectedEntityId: 'node-1'
  })
}));

jest.mock('in-automation/AutomationCard/useTrigger', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    data: {
      id: 'trigger-1',
      name: 'Test Trigger',
      description: 'Test Description'
    },
    progress: { loading: false }
  })
}));

jest.mock('in-automation/AutomationCard/RecommendedActions', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="recommended-actions">Recommended Actions</div>)
}));

jest.mock('in-stores/useHasAccess', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(true)
}));

jest.mock('in-services/featureFlags', () => ({
  actionAutomationEnabled: true
}));

jest.mock('in-stores/permission', () => ({
  automationAccessPermissions: ['automation.read']
}));

describe('AutomationCardForPRC', () => {
  const mockEvent: Event = {
    id: 'event-1',
    metadata: {},
    problem: {
      fixSuggestion: 'cpu load',
      id: 'RDdBuOyLQn-pJxt3wIvcVw',
      problemText: 'cpu load is 100%',
      severity: 10
    },
    end: 0,
    entityId: 'entity123',
    plugin: '',
    start: 0,
    state: '',
    type: ''
  };

  const mockVolatileId: VolatileId = {
    host_id: 'test-host-id'
  };

  const mockInvestigationResponse: InvestigationResponse = {
    diagnosis: {
      diagnosis: {
        summary: 'High CPU usage detected',
        what: 'CPU usage at 100%',
        where: 'On host server-1',
        why: 'Due to runaway process'
      },
      reasoning: 'Analysis of system metrics shows sustained high CPU usage'
    },
    event_summary: 'CPU load event detected',
    trace_log_summary: 'Trace logs show high CPU',
    trace_error_log_summary: 'Error logs indicate resource exhaustion',
    fact_check: {
      factuality_score: 0.95,
      reasoning: 'Verified against system metrics'
    },
    token_usage: 1234,
    id: 'investigation-1',
    status: 'COMPLETED'
  } as InvestigationResponse;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with RecommendedActions when user has access', () => {
    render(<AutomationCardForPRC volatileId={mockVolatileId} event={mockEvent} />);

    expect(screen.getByTestId('recommended-actions')).toBeInTheDocument();
  });

  it('does not render when user does not have access', () => {
    require('in-stores/useHasAccess').default.mockReturnValueOnce(false);

    const { container } = render(<AutomationCardForPRC volatileId={mockVolatileId} event={mockEvent} />);

    expect(container.firstChild).toBeNull();
  });

  it('passes correct props to RecommendedActions with root cause node selected', () => {
    const RecommendedActions = require('in-automation/AutomationCard/RecommendedActions').default;

    render(<AutomationCardForPRC volatileId={mockVolatileId} event={mockEvent} />);

    expect(RecommendedActions).toHaveBeenCalledWith(
      expect.objectContaining({
        event: mockEvent,
        volatileId: mockVolatileId,
        summaryType: 'prc',
        selectedDescription: 'Test Node',
        selectedEntityType: 'host'
      }),
      expect.anything()
    );
  });

  it('passes correct props to RecommendedActions with triggering node selected', () => {
    require('in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext').useEntitySelection.mockReturnValueOnce(
      {
        selectedEntityId: 'node-2'
      }
    );

    const RecommendedActions = require('in-automation/AutomationCard/RecommendedActions').default;

    render(<AutomationCardForPRC volatileId={mockVolatileId} event={mockEvent} />);

    expect(RecommendedActions).toHaveBeenCalledWith(
      expect.objectContaining({
        event: mockEvent,
        volatileId: mockVolatileId,
        summaryType: 'event',
        selectedDescription: null,
        selectedEntityType: null
      }),
      expect.anything()
    );
  });

  it('passes investigation response data when available', () => {
    const RecommendedActions = require('in-automation/AutomationCard/RecommendedActions').default;

    render(
      <AutomationCardForPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        investigationResponse={mockInvestigationResponse}
      />
    );

    expect(RecommendedActions).toHaveBeenCalledWith(
      expect.objectContaining({
        event: mockEvent,
        volatileId: mockVolatileId,
        summaryType: 'investigation',
        selectedDescription: 'High CPU usage detected',
        selectedEntityType: 'host'
      }),
      expect.anything()
    );
  });
});
