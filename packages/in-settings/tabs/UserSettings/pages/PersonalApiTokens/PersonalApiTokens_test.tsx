/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';

import {
  PersonalApiToken,
  getPersonalApiTokensOfUserAsResultObservable as getPersonalApiTokens
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import PersonalApiTokens from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/PersonalApiTokens';
import { useTenantUnitsInfo } from 'in-settings/hooks/useTenantUnitsInfo';
import { formatDateTime } from 'in-services/formatters/date';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));
jest.mock('in-api/account');
jest.mock('in-settings/tabs/UserSettings/api/personalApiToken');

const mockAddActiveDialog = jest.fn();
jest.mock('in-components/DialogPresenter/store', () => ({
  close: () => {},
  addActiveDialog: mockAddActiveDialog
}));
jest.mock('in-settings/hooks/useTenantUnitsInfo', () => ({
  useTenantUnitsInfo: jest.fn()
}));

jest.mock('in-services/formatters/date', () => ({
  formatDateTime: jest.fn().mockImplementation(date => (date ? `formatted-${date}` : 'formatted-null')),
  fromNow: jest.fn().mockImplementation(date => (date ? `fromNow-${date}` : 'formatted-null'))
}));
describe('in-settings/tabs/UserSettings/pages/PersonalApiTokens/PersonalApiTokens', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    getPersonalApiTokens.mockClear();
  });

  const createToken = (name = generateUniqueShortId()) => ({
    tokenId: generateUniqueShortId(),
    name,
    accessGrantingToken: generateUniqueShortId(),
    userId: generateUniqueShortId(),
    createdOn: Date.now(),
    lastUsedOn: Date.now()
  });

  interface MockConfig {
    readonly amount: number;
    readonly errors?: Error[];
    readonly delay?: number;
    readonly first?: PersonalApiToken;
  }

  // @ts-expect-error
  const mockGet = ({ amount, errors = null, delay = null, first = null }: MockConfig) => {
    const res = create();
    res.emit({ errors: null, progress: { loading: false } });

    const data: PersonalApiToken[] = [];
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
    getPersonalApiTokens.mockReturnValue(res);
  };

  it('should show information banner if there are more than one units for the tenant', () => {
    (useTenantUnitsInfo as jest.Mock).mockReturnValue(true);
    const token: PersonalApiToken = {
      name: 'my-token-name',
      tokenId: '1234',
      accessGrantingToken: 'my-token',
      userId: 'my-user',
      createdOn: 1718792878367,
      lastUsedOn: 1718792874930
    };
    mockGet({ amount: 0, first: token });

    const { queryByText, getByText } = render(<PersonalApiTokens />);
    expect(getByText('in-settings:tabs.personalApiTokens (1)')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.personalApiTokenUnits')).toBeInTheDocument();
  });

  it('should hide information banner if there are one unit for the tenant', () => {
    (useTenantUnitsInfo as jest.Mock).mockReturnValue(false);
    const token: PersonalApiToken = {
      name: 'my-token-name',
      tokenId: '1234',
      accessGrantingToken: 'my-token',
      userId: 'my-user',
      createdOn: 1718792878367,
      lastUsedOn: 1718792874930
    };
    mockGet({ amount: 0, first: token });

    const { queryByText, getByText } = render(<PersonalApiTokens />);
    expect(getByText('in-settings:tabs.personalApiTokens (1)')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.personalApiTokenUnits')).not.toBeInTheDocument();
  });

  it('should a table with personal api tokens', async () => {
    const token: PersonalApiToken = {
      name: 'my-token-name',
      tokenId: '1234',
      accessGrantingToken: 'my-token',
      userId: 'my-user',
      createdOn: 1718792878367,
      lastUsedOn: 1718792874930
    };
    mockGet({ amount: 0, first: token });

    const { getByText, getByPlaceholderText, queryByText, container } = render(<PersonalApiTokens />);

    expect(getByText('in-settings:tabs.personalApiTokens (1)')).toBeInTheDocument(); // headline
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument(); // searchbar
    expect(getByText('in-settings:tabs.newPersonalApiToken')).toBeInTheDocument(); // add btn
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument(); // col header entityName
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument(); // col header entityToken
    expect(getByText('in-settings:tabs.tokenLastUsed')).toBeInTheDocument(); // col header last used
    expect(getByText('in-settings:tabs.tokenCreated')).toBeInTheDocument(); // col header created by
    expect(queryByText('in-settings:tabs.noPersonalApiTokens')).not.toBeInTheDocument(); // no data
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).not.toBeInTheDocument(); // loading
    expect(container.querySelector('div[class*="pagination"]')).not.toBeInTheDocument(); // no pagination
    expect(getPersonalApiTokens).toHaveBeenCalled();
    await waitFor(() => expect(getByText(token.name)).toBeInTheDocument());
    expect(getByText(token.name)).toBeInTheDocument();
    expect(getByText('my-t********************')).toBeInTheDocument();
    expect(formatDateTime).toHaveBeenCalledWith(token.createdOn);
    expect(getByText(`fromNow-${token.createdOn}`, { exact: false })).toBeInTheDocument();
    expect(getByText(`fromNow-${token.lastUsedOn}`, { exact: false })).toBeInTheDocument();
  });

  it('should provide an empty table for personal api tokens', async () => {
    mockGet({ amount: 0 });

    const { getByText, getByPlaceholderText, container } = render(<PersonalApiTokens />);

    expect(getByText('in-settings:tabs.personalApiTokens')).toBeInTheDocument(); // headline
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument(); // searchbar
    expect(getByText('in-settings:tabs.newPersonalApiToken')).toBeInTheDocument(); // add btn
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument(); // col header entityName
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument(); // col header entityToken
    expect(getByText('in-settings:tabs.noPersonalApiTokens')).toBeInTheDocument(); // no data
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).not.toBeInTheDocument(); // loading
    expect(container.querySelector('div[class*="pagination"]')).not.toBeInTheDocument(); // no pagination
    expect(getPersonalApiTokens).toHaveBeenCalled();
  });

  it('should provide an empty table for personal api tokens', async () => {
    mockGet({ amount: 10, delay: 10000 });

    const { getByText, getByPlaceholderText, container } = render(<PersonalApiTokens />);

    expect(getByText('in-settings:tabs.personalApiTokens')).toBeInTheDocument(); // headline
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument(); // searchbar
    expect(getByText('in-settings:tabs.newPersonalApiToken')).toBeInTheDocument(); // add btn
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument(); // col header entityName
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument(); // col header entityToken
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).toBeInTheDocument();
    expect(getPersonalApiTokens).toHaveBeenCalled();
    expect(container.querySelector('div[class*="pagination"]')).not.toBeInTheDocument();
  });

  it('should provide pagination if enough tokens are available', async () => {
    mockGet({ amount: 100 });

    const { getByText, getByPlaceholderText, container } = render(<PersonalApiTokens />);

    expect(getByText('in-settings:tabs.personalApiTokens (100)')).toBeInTheDocument(); // headline
    expect(getByPlaceholderText('in-settings:components.search')).toBeInTheDocument(); // searchbar
    expect(getByText('in-settings:tabs.newPersonalApiToken')).toBeInTheDocument(); // add btn
    expect(getByText('in-settings:tabs.name')).toBeInTheDocument(); // col header entityName
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument(); // col header entityToken
    expect(container.querySelector('.tableLoadingSkeletonRows-skeleton')).not.toBeInTheDocument();
    expect(container.querySelector('div[class*="pagination"]')).toBeInTheDocument();
    expect(getPersonalApiTokens).toHaveBeenCalled();
  });
});
