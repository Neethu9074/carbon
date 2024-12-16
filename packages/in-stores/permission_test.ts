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
  AreaPermission,
  getInfrastructurePermissions,
  InfrastructureCapability
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
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_POLICIES]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY]);
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
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_POLICIES]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY]);
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
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_POLICIES]);
      expect(productPermissions).not.toContain(
        productPermissionsObject[Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY]
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
      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_CONFIGURE_AUTOMATION_POLICIES]);
      expect(productPermissions).not.toContain(
        productPermissionsObject[Capability.CAN_DELETE_AUTOMATION_ACTION_HISTORY]
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

    it('Checks the BizOps flag does not affect other permissions', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.businessObservabilityEnabled = false;
      const productPermissions = getProductPermissions();
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_APPLICATIONS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]);
      expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_INSTALL_NEW_AGENTS]);
    });

    it('Checks that Infra SA permission is not available when infraSmartAlertsEnabled feature flag is not set', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.infraSmartAlertsEnabled = false;
      const productPermissions = getProductPermissions();

      expect(productPermissions).not.toContain(
        productPermissionsObject[Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS]
      );
    });

    it('Checks that Log SA permission is not available when logSmartAlertsEnabled feature flag is not set', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.logSmartAlertsEnabled = false;
      const productPermissions = getProductPermissions();

      expect(productPermissions).not.toContain(
        productPermissionsObject[Capability.CAN_CONFIGURE_GLOBAL_LOG_SMART_ALERTS]
      );
    });

    it('Checks that manual closure of events permission is not available when manuallyCloseEventEnabled feature flag is not set', () => {
      const featureFlags = jest.requireMock('in-services/featureFlags');
      featureFlags.manuallyCloseEventEnabled = false;
      const productPermissions = getProductPermissions();

      expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_MANUALLY_CLOSE_ISSUE]);
    });
  });

  describe('getInfrastructurePermissions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should provide an array including all infrastructure permissions and their details', () => {
      const permissions = getInfrastructurePermissions();
      expect(permissions).toHaveLength(3);
      expect(permissions);
      expect(permissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: InfrastructureCapability.ACCESS_INFRASTRUCTURE_ANALYZE
          }),
          expect.objectContaining({
            key: InfrastructureCapability.CAN_CREATE_HEAP_DUMP
          }),
          expect.objectContaining({
            key: InfrastructureCapability.CAN_CREATE_THREAD_DUMP
          })
        ])
      );
    });
    it('should provide an array including all infrastructure permissions', () => {
      expect(InfrastructureCapability).toHaveProperty('ACCESS_INFRASTRUCTURE_ANALYZE');
      expect(InfrastructureCapability).toHaveProperty('CAN_CREATE_HEAP_DUMP');
      expect(InfrastructureCapability).toHaveProperty('CAN_CREATE_THREAD_DUMP');
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
