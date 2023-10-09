/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';
//@ts-ignore
import { getApiTokens, deleteApiToken } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import { teamSettingsAccessControlApiTokenNew, teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
import { ApiTokenProps } from './ApiToken';
import ApiTokens from './ApiTokens';

jest.mock('in-i18n', () => ({
  t: (key: string) => key
}));
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
    // @ts-ignore
    getApiTokens.mockClear();
    // @ts-ignore
    deleteApiToken.mockClear();
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
    readonly delay?: number;
    readonly first?: ApiTokenProps;
  }

  // @ts-ignore
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
        res.emit(data);
      }
    };
    if (delay) {
      setTimeout(sendResult, delay);
    } else {
      sendResult();
    }
    // @ts-expect-error jest api apparently not supported by TS
    getApiTokens.mockReturnValue(res);
    // @ts-expect-error jest api apparently not supported by TS
    deleteApiToken.mockReturnValue(res);
  };

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
