/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  getProductPermissions,
  productPermissionsObject,
  LimitedAccessScope,
  Capability,
  AreaPermission
} from 'in-stores/permission';
import { InstanaGlobals } from 'in-types';

jest.mock('in-services/featureFlags', () => ({
  __esModule: true,
  ...jest.requireActual('in-services/featureFlags')
}));

let orgWindow: InstanaGlobals;

// Modify window object with supplied permissions
const setupPermissions = (permissions: Array<string>) => {
  Object.defineProperty(window, 'instana', {
    value: {
      config: {
        environment: 'saas',
        tenant: 'instana',
        tenantUnit: 'test'
      },
      user: {
        ...window?.instana?.user,
        role: { ...window?.instana?.user?.role, permissions }
      }
    }
  });
};

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
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_AUTOMATION_ACTION_INSTANCES]);
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
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_AUTOMATION_ACTION_INSTANCES]);
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
      expect(productPermissions).not.toContain(
        productPermissionsObject[Capability.CAN_VIEW_AUTOMATION_ACTION_INSTANCES]
      );
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
      expect(productPermissions).not.toContain(
        productPermissionsObject[Capability.CAN_VIEW_AUTOMATION_ACTION_INSTANCES]
      );
    });

    it('Checks the BizOps flag does not affect other permissions', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.businessObservabilityEnabled = true;
      const productPermissions = getProductPermissions();
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_APPLICATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_INSTALL_NEW_AGENTS]);
    });

    it('Checks the BizOps capability permissions are available when feature flag is set', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.businessObservabilityEnabled = true;
      const productPermissions = getProductPermissions();
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESSES]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESS_DETAILS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_ACTIVITIES]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BIZOPS_ALERTS]);
    });

    it('Checks the BizOps flag does not affect other permissions', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.businessObservabilityEnabled = false;
      const productPermissions = getProductPermissions();
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_APPLICATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_INSTALL_NEW_AGENTS]);
    });

    it('Checks the BizOps capability permissions are NOT available when feature flag is not set', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.businessObservabilityEnabled = false;
      const productPermissions = getProductPermissions();
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESSES]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESS_DETAILS]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_ACTIVITIES]);
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BIZOPS_ALERTS]);
    });
  });

  describe('hasPermission', () => {
    beforeAll(() => {
      orgWindow = window.instana;
    });

    afterAll(() => {
      window.instana = orgWindow;
    });

    it('allows application access when no permissions are present', () => {
      // Isolate modules so that changes on window object takes effect
      jest.isolateModules(() => {
        setupPermissions([]);
        // Load permission.ts to ensure it uses the modified window object
        const { hasApplicationsAccess } = require('./permission');
        expect(hasApplicationsAccess).toBe(true);
      });
    });

    it('prevents application access when LIMITED_APPLICATIONS_SCOPE is set', () => {
      // Isolate modules so that changes on window object takes effect
      jest.isolateModules(() => {
        setupPermissions([LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE]);
        // Load permission.ts to ensure it uses the modified window object
        const { hasApplicationsAccess } = require('./permission');
        expect(hasApplicationsAccess).toBe(false);
      });
    });

    it('allows application access when LIMITED_APPLICATIONS_SCOPE ist set and ACCESS_APPLICATIONS is present', () => {
      // Isolate modules so that changes on window object takes effect
      jest.isolateModules(() => {
        setupPermissions([LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE, AreaPermission.ACCESS_APPLICATIONS]);
        // Load permission.ts to ensure it uses the modified window object
        const { hasApplicationsAccess } = require('./permission');
        expect(hasApplicationsAccess).toBe(true);
      });
    });

    // this should not happen, but still tested
    it('allows application access when only ACCESS_APPLICATIONS is present', () => {
      // Isolate modules so that changes on window object takes effect
      jest.isolateModules(() => {
        setupPermissions([AreaPermission.ACCESS_APPLICATIONS]);
        // Load permission.ts to ensure it uses the modified window object
        const { hasApplicationsAccess } = require('./permission');
        expect(hasApplicationsAccess).toBe(true);
      });
    });
  });
});
