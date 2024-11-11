/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { create } from '@instana/observables';

import TwoFactorSettings from 'in-settings/tabs/UserSettings/pages/TwoFactorSettings/TwoFactorSettings';
import http from 'in-services/http';
import { t } from 'in-i18n';

jest.mock('in-services/http');

const twoFactorCredentialsUrl = '/api/settings/authentication/2fa/credentials';
const toggleTwoFactorUrl = '/api/settings/authentication/2fa/toggle';
const verifyTwoFactorTokenUrl = '/api/settings/authentication/2fa/verify/';

const mockTwoFactorCredResp = {
  secret: '123',
  verified: false,
  scratchCodes: [123, 456, 789],
  base64EncodedQrCode: '456'
};

const successResp = {};

function wrapWithBody(obj: object, isWrapped: boolean = false) {
  let resp;
  if (isWrapped) {
    //check if value is array or object and then wrap it with body
    resp = { body: Array.isArray(obj) ? [...obj] : { ...obj } };
  } else {
    resp = obj;
  }
  return resp;
}

function mockHttp() {
  const mockRes = create();
  // @ts-expect-error jest api apparently not supported by TS
  http.mockImplementation(args => {
    switch (args.url) {
      //mock twoFactorCredentials api
      case twoFactorCredentialsUrl:
        mockRes.emit(wrapWithBody(mockTwoFactorCredResp, true));
        return mockRes;
      //mock toggleTwoFactor api
      case toggleTwoFactorUrl:
        mockRes.emit(wrapWithBody(successResp, true));
        return mockRes;
      default:
        //mock verifyTwoFactorToken api
        if (args.url.includes(verifyTwoFactorTokenUrl)) {
          mockRes.emit(wrapWithBody(successResp, true));
          return mockRes;
        } else {
          mockRes.emit(wrapWithBody(successResp, true));
          return mockRes;
        }
    }
  });
}

describe('in-settings/tabs/UserSettings/pages/TwoFactorSettings/TwoFactorSettings', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    // @ts-expect-error
    http.mockClear();
  });

  it('should render TwoFactorSettings comp', async () => {
    mockHttp();
    const TwoFactorSettings = renderApiToken();
    expect(TwoFactorSettings).not.toBeNull();
  });

  it('should render ApiItemView comp', async () => {
    mockHttp();
    const { getByTestId } = renderApiToken();
    const ApiItemView = getByTestId('api-item-view-content');
    expect(ApiItemView).not.toBeNull();
  });

  it('should render twoFactorAuthentication title', async () => {
    mockHttp();
    const { getByText } = renderApiToken();
    const twoFactorAuthenticationTitleTxt = t('in-settings:tabs.twoFactorAuthentication');
    const twoFactorAuthenticationTitle = getByText(twoFactorAuthenticationTitleTxt);
    expect(twoFactorAuthenticationTitle).toHaveTextContent(twoFactorAuthenticationTitleTxt);
  });

  it('should render secret and QR Code returned from api', async () => {
    mockHttp();
    const { getByText, container } = renderApiToken();
    const secret = getByText(mockTwoFactorCredResp.secret);
    const canvas = container.querySelector('canvas');
    expect(secret).toHaveTextContent(mockTwoFactorCredResp.secret);
    expect(canvas).toHaveStyle(
      `background: url(data:image/png;base64,${mockTwoFactorCredResp.base64EncodedQrCode}); background-size: cover;`
    );
  });

  it('should call verifyTwoFactorToken api when click on submit button', async () => {
    mockHttp();
    const { container } = renderApiToken();
    const TwoFaToken_input: any = document.getElementById('2faToken_input');
    const form: any = container.querySelector('form');
    fireEvent.change(TwoFaToken_input, { target: { value: 345 } });
    fireEvent.submit(form);
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { 'X-CSRF-TOKEN': undefined },
        maxRetries: 3,
        method: 'POST',
        url: '/api/settings/authentication/2fa/verify/345'
      })
    );
  });

  it('should call toggleTwoFactor api when click on delete button', async () => {
    mockHttp();
    const { getByText } = renderApiToken();
    const TwoFaToken_input: any = document.getElementById('2faToken_input');
    const deleteButton: Element = getByText(t('in-settings:tabs.disableTwoFactor'));
    fireEvent.change(TwoFaToken_input, { target: { value: 345 } });
    fireEvent.click(deleteButton);
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { 'X-CSRF-TOKEN': undefined },
        maxRetries: 3,
        method: 'POST',
        url: '/api/settings/authentication/2fa/toggle'
      })
    );
  });
});

function renderApiToken() {
  return render(<TwoFactorSettings />);
}
