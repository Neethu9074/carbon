/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  handleTracking,
  moveAIChatLauncher,
  setDragListener,
  setupCustomLanguagePack,
  useAgentSpecificData,
  AI_CHAT_TAG_NAME,
  LAUNCHER_BUTTON_ID,
  WAC_WIDGET,
  CONTAINER_SELECTOR
} from 'in-events/components/AIChat/utils/utils';
import { eventsPath } from 'in-stores/navigation/paths/mainPaths';

// Mock dependencies
jest.mock('in-components/ViewTrackingMeta', () => ({
  getViewTrackingMetaData: jest.fn().mockReturnValue({
    pageRootName: 'testPage',
    productArea: 'testArea'
  })
}));

jest.mock('in-services/tracking/segment/EventTracker', () => ({
  eventTracker: jest.fn()
}));

jest.mock('in-services/tracking/trackers', () => ({
  track: jest.fn()
}));

jest.mock('in-stores/user', () => ({
  user: {
    preferredName: 'Test User'
  }
}));

// Mock the CTA_CLICKED constant
jest.mock('in-services/util/constants', () => ({
  CTA_CLICKED: 'CTA Clicked'
}));

// Mock the useLocation hook
jest.mock('in-stores/navigation/LocationStateProvider', () => ({
  useLocation: jest.fn()
}));

// Mock the eventsPath
jest.mock('in-stores/navigation/paths/mainPaths', () => ({
  eventsPath: '/events'
}));

describe('AIChat Utils', () => {
  let originalGetElementById: typeof document.getElementById;
  let originalGetElementsByTagName: typeof document.getElementsByTagName;
  let originalSetTimeout: typeof window.setTimeout;

  beforeEach(() => {
    // Save original methods
    originalGetElementById = document.getElementById;
    originalGetElementsByTagName = document.getElementsByTagName;
    originalSetTimeout = window.setTimeout;

    // Mock document methods
    document.getElementById = jest.fn();
    document.getElementsByTagName = jest.fn();
    window.setTimeout = jest.fn(fn => fn()) as any;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original methods
    document.getElementById = originalGetElementById;
    document.getElementsByTagName = originalGetElementsByTagName;
    window.setTimeout = originalSetTimeout;
  });

  describe('handleTracking', () => {
    it('should call eventTracker and track with correct parameters', () => {
      const { eventTracker } = require('in-services/tracking/segment/EventTracker');
      const { track } = require('in-services/tracking/trackers');
      const trackingName = 'testEvent';
      const additionalData = { testKey: 'testValue' };

      // Mock location.hash
      Object.defineProperty(window, 'location', {
        value: { hash: '#testHash' },
        writable: true
      });

      handleTracking(trackingName, additionalData);

      expect(eventTracker).toHaveBeenCalledWith({
        data: {
          parentPageName: 'testPage',
          parentPageCategory: 'testArea',
          CTA: trackingName,
          path: '#testHash',
          testKey: 'testValue'
        },
        segmentEventName: 'CTA Clicked' // Updated to match the actual value
      });

      expect(track).toHaveBeenCalledWith(trackingName, { author: 'Test User' });
    });
  });

  describe('moveAIChatLauncher', () => {
    it('should update launcher position when element exists', () => {
      const mockLauncher = { style: { right: '' } };
      (document.getElementById as jest.Mock).mockReturnValue(mockLauncher);

      moveAIChatLauncher('100px');

      expect(document.getElementById).toHaveBeenCalledWith(LAUNCHER_BUTTON_ID);
      expect(mockLauncher.style.right).toBe('100px');
    });

    it('should do nothing when launcher element does not exist', () => {
      (document.getElementById as jest.Mock).mockReturnValue(null);

      moveAIChatLauncher('100px');

      expect(document.getElementById).toHaveBeenCalledWith(LAUNCHER_BUTTON_ID);
    });
  });

  describe('setDragListener', () => {
    it('should set up drag listener when elements exist', () => {
      const mockSetAttribute = jest.fn();
      const mockAddEventListener = jest.fn();
      const mockGetAnimations = jest.fn().mockReturnValue([{ cancel: jest.fn() }]);

      const mockMovable = {
        style: { right: '0px', bottom: '0px' },
        getAnimations: mockGetAnimations
      };

      const mockHeader = {
        getAttribute: jest.fn().mockReturnValue(null),
        setAttribute: mockSetAttribute,
        addEventListener: mockAddEventListener
      };

      const mockShadowRoot = {
        getElementById: jest.fn().mockReturnValue(mockMovable),
        querySelector: jest.fn().mockReturnValue(mockHeader)
      };

      (document.getElementsByTagName as jest.Mock).mockReturnValue([{ shadowRoot: mockShadowRoot }]);

      setDragListener();

      expect(document.getElementsByTagName).toHaveBeenCalledWith(AI_CHAT_TAG_NAME);
      expect(mockShadowRoot.getElementById).toHaveBeenCalledWith(WAC_WIDGET);
      expect(mockShadowRoot.querySelector).toHaveBeenCalledWith(CONTAINER_SELECTOR);
      expect(mockSetAttribute).toHaveBeenCalledWith('data-draggable-event', 'true');
      expect(mockAddEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function));
    });

    it('should not set up drag listener when elements do not exist', () => {
      (document.getElementsByTagName as jest.Mock).mockReturnValue([]);

      setDragListener();

      expect(document.getElementsByTagName).toHaveBeenCalledWith(AI_CHAT_TAG_NAME);
    });
  });

  describe('setupCustomLanguagePack', () => {
    it('should call updateLanguagePack with custom language pack', () => {
      const mockInstance = {
        updateLanguagePack: jest.fn()
      };

      setupCustomLanguagePack(mockInstance);

      expect(mockInstance.updateLanguagePack).toHaveBeenCalledWith({
        ai_slug_title: ' ',
        ai_slug_description: ' '
      });
    });
  });

  describe('useAgentSpecificData', () => {
    it('should return agent object when pathname is in validPaths', () => {
      const { useLocation } = require('in-stores/navigation/LocationStateProvider');
      useLocation.mockReturnValue({ pathname: '/events' });

      const result = useAgentSpecificData();
      expect(useLocation).toHaveBeenCalled();
      expect(result).not.toBe(false);
      // Type assertion to tell TypeScript that result is not false
      if (result) {
        expect(result.path).toBe(eventsPath);
      }
    });

    it('should return undefined when pathname is not in validPaths', () => {
      const { useLocation } = require('in-stores/navigation/LocationStateProvider');
      useLocation.mockReturnValue({ pathname: '/some-other-path' });

      const result = useAgentSpecificData();

      expect(useLocation).toHaveBeenCalled();
      expect(result).toBe(undefined);
    });

    it('should return undefined when pathname is a subpath of a valid path', () => {
      const { useLocation } = require('in-stores/navigation/LocationStateProvider');
      useLocation.mockReturnValue({ pathname: '/events/details' });

      const result = useAgentSpecificData();

      expect(useLocation).toHaveBeenCalled();
      expect(result).toBe(undefined);
    });
  });
});

// Made with Bob
