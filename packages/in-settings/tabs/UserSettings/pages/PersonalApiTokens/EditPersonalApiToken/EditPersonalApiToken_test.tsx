/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';

import EditPersonalApiToken from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/EditPersonalApiToken/EditPersonalApiToken';
import { PersonalApiToken, savePersonalApiToken } from 'in-settings/tabs/UserSettings/api/personalApiToken';

jest.mock('in-i18n', () => ({
  t: (key: string) => key
}));

jest.mock('in-settings/tabs/UserSettings/api/personalApiToken');

describe('in-settings/tabs/UserSettings/pages/PersonalApiTokens/EditPersonalApiToken', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    savePersonalApiToken.mockClear();
  });

  const createToken = () => ({
    tokenId: generateUniqueShortId(),
    name: 'my-name',
    accessGrantingToken: generateUniqueShortId(),
    userId: generateUniqueShortId()
  });

  const mockSave = (name: string, ok: boolean = true) => {
    const res = create();
    let emitted: PersonalApiToken | null;
    if (ok) {
      emitted = {
        accessGrantingToken: 'my-token',
        name,
        tokenId: 'my-id',
        userId: 'my-user'
      };
      res.emit(emitted);
    } else {
      res.emitError(new Error('dummy error'));
      emitted = null;
    }

    // @ts-expect-error jest api apparently not supported by TS
    savePersonalApiToken.mockReturnValue(res);
    return emitted;
  };

  it('should render the edit form', async () => {
    const current = createToken();
    const onClose = jest.fn();
    const { getByText, getByLabelText } = render(<EditPersonalApiToken onClose={onClose} current={current} />);

    // headline for create-form
    expect(getByText('in-settings:tabs.editPersonalApiToken')).toBeInTheDocument();
    // label for token name
    expect(getByText('in-settings:tabs.personalApiTokenNameDescription')).toBeInTheDocument();
    // input for token name
    expect(getByLabelText('in-settings:tabs.personalApiTokenNameDescription')).toBeInTheDocument();
    expect(getByText('forms.actions.save')).toBeInTheDocument();
    expect(getByText('forms.actions.save')).toBeDisabled();
    expect(getByText('forms.actions.cancel')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(savePersonalApiToken).not.toHaveBeenCalled();
  });

  it('should allow to successfully change the name', async () => {
    const current = createToken();
    mockSave('123');
    const onClose = jest.fn();
    const { getByLabelText, queryByText, getByText, container } = render(
      <EditPersonalApiToken onClose={onClose} current={current} />
    );

    expect(getByText('forms.actions.save')).toBeDisabled();

    // set new display name and submit form
    fireEvent.change(getByLabelText('in-settings:tabs.personalApiTokenNameDescription'), { target: { value: '123' } });
    fireEvent.change(getByLabelText('in-settings:tabs.apiTokenExpiration'), { target: { value: 'Never' } });
    expect(getByText('forms.actions.save')).not.toBeDisabled();
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(queryByText('in-components:error.erroneousResultPresenterMessage')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(savePersonalApiToken).toHaveBeenCalledTimes(1);
    expect(savePersonalApiToken).toHaveBeenCalledWith({
      ...current,
      name: '123',
      expiresOn: null
    });
  });

  it('should allow to successfully change the name - with submit button', async () => {
    const current = createToken();
    mockSave('1234');
    const onClose = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <EditPersonalApiToken onClose={onClose} current={current} />
    );

    expect(getByText('forms.actions.save')).toBeDisabled();
    // set new display name and press submit button
    fireEvent.change(getByLabelText('in-settings:tabs.personalApiTokenNameDescription'), { target: { value: '1234' } });
    fireEvent.change(getByLabelText('in-settings:tabs.apiTokenExpiration'), { target: { value: 'Never' } });
    const submitBtn = getByText('forms.actions.save') as HTMLButtonElement;
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(queryByText('in-components:error.erroneousResultPresenterMessage')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(savePersonalApiToken).toHaveBeenCalledTimes(1);
    expect(savePersonalApiToken).toHaveBeenCalledWith({
      ...current,
      name: '1234',
      expiresOn: null
    });
  });

  it('should not allow to save an invalid value', async () => {
    const current = createToken();

    const onClose = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <EditPersonalApiToken onClose={onClose} current={current} />
    );

    // set new display name and press submit button
    fireEvent.change(getByLabelText('in-settings:tabs.personalApiTokenNameDescription'), { target: { value: '' } });
    const submitBtn = getByText('forms.actions.save') as HTMLButtonElement;
    expect(submitBtn).toBeDisabled();

    expect(getByText('in-services:validators.theValueMustNotBeBlank')).toBeInTheDocument();
    expect(queryByText('in-components:error.erroneousResultPresenterMessage')).not.toBeInTheDocument();

    expect(onClose).toHaveBeenCalledTimes(0);
    expect(savePersonalApiToken).not.toHaveBeenCalled();
  });

  it('should not allow to save the initial value', async () => {
    const current = createToken();

    const onClose = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <EditPersonalApiToken onClose={onClose} current={current} />
    );

    // set new display name and press submit button
    fireEvent.change(getByLabelText('in-settings:tabs.personalApiTokenNameDescription'), { target: { value: 'x' } });
    expect(getByText('forms.actions.save') as HTMLButtonElement).not.toBeDisabled();

    fireEvent.change(getByLabelText('in-settings:tabs.personalApiTokenNameDescription'), {
      target: { value: current.name }
    });
    expect(getByText('forms.actions.save') as HTMLButtonElement).toBeDisabled();

    expect(queryByText('in-services:validators.theValueMustNotBeBlank')).not.toBeInTheDocument();
    expect(queryByText('in-components:error.erroneousResultPresenterMessage')).not.toBeInTheDocument();

    expect(onClose).toHaveBeenCalledTimes(0);
    expect(savePersonalApiToken).not.toHaveBeenCalled();
  });

  it('should handle a save error', async () => {
    const current = createToken();
    mockSave('xyz', false);

    const onClose = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <EditPersonalApiToken onClose={onClose} current={current} />
    );

    // set new display name and press submit button
    fireEvent.change(getByLabelText('in-settings:tabs.personalApiTokenNameDescription'), { target: { value: 'xyz' } });
    const submitBtn = getByText('forms.actions.save') as HTMLButtonElement;
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(queryByText('in-services:validators.theValueMustNotBeBlank')).not.toBeInTheDocument();
    waitFor(() => expect(getByText('in-components:error.erroneousResultPresenterMessage')).toBeInTheDocument());

    expect(onClose).toHaveBeenCalledTimes(0);
    expect(savePersonalApiToken).toHaveBeenCalledTimes(1);
  });
});
