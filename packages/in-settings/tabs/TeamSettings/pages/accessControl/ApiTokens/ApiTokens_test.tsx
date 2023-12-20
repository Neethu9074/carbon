/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';

import { teamSettingsAccessControlApiTokenNew, teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
//@ts-ignore
import { getApiTokens } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import { ApiTokenProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import ApiTokens from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens';
import { TenantsWithUnits, getTenantsWithUnits } from 'in-api/account';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));
jest.mock('in-api/account');
jest.mock('in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api');
jest.mock('in-services/featureFlags', () => ({
  apiTokenDialogEnabled: true
}));

const mockGoToPath = jest.fn();
jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  ...(jest.requireActual('in-stores/navigation/hooks/useNavigation') as any),
  useNavigation: () => ({ goToPath: mockGoToPath })
}));

const mockGetEntityHref = jest.fn();
jest.mock('in-settings/navigation/paths', () => ({
  ...(jest.requireActual('in-settings/navigation/paths') as any),
  getEntityHref: (path: string, internalId: string) => mockGetEntityHref(path, internalId),
  getEntityIdView: (path: string, internalId: string) => mockGetEntityHref(path, internalId)
}));

describe('in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokens', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    getApiTokens.mockClear();
    // @ts-expect-error
    getTenantsWithUnits.mockClear();
  });

  const createToken = () => ({
    id: generateUniqueShortId(),
    name: generateUniqueShortId(),
    accessGrantingToken: generateUniqueShortId(),
    internalId: generateUniqueShortId()
  });

  interface MockConfig {
    readonly amount: number;
    readonly errors?: Error[];
    readonly first?: ApiTokenProps;
  }

  // @ts-expect-error
  const mockGet = ({ amount, errors = null, first = null }: MockConfig) => {
    const res = create();
    res.emit({ errors: null, progress: { loading: false } });

    const data: ApiTokenProps[] = [];
    if (first) {
      data.push(first);
    }
    for (let i = 0; i < amount; i++) {
      data.push(createToken());
    }

    const sendResult = () => {
      if (errors) {
        res.emit({ errors, progress: { loading: false } });
      } else {
        res.emit(data);
      }
    };

    sendResult();
    // @ts-expect-error jest api apparently not supported by TS
    getApiTokens.mockReturnValue(res);
  };

  const mockGetTenantUnit = (data: TenantsWithUnits) => {
    const res = create();
    res.emit({ errors: null, progress: { loading: true }, data: null });
    res.emit(data);
    // @ts-expect-error
    getTenantsWithUnits.mockReturnValue(res);
  };

  it('should show information banner if there are more than one units for the tenant', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token'
    };
    mockGet({ amount: 0, first: token });

    const data: TenantsWithUnits = {
      instana: [
        {
          status: 'ACTIVE',
          tenantId: '55557f97186b9c0007857730',
          tenantName: 'instana',
          tenantUnitId: '55557f97186b9c0007857901',
          tenantUnitName: 'nightly',
          tenantUnitKey: 'nightly',
          agentKey: '2Zykc2m_RiKJnVE-TNNdrA',
          region: 'pink',
          createDate: 1592304623410
        },
        {
          status: 'ACTIVE',
          tenantId: '55557f97186b9c0007857730',
          tenantName: 'instana',
          tenantUnitId: '646b1ad08bb80d0001a5f95b',
          tenantUnitName: 'plg',
          tenantUnitKey: 'plg',
          agentKey: '8RWwEQZ5SLOi3hZ6LVckeA',
          region: 'saas',
          createDate: 1684740816639
        },
        {
          status: 'ACTIVE',
          tenantId: '55557f97186b9c0007857730',
          tenantName: 'instana',
          tenantUnitId: '649158770951b300012d1990',
          tenantUnitName: 'plgprovider',
          tenantUnitKey: 'plgprovider',
          agentKey: 'gV9g7fmKQx2rLydRKRxy7g',
          region: 'saas',
          createDate: 1687246967277
        },
        {
          status: 'ACTIVE',
          tenantId: '55557f97186b9c0007857730',
          tenantName: 'instana',
          tenantUnitId: '55557f97186b9c0007857900',
          tenantUnitName: 'test',
          tenantUnitKey: 'test',
          agentKey: '2Zykc2m_RiKJnVE-TNNdrA',
          region: 'pink',
          createDate: 1592304616757
        }
      ]
    };
    mockGetTenantUnit(data);

    const { queryByText, getByText } = render(<ApiTokens />);
    expect(getByText('in-settings:tabs.apiTokens (1)')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.apiTokenUnits')).toBeInTheDocument();
  });

  it('should hide information banner if there are one unit for the tenant', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token'
    };
    mockGet({ amount: 0, first: token });

    const data: TenantsWithUnits = {
      instana: [
        {
          status: 'ACTIVE',
          tenantId: '55557f97186b9c0007857730',
          tenantName: 'instana',
          tenantUnitId: '55557f97186b9c0007857901',
          tenantUnitName: 'nightly',
          tenantUnitKey: 'nightly',
          agentKey: '2Zykc2m_RiKJnVE-TNNdrA',
          region: 'pink',
          createDate: 1592304623410
        }
      ]
    };
    mockGetTenantUnit(data);

    const { queryByText, getByText } = render(<ApiTokens />);
    expect(getByText('in-settings:tabs.apiTokens (1)')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.apiTokenUnits')).not.toBeInTheDocument();
  });

  it('should contain a list of api tokens', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token'
    };
    mockGet({ amount: 0, first: token });

    const { getByText, getByPlaceholderText, queryByText, container } = render(<ApiTokens />);
    expect(getByText('in-settings:tabs.apiTokens (1)')).toBeInTheDocument();
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.newApiToken')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.noApiToken')).not.toBeInTheDocument();
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).not.toBeInTheDocument();
    expect(container.querySelector('div[class*="pagination"]')).not.toBeInTheDocument();
    expect(getApiTokens).toHaveBeenCalled();
    expect(getByText(token.name)).toBeInTheDocument();
    expect(getByText(token.accessGrantingToken)).toBeInTheDocument();
  });

  it('should provide an empty table for api tokens', () => {
    mockGet({ amount: 0 });

    const { getByText, getByPlaceholderText, container } = render(<ApiTokens />);

    expect(getByText('in-settings:tabs.apiTokens')).toBeInTheDocument();
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.newApiToken')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.noApiToken')).toBeInTheDocument();
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).not.toBeInTheDocument();
    expect(container.querySelector('div[class*="pagination"]')).not.toBeInTheDocument();
    expect(getApiTokens).toHaveBeenCalled();
  });

  it('should provide pagination if enough tokens are available', () => {
    mockGet({ amount: 100 });

    const { getByText, getByPlaceholderText, container } = render(<ApiTokens />);

    expect(getByText('in-settings:tabs.apiTokens (100)')).toBeInTheDocument();
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.newApiToken')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument();
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).not.toBeInTheDocument();
    expect(container.querySelector('div[class*="pagination"]')).toBeInTheDocument();
    expect(getApiTokens).toHaveBeenCalled();
  });

  it('should redirect to new api token page', () => {
    mockGet({ amount: 0 });
    const { getByText } = render(<ApiTokens />);
    expect(getApiTokens).toHaveBeenCalled();
    const newApiTokenBtn = getByText('in-settings:tabs.newApiToken');
    expect(newApiTokenBtn).toBeInTheDocument();
    fireEvent.click(newApiTokenBtn);
    expect(mockGoToPath).toBeCalledWith(teamSettingsAccessControlApiTokenNew);
  });

  it('should redirect to update api token page', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token'
    };
    mockGet({ amount: 0, first: token });

    const { getByText, container } = render(<ApiTokens />);
    const records = container.querySelectorAll('table tbody tr');
    expect(records.length).toBe(1);
    fireEvent.click(records[0]);
    expect(mockGetEntityHref).toBeCalledWith(teamSettingsAccessControlApiTokens, token.internalId);
    const tokenName = getByText(token.name);
    fireEvent.click(tokenName);
    expect(mockGetEntityHref).toBeCalledWith(teamSettingsAccessControlApiTokens, token.internalId);
  });
});
