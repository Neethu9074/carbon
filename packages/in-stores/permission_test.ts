/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getProductPermissions, productPermissionsObject, Capability } from 'in-stores/permission';

jest.mock('in-services/featureFlags', () => ({
  __esModule: true,
  ...jest.requireActual('in-services/featureFlags')
}));

describe('in-stores/permission.ts', () => {
  describe('getProductPermissions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns all product permission if FF are enabled', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.syntheticsEnabled = true;
      featureFlags.actionAutomationEnabled = true;

      // Given
      const productPermissions = getProductPermissions();

      // Then
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);

      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_TESTS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TESTS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS]);

      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_RUN_AUTOMATION_ACTIONS]);
    });

    it('returns action available product permission if action FF is enabled', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.syntheticsEnabled = false;
      featureFlags.actionAutomationEnabled = true;

      // Given
      const productPermissions = getProductPermissions();

      // Then
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);

      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_TESTS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TESTS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS]);

      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_RUN_AUTOMATION_ACTIONS]);
    });

    it('returns synthetics available product permission if synthetics FF is enabled', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.syntheticsEnabled = true;
      featureFlags.actionAutomationEnabled = false;

      // Given
      const productPermissions = getProductPermissions();

      // Then
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);

      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_TESTS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TESTS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS]);

      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_RUN_AUTOMATION_ACTIONS]);
    });

    it('returns default product permission if no FF are enabled', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.syntheticsEnabled = false;
      featureFlags.actionAutomationEnabled = false;

      // Given
      const productPermissions = getProductPermissions();

      // Then
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);

      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_TESTS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TESTS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_LOCATIONS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS]);

      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_ACTIONS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_RUN_AUTOMATION_ACTIONS]);
    });
  });
});
