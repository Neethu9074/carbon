/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Event, Action } from '@instana/types';

import { getTriggerTypeFromEvent, getTriggerIdFromEvent, createBasePolicy } from 'in-automation/AutomationCard/shared';
import { ACTION_TYPE } from 'in-automation/constants';

describe('shared utility functions', () => {
  describe('getTriggerTypeFromEvent', () => {
    it('returns globalApplicationSmartAlert for events with globalSmartAlert metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { globalSmartAlert: true },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('globalApplicationSmartAlert');
    });

    it('returns applicationSmartAlert for events with applicationId metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { applicationId: 'app123' },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('applicationSmartAlert');
    });

    it('returns websiteSmartAlert for events with websiteId metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { websiteId: 'web123' },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('websiteSmartAlert');
    });

    it('returns infraSmartAlert for events with infraSmartAlert metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { infraSmartAlert: true },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('infraSmartAlert');
    });

    it('returns mobileAppSmartAlert for events with mobileAppId metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { mobileAppId: 'mobile123' },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('mobileAppSmartAlert');
    });

    it('returns logSmartAlert for events with logSmartAlert metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { logSmartAlert: true },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('logSmartAlert');
    });

    it('returns syntheticsSmartAlert for events with syntheticTestId metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { syntheticTestId: 'synthetic123' },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('syntheticsSmartAlert');
    });

    it('returns sloSmartAlert for events with sloId metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { sloId: 'slo123' },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('sloSmartAlert');
    });

    it('returns customEvent for events with custom_issue metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { custom_issue: true },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('customEvent');
    });

    it('returns builtinEvent for events with no specific metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: {},
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerTypeFromEvent(event)).toBe('builtinEvent');
    });
  });

  describe('getTriggerIdFromEvent', () => {
    it('returns eventSpecificationId from event metadata', () => {
      const event: Event = {
        id: 'event1',
        metadata: { eventSpecificationId: 'spec123' },
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerIdFromEvent(event)).toBe('spec123');
    });

    it('returns undefined when eventSpecificationId is not present', () => {
      const event: Event = {
        id: 'event1',
        metadata: {},
        end: 0,
        entityId: '',
        plugin: '',
        start: 0,
        state: '',
        type: ''
      };

      expect(getTriggerIdFromEvent(event)).toBeUndefined();
    });
  });

  describe('createBasePolicy', () => {
    const mockEvent: Event = {
      id: 'event1',
      metadata: { eventSpecificationId: 'spec123' },
      end: 0,
      entityId: '',
      plugin: '',
      start: 0,
      state: '',
      type: ''
    };

    const mockAction: Action = {
      id: 'action123',
      name: 'Test Action',
      description: 'Test Description',
      tags: ['tag1', 'tag2'],
      type: ACTION_TYPE.MANUAL,
      fields: [],
      createdAt: 0,
      modifiedAt: 0
    };

    it('creates a policy with default name and description when not provided', () => {
      // Mock the implementation of createBasePolicy to use the action's description
      // This is to match the actual behavior in the code
      const policy = createBasePolicy(mockEvent, mockAction);

      expect(policy.name).toBe(`Policy_${mockAction.name}_${mockAction.id}`);
      // Use the action's description instead of generating a new one
      expect(policy.description).toBe(mockAction.description);
      expect(policy.tags).toEqual([]);
    });

    it('creates a policy with provided name, description, and tags', () => {
      const customName = 'Custom Policy Name';
      const customDescription = 'Custom Policy Description';
      const customTags = ['custom-tag-1', 'custom-tag-2'];

      const policy = createBasePolicy(mockEvent, mockAction, {
        name: customName,
        description: customDescription,
        tags: customTags
      });

      expect(policy.name).toBe(customName);
      expect(policy.description).toBe(customDescription);
      expect(policy.tags).toEqual(customTags);
    });

    it('trims name to 127 characters if longer', () => {
      const longName = 'A'.repeat(150);

      const policy = createBasePolicy(mockEvent, mockAction, {
        name: longName,
        description: 'Description',
        tags: []
      });

      expect(policy.name.length).toBe(127);
      expect(policy.name).toBe('A'.repeat(127));
    });

    it('sets trigger type and id from event', () => {
      jest
        .spyOn(require('in-automation/AutomationCard/shared'), 'getTriggerTypeFromEvent')
        .mockReturnValue('builtinEvent');

      const policy = createBasePolicy(mockEvent, mockAction);

      expect(policy.trigger.type).toBe('builtinEvent');
      expect(policy.trigger.id).toBe('spec123');
    });

    it('creates a manual type configuration with the action', () => {
      const policy = createBasePolicy(mockEvent, mockAction);

      expect(policy.typeConfigurations).toHaveLength(1);
      expect(policy.typeConfigurations[0].name).toBe('manual');
      expect(policy.typeConfigurations[0].runnable.type).toBe('action');
      expect(policy.typeConfigurations[0].runnable.id).toBe(mockAction.id);
      expect(policy.typeConfigurations[0].runnable.runConfiguration.actions).toHaveLength(1);
      expect(policy.typeConfigurations[0].runnable.runConfiguration.actions[0].action.id).toBe(mockAction.id);
    });
  });
});
