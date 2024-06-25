/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { create } from '@instana/observables';

import CreatePersonalApiToken from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/CreatePersonalApiToken/CreatePersonalApiToken';
import {
  PersonalApiToken,
  createPersonalApiToken as createToken
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({
  t: (key: string) => key
}));

jest.mock('in-settings/tabs/UserSettings/api/personalApiToken');

describe('in-settings/tabs/UserSettings/pages/PersonalApiTokens/CreatePersonalApiToken', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const mockCreation = (ok: boolean = true) => {
    const res = create();
    let emitted: PersonalApiToken | null;
    if (ok) {
      emitted = {
        accessGrantingToken: 'my-token',
        name: 'my-name',
        tokenId: 'my-id',
        userId: 'my-user'
      };
      res.emit(emitted);
    } else {
      res.emitError(new Error('dummy error'));
      emitted = null;
    }

    // @ts-expect-error jest api apparently not supported by TS
    createToken.mockReturnValue(res);
    return emitted;
  };

  it('should render the create form', async () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<CreatePersonalApiToken onClose={onClose} />);

    // headline for create-form
    expect(getByText('in-settings:tabs.createPersonalApiToken')).toBeInTheDocument();
    // label for token name
    expect(getByText('in-settings:tabs.personalApiTokenNameDescription')).toBeInTheDocument();
    // input for token name
    expect(getByLabelText('in-settings:tabs.personalApiTokenNameDescription')).toBeInTheDocument();

    expect(getByText('forms.actions.save')).toBeInTheDocument();
    expect(getByText('forms.actions.cancel')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should allow to cancel whilst being on the create form', async () => {
    const onClose = jest.fn();
    const { getByText } = render(<CreatePersonalApiToken onClose={onClose} />);

    const closeBtn = getByText('forms.actions.cancel');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render an error message if the creation fails', () => {
    const onClose = jest.fn();
    mockCreation(false);

    const { container, getByLabelText, getByText } = render(<CreatePersonalApiToken onClose={onClose} />);

    const input = getByLabelText('in-settings:tabs.personalApiTokenNameDescription');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    waitFor(() => expect(getByText('in-components:error.erroneousResultPresenterMessage')).toBeInTheDocument());
    expect(createToken).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render token details after a successful creation', async () => {
    const onClose = jest.fn();
    const token = mockCreation();

    const { container, getByLabelText, queryByText, getByText } = render(<CreatePersonalApiToken onClose={onClose} />);

    const input = getByLabelText('in-settings:tabs.personalApiTokenNameDescription');
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(createToken).toHaveBeenCalled();
    expect(queryByText(t('in-components:error.erroneousResultPresenterMessage'))).not.toBeInTheDocument();

    expect(onClose).not.toHaveBeenCalled();
    expect(getByText('in-settings:tabs.createdPersonalApiToken')).toBeInTheDocument();
    expect(queryByText('in-settings:tabs.createPersonalApiToken')).not.toBeInTheDocument();

    expect(getByText('in-settings:tabs.personalApiTokenDescription')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.displayName')).toBeInTheDocument();
    expect(getByText('in-settings:tabs.token')).toBeInTheDocument();
    expect(getByText(token!.name)).toBeInTheDocument();

    const closeBtn = getByText('forms.actions.close');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle a submit click for the token creation', async () => {
    const onClose = jest.fn();
    mockCreation();

    const { getByLabelText, queryByText, getByText } = render(<CreatePersonalApiToken onClose={onClose} />);

    const input = getByLabelText('in-settings:tabs.personalApiTokenNameDescription');
    fireEvent.change(input, { target: { value: '123' } });
    const submitBtn = getByText('forms.actions.save') as HTMLButtonElement;
    fireEvent.click(submitBtn);

    expect(createToken).toHaveBeenCalled();
    expect(queryByText(t('in-components:error.erroneousResultPresenterMessage'))).not.toBeInTheDocument();

    expect(onClose).not.toHaveBeenCalled();
  });
});
