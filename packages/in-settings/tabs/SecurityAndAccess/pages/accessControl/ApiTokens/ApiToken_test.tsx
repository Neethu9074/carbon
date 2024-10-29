/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';

import {
  getApiToken,
  saveApiToken,
  createApiToken
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api';
import ApiToken from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';
import { securityAndAccessAccessControlApiTokens } from 'in-settings/navigation/paths';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

jest.mock('in-components/DialogPresenter/store');

const mockGoToPath = jest.fn();

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  ...(jest.requireActual('in-stores/navigation/hooks/useNavigation') as any),
  useNavigation: () => ({ goToPath: mockGoToPath })
}));

jest.mock('in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api');

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

const getProps = (id: string, duplicateFrom?: string) => {
  return { match: { params: { id, duplicateFrom } } };
};

const createToken = (tokenName?: any) => ({
  name: tokenName ? tokenName : generateUniqueShortId(),
  accessGrantingToken: generateUniqueShortId(),
  internalId: generateUniqueShortId(),
  id: generateUniqueShortId()
});

// @ts-expect-error
const mockApis = ({ amount, errors = null, first = null }: MockConfig) => {
  const mockRes = create();
  mockRes.emit({ errors: null, progress: { loading: false } });

  const data: any[] = [];
  if (first) {
    data.push(first);
  }
  for (let i = 0; i < amount; i++) {
    data.push(createToken());
  }

  const sendResult = () => {
    if (errors) {
      mockRes.emit({ errors, progress: { loading: false } });
    } else {
      mockRes.emit({ errors: null, progress: { loading: false }, data });
    }
  };

  sendResult();

  // @ts-expect-error jest api apparently not supported by TS
  getApiToken.mockReturnValue(mockRes);
  // @ts-expect-error jest api apparently not supported by TS
  saveApiToken.mockReturnValue(mockRes);
  // @ts-expect-error jest api apparently not supported by TS
  createApiToken.mockReturnValue(mockRes);
};

describe('in-settings/tabs/SecurityAndAccess/pages/Users/Users', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render ApiToken comp', async () => {
    mockApis({ amount: 0 });
    const ApiTokenComp = renderApiToken('new');
    expect(ApiTokenComp).not.toBeNull();
  });

  it("should show 'Create New Api Token' when 'new' is passed as param", async () => {
    const title = t('in-settings:tabs.createNewToken');
    mockApis({ amount: 0 });
    const { getByText } = renderApiToken('new');
    expect(getByText(title)).toHaveTextContent(title);
  });

  it("should show 'Edit API Token' when id '123' is passed as param", async () => {
    const title = t('in-settings:tabs.editApiToken');
    mockApis({ amount: 0 });
    const { getByText } = renderApiToken('123');
    expect(getByText(title)).toHaveTextContent(title);
  });

  it('should render personalApiTokenNameDescription text', async () => {
    const personalApiTokenNameDescriptionText = t('in-settings:tabs.personalApiTokenNameDescription');
    mockApis({ amount: 0 });
    const { getByText } = renderApiToken('new');
    expect(getByText(personalApiTokenNameDescriptionText)).toHaveTextContent(personalApiTokenNameDescriptionText);
  });

  it('should render the DialogSlideInView comp in DialogWrapper', async () => {
    const { getByTestId } = renderApiToken('new');
    expect(getByTestId('dialog-slide-in-view')).toBeInTheDocument();
  });

  it('should close the dialog when click on outside of the dialog and go back to Api Token List page', async () => {
    const { getByTestId } = renderApiToken('new');
    fireEvent.click(getByTestId('dialog-slide-in-view'));
    expect(close).toHaveBeenCalled();
    expect(mockGoToPath).toHaveBeenCalledWith(securityAndAccessAccessControlApiTokens);
  });

  it('should render apitokenform form', async () => {
    mockApis({ amount: 0 });
    const { getByTestId } = renderApiToken('123');
    const form = getByTestId('apitokenform');
    expect(form).toBeInTheDocument();
  });

  it('should call saveApiToken api (Create Mode) after clicking on Submit button and go back to Api Token List page', async () => {
    mockApis({ amount: 0 });
    const { getByTestId, getByLabelText } = renderApiToken('123');
    const form = getByTestId('apitokenform');
    fireEvent.change(getByLabelText(t('in-settings:tabs.personalApiTokenNameDescription')), {
      target: { value: 'Example Name' }
    });

    fireEvent.submit(form);
    expect(saveApiToken).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
    expect(mockGoToPath(securityAndAccessAccessControlApiTokens));
  });

  it('should call createApiToken api (Edit Mode) after clicking on Submit button and go back to Api Token List page to see token in another Dialog', async () => {
    mockApis({ amount: 0 });
    const { getByTestId, getByLabelText, getByText } = renderApiToken('new');
    const form = getByTestId('apitokenform');
    fireEvent.change(getByLabelText(t('in-settings:tabs.personalApiTokenNameDescription'), { exact: false }), {
      target: { value: 'Example Name' }
    });
    fireEvent.submit(form);
    expect(createApiToken).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
    expect(mockGoToPath(securityAndAccessAccessControlApiTokens));
    expect(getByText('API token created')).toBeInTheDocument();
  });
});

function renderApiToken(idParam: string) {
  return render(<ApiToken {...getProps(idParam)} />);
}
