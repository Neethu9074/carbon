/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import { Map, List } from 'immutable';
import React from 'react';

import { Event, VolatileId } from '@instana/types';

import AutomationCardForLegacyPRC from 'in-automation/AutomationCard/AutomationCardForLegacyPRC';
import { EventOrMap } from 'in-events/types';

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

jest.mock('in-automation/AutomationCard/AutomationCardButtonGroup', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="button-group">Button Group</div>),
  useActiveKey: jest.fn().mockReturnValue('recommendedActions')
}));

jest.mock('in-automation/AutomationCard/RecommendedActionsForLegacyPRC', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="recommended-actions">Recommended Actions</div>)
}));

jest.mock('in-automation/components/ActionHistory/ActionHistoryTable', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div data-testid="action-history">Action History</div>)
}));

jest.mock('in-automation/AutomationCard/useHistory', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(5)
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

jest.mock('in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    from: 1609459200000,
    to: 1609545600000
  })
}));

jest.mock('in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue('application')
  };
});

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

describe('AutomationCardForLegacyPRC', () => {
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

  // Create a mock Immutable Map for the incident
  const createMockIncident = () => {
    const rootCause = Map({
      snapshotId: 'snapshot-1',
      entityID: Map({
        pluginId: 'java',
        steadyId: 'app-1'
      }),
      probFailure: 0.95,
      explainability: List([
        Map({
          connectedServiceId: 'all',
          percentageFailedThroughRC: 80
        })
      ])
    });

    return Map({
      metadata: Map({
        rootCause: Map({
          currentRootCause: Map({
            'snapshot-1': rootCause
          })
        })
      })
    });
  };

  const mockIncident = createMockIncident();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with RecommendedActions when user has access', () => {
    render(
      <AutomationCardForLegacyPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        incident={mockIncident as unknown as EventOrMap}
      />
    );

    expect(screen.getByTestId('button-group')).toBeInTheDocument();
    expect(screen.getByTestId('recommended-actions')).toBeInTheDocument();
  });

  it('does not render when user does not have access', () => {
    require('in-stores/useHasAccess').default.mockReturnValueOnce(false);

    const { container } = render(
      <AutomationCardForLegacyPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        incident={mockIncident as unknown as EventOrMap}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders ActionHistoryTable when activeKey is actionHistory', () => {
    require('in-automation/AutomationCard/AutomationCardButtonGroup').useActiveKey.mockReturnValueOnce('actionHistory');

    render(
      <AutomationCardForLegacyPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        incident={mockIncident as unknown as EventOrMap}
      />
    );

    expect(screen.getByTestId('action-history')).toBeInTheDocument();
    expect(screen.queryByTestId('recommended-actions')).not.toBeInTheDocument();
  });

  it('passes correct props to RecommendedActionsForLegacyPRC', () => {
    const RecommendedActionsForLegacyPRC =
      require('in-automation/AutomationCard/RecommendedActionsForLegacyPRC').default;

    render(
      <AutomationCardForLegacyPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        incident={mockIncident as unknown as EventOrMap}
      />
    );

    expect(RecommendedActionsForLegacyPRC).toHaveBeenCalledWith(
      expect.objectContaining({
        event: mockEvent,
        volatileId: mockVolatileId,
        initialSnapshots: expect.arrayContaining([
          expect.objectContaining({
            rcaEntityType: 'application',
            rcaSnapshotID: 'app-1'
          })
        ])
      }),
      expect.anything()
    );
  });

  it('passes correct props to AutomationCardButtonGroup', () => {
    const AutomationCardButtonGroup = require('in-automation/AutomationCard/AutomationCardButtonGroup').default;

    render(
      <AutomationCardForLegacyPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        incident={mockIncident as unknown as EventOrMap}
      />
    );

    expect(AutomationCardButtonGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedActionsCount: 0,
        actionHistoryCount: 5,
        hasRCA: false
      }),
      expect.anything()
    );
  });

  it('handles incident with List of root causes', () => {
    const rootCause = Map({
      snapshotId: 'snapshot-1',
      entityID: Map({
        pluginId: 'java',
        steadyId: 'app-1'
      }),
      probFailure: 0.95,
      explainability: List([
        Map({
          connectedServiceId: 'all',
          percentageFailedThroughRC: 80
        })
      ])
    });

    const listIncident = Map({
      metadata: Map({
        rootCause: List([rootCause])
      })
    });

    render(
      <AutomationCardForLegacyPRC
        volatileId={mockVolatileId}
        event={mockEvent}
        incident={listIncident as unknown as EventOrMap}
      />
    );

    expect(screen.getByTestId('recommended-actions')).toBeInTheDocument();
  });
});
