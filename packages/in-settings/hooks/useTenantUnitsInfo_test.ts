/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { create } from '@instana/observables';

import { cache, clearCache, setCache, useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import { TenantsWithUnits, getTenantsWithUnits } from 'in-api/account';

jest.mock('in-api/account');
const mockData: TenantsWithUnits = {
  instana: [
    {
      status: 'ACTIVE',
      tenantId: '5',
      tenantName: 'instana',
      tenantUnitId: '55557f97186b9c0007857901',
      tenantUnitName: 'nightly',
      tenantUnitKey: 'nightly',
      agentKey: 'agentKey-RnVE',
      region: 'pink',
      createDate: 1592304623410
    },
    {
      status: 'ACTIVE',
      tenantId: '5',
      tenantName: 'instana',
      tenantUnitId: '6',
      tenantUnitName: 'plg',
      tenantUnitKey: 'plg',
      agentKey: 'agentKey-VckeA',
      region: 'saas',
      createDate: 1684740816639
    },
    {
      status: 'ACTIVE',
      tenantId: '5',
      tenantName: 'instana',
      tenantUnitId: '6',
      tenantUnitName: 'plgprovider',
      tenantUnitKey: 'plgprovider',
      agentKey: 'agentKey-KRxy7g',
      region: 'saas',
      createDate: 1687246967277
    },
    {
      status: 'ACTIVE',
      tenantId: '5',
      tenantName: 'instana',
      tenantUnitId: '6',
      tenantUnitName: 'test',
      tenantUnitKey: 'test',
      agentKey: 'agentKey-TNNdrA',
      region: 'pink',
      createDate: 1592304616757
    }
  ]
};
describe('useTenantUnitsInfo', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    getTenantsWithUnits.mockClear();
    // clear cache before each test
    clearCache();
  });
  const mockGetTenantUnit = (data: TenantsWithUnits) => {
    const res = create();
    res.emit({ errors: null, progress: { loading: true }, data: null });
    res.emit(data);
    // @ts-expect-error
    getTenantsWithUnits.mockReturnValue(res);
  };

  test('should render the tenants units info if more than one unit', () => {
    mockGetTenantUnit(mockData);
    const { result } = renderHook(useTenantUnitsInfo);
    expect(result.current.showTenantInfo).toBe(true);
    expect(result.current.tenantInfoLoading).toBe(false);
  });

  test('should use cached data and not make api call if tenant info exists in cache', async () => {
    setCache(true);
    const { result } = renderHook(useTenantUnitsInfo);

    expect(result.current.showTenantInfo).toBe(cache);
    expect(getTenantsWithUnits).not.toHaveBeenCalled();
  });

  test('should render the tenants units info if more than one tenant exists', () => {
    const tenantInfo: TenantsWithUnits = {
      instana: [
        {
          status: 'ACTIVE',
          tenantId: '5',
          tenantName: 'instana',
          tenantUnitId: '6',
          tenantUnitName: 'nightly',
          tenantUnitKey: 'nightly',
          agentKey: 'agentKey-RnVE',
          region: 'pink',
          createDate: 1592304623410
        }
      ],
      acme: [
        {
          status: 'ACTIVE',
          tenantId: '8',
          tenantName: 'acme',
          tenantUnitId: '9',
          tenantUnitName: 'daily',
          tenantUnitKey: 'daily',
          agentKey: 'agentKey-NdrA',
          region: 'pink',
          createDate: 1592304623410
        }
      ]
    };
    mockGetTenantUnit(tenantInfo);
    const { result } = renderHook(useTenantUnitsInfo);
    expect(result.current.showTenantInfo).toBe(true);
    expect(result.current.tenantInfoLoading).toBe(false);
  });

  test('should hide the tenants units info if one tenant and one unit exists', () => {
    const tenantInfo: TenantsWithUnits = {
      instana: [
        {
          status: 'ACTIVE',
          tenantId: '55557f97186b9c0007857730',
          tenantName: 'instana',
          tenantUnitId: '55557f97186b9c0007857901',
          tenantUnitName: 'nightly',
          tenantUnitKey: 'nightly',
          agentKey: 'agentKey-RnVE',
          region: 'pink',
          createDate: 1592304623410
        }
      ]
    };
    mockGetTenantUnit(tenantInfo);
    const { result } = renderHook(useTenantUnitsInfo);
    expect(result.current.showTenantInfo).toBe(false);
    expect(result.current.tenantInfoLoading).toBe(false);
  });
});
