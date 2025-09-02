/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook } from '@testing-library/react-hooks';

import { Event } from '@instana/types';

import {
  getApplicationSmartAlertConfig,
  getEventSpecification,
  getGlobalApplicationSmartAlertConfig,
  getInfraSmartAlertConfig,
  getLogSmartAlertConfig,
  getMobileAppSmartAlertConfig,
  getSloSmartAlertConfig,
  getSyntheticSmartAlertConfig,
  getWebsiteSmartAlertConfig
} from 'in-automation/api';
import { getTriggerTypeFromEvent, getTriggerIdFromEvent } from './shared';
import { pendingResult } from 'in-services/fixedObjects';
import useTrigger from './useTrigger';

// Mock dependencies
jest.mock('./shared', () => ({
  getTriggerTypeFromEvent: jest.fn(),
  getTriggerIdFromEvent: jest.fn()
}));

jest.mock('in-automation/api', () => ({
  getApplicationSmartAlertConfig: jest.fn(),
  getEventSpecification: jest.fn(),
  getGlobalApplicationSmartAlertConfig: jest.fn(),
  getInfraSmartAlertConfig: jest.fn(),
  getLogSmartAlertConfig: jest.fn(),
  getMobileAppSmartAlertConfig: jest.fn(),
  getSloSmartAlertConfig: jest.fn(),
  getSyntheticSmartAlertConfig: jest.fn(),
  getWebsiteSmartAlertConfig: jest.fn()
}));

jest.mock('@instana/observables', () => {
  const originalModule = jest.requireActual('@instana/observables');
  return {
    ...originalModule,
    Observable: {
      of: jest.fn()
    }
  };
});

describe('useTrigger', () => {
  const mockEvent: Event = {
    id: 'eventId',
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

  const mockTriggerId = 'trigger123';

  beforeEach(() => {
    jest.clearAllMocks();
    (getTriggerIdFromEvent as jest.Mock).mockReturnValue(mockTriggerId);
  });

  it('returns pending result by default', () => {
    const { result } = renderHook(() => useTrigger({ event: mockEvent }));
    expect(result.current).toBe(pendingResult);
  });

  it('calls getEventSpecification for builtinEvent type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('builtinEvent');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getEventSpecification).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getEventSpecification for customEvent type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('customEvent');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getEventSpecification).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getApplicationSmartAlertConfig for applicationSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('applicationSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getApplicationSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getWebsiteSmartAlertConfig for websiteSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('websiteSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getWebsiteSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getGlobalApplicationSmartAlertConfig for globalApplicationSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('globalApplicationSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getGlobalApplicationSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getMobileAppSmartAlertConfig for mobileAppSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('mobileAppSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getMobileAppSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getInfraSmartAlertConfig for infraSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('infraSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getInfraSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getLogSmartAlertConfig for logSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('logSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getLogSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getSyntheticSmartAlertConfig for syntheticsSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('syntheticsSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getSyntheticSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('calls getSloSmartAlertConfig for sloSmartAlert type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('sloSmartAlert');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getTriggerIdFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getSloSmartAlertConfig).toHaveBeenCalledWith(mockTriggerId);
  });

  it('returns undefined for schedule type', () => {
    (getTriggerTypeFromEvent as jest.Mock).mockReturnValue('schedule');

    renderHook(() => useTrigger({ event: mockEvent }));

    expect(getTriggerTypeFromEvent).toHaveBeenCalledWith(mockEvent);
    expect(getEventSpecification).not.toHaveBeenCalled();
    expect(getApplicationSmartAlertConfig).not.toHaveBeenCalled();
    expect(getWebsiteSmartAlertConfig).not.toHaveBeenCalled();
    expect(getGlobalApplicationSmartAlertConfig).not.toHaveBeenCalled();
    expect(getMobileAppSmartAlertConfig).not.toHaveBeenCalled();
    expect(getInfraSmartAlertConfig).not.toHaveBeenCalled();
    expect(getLogSmartAlertConfig).not.toHaveBeenCalled();
    expect(getSyntheticSmartAlertConfig).not.toHaveBeenCalled();
    expect(getSloSmartAlertConfig).not.toHaveBeenCalled();
  });
});
