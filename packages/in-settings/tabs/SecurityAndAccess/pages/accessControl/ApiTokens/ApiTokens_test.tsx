/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';

import {
  securityAndAccessAccessControlApiTokenNew,
  securityAndAccessAccessControlApiTokens
} from 'in-settings/navigation/paths';
import { ApiTokenProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';
import { getApiTokens } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api';
import ApiTokens from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokens';
import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import { formatDateTime } from 'in-services/formatters/date';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));
jest.mock('in-settings/hooks/useTenantUnitsInfo', () => ({
  useTenantUnitsInfo: jest.fn()
}));
jest.mock('in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api');

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

jest.mock('in-services/formatters/date', () => ({
  formatDateTime: jest.fn().mockImplementation(date => (date ? `formatted-${date}` : 'formatted-null')),
  fromNow: jest.fn().mockImplementation(date => (date ? `fromNow-${date}` : 'formatted-null'))
}));

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokens', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    getApiTokens.mockClear();
  });

  const createToken = () => ({
    id: generateUniqueShortId(),
    name: generateUniqueShortId(),
    accessGrantingToken: generateUniqueShortId(),
    internalId: generateUniqueShortId(),
    createdOn: Date.now(),
    lastUsedOn: Date.now(),
    createdBy: 'test'
  });

  interface MockConfig {
    readonly amount: number;
    readonly errors?: Error[];
    readonly delay?: number;
    readonly first?: ApiTokenProps;
  }

  // @ts-expect-error
  const mockGet = ({ amount, errors = null, delay = null, first = null }: MockConfig) => {
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
        res.emit({ errors: null, progress: { loading: false }, data });
      }
    };

    if (delay) {
      setTimeout(sendResult, delay);
    } else {
      sendResult();
    }
    // @ts-expect-error jest api apparently not supported by TS
    getApiTokens.mockReturnValue(res);
  };

  it('should show information banner if there are more than one units for the tenant', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token',
      createdOn: 1718851648770,
      lastUsedOn: 1718851648770,
      createdBy: 'test'
    };
    mockGet({ amount: 0, first: token });
    (useTenantUnitsInfo as jest.Mock).mockReturnValue(true);

    const { queryByText, getByText } = render(<ApiTokens />);
    expect(getByText('in-settings:tabs.apiTokens (1)')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.apiTokenUnits')).toBeInTheDocument();
  });

  it('should hide information banner if there are one unit for the tenant', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token',
      createdOn: 1718792878367,
      lastUsedOn: 1718792874930,
      createdBy: 'test'
    };
    mockGet({ amount: 0, first: token });
    (useTenantUnitsInfo as jest.Mock).mockReturnValue(false);
    const { queryByText, getByText } = render(<ApiTokens />);
    expect(getByText('in-settings:tabs.apiTokens (1)')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.apiTokenUnits')).not.toBeInTheDocument();
  });

  it('should contain a list of api tokens', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token',
      createdBy: 'stan@instana.com',
      createdOn: 1718792878367,
      lastUsedOn: 1718792874930
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
    expect(formatDateTime).toHaveBeenCalledWith(token.createdOn);
    expect(getByText(token.createdBy!)).toBeInTheDocument();
    expect(getByText(`fromNow-${token.createdOn}`, { exact: false })).toBeInTheDocument();
    expect(getByText(`fromNow-${token.lastUsedOn}`, { exact: false })).toBeInTheDocument();
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
    expect(mockGoToPath).toBeCalledWith(securityAndAccessAccessControlApiTokenNew);
  });

  it('should redirect to update api token page', () => {
    const token: ApiTokenProps = {
      name: 'my-api-token-name',
      accessGrantingToken: 'my-token',
      internalId: 'my-internal-token',
      id: 'my-token',
      createdBy: 'stan@instana.com',
      createdOn: 1718792878367,
      lastUsedOn: 1718792874930
    };
    mockGet({ amount: 0, first: token });

    const { getByText, container } = render(<ApiTokens />);
    const records = container.querySelectorAll('table tbody tr');
    expect(records.length).toBe(1);
    fireEvent.click(records[0]);
    expect(mockGetEntityHref).toBeCalledWith(securityAndAccessAccessControlApiTokens, token.internalId);
    const tokenName = getByText(token.name);
    fireEvent.click(tokenName);
    expect(mockGetEntityHref).toBeCalledWith(securityAndAccessAccessControlApiTokens, token.internalId);
  });
});
