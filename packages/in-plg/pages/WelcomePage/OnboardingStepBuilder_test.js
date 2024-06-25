/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import useGetAccountActivation from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import OnboardingStepBuilder from './OnboardingStepBuilder';

// jest.mock('@instana/i18n-react', () => ({
//   t: key => key,
// }));

jest.mock('in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation', () => jest.fn());
jest.mock('in-services/config', () => jest.fn());
jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: () => ({
    createHrefToPath: path => `/mocked/path/${path}`
  })
}));

jest.mock('in-services/config', () => ({
  tenant: 'mockTenant',
  tenantUnit: 'mockTenantUnit'
}));

jest.mock('in-stores/user', () => ({
  role: {
    canConfigureAgents: true,
    canConfigureUsers: true,
    canConfigureApplications: true,
    canConfigureGlobalApplicationSmartAlerts: true,
    canConfigureMobileAppMonitoring: true
  }
}));

jest.mock('in-services/config', () => ({
  tenant: 'test',
  tenantUnit: 'test'
}));

describe('OnboardingStepBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return correct number of tiles based on activation status and permissions', () => {
    const mockActivationData = {
      'test#test': {
        fa: { status: false },
        tr: { status: false },
        au: { status: true },
        ai: { status: false },
        ap: { status: true },
        sas: { status: true },
        w: { status: false },
        u: { status: true }
      }
    };
    useGetAccountActivation.mockReturnValueOnce(mockActivationData);
    const { result } = renderHook(() => OnboardingStepBuilder());

    expect(result.current).toHaveLength(4);
    const startIntegratingTile = result.current.find(tile => tile.key === 'startIntegrating');
    expect(startIntegratingTile).toBeDefined();
  });

  it('should return the correct tile data', () => {
    const mockActivationData = {
      'test#test': {
        fa: { status: false },
        tr: { status: true },
        au: { status: true },
        ai: { status: true },
        ap: { status: true },
        sas: { status: true },
        w: { status: true },
        u: { status: true }
      }
    };
    useGetAccountActivation.mockReturnValueOnce(mockActivationData);
    const { result } = renderHook(() => OnboardingStepBuilder());

    expect(result.current).toHaveLength(1);
    const startIntegratingTile = result.current[0];
    expect(startIntegratingTile).toBeDefined();
    expect(startIntegratingTile.key).toBe('startIntegrating');
  });
});
