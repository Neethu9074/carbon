/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

import ChangePassword from 'in-settings/tabs/UserSettings/pages/ChangePassword/ChangePassword';
import { t } from 'in-i18n';

describe('in-settings/tabs/UserSettings/pages/ChangePassword/ChangePassword', () => {
  function fillInputs(passwordScreen, currentPassword, newPassword, repeatPassword) {
    const passInput = document.getElementById('newPassword');
    fireEvent.change(passInput, { target: { value: newPassword } });

    const oldPassInput = document.getElementById('password');
    fireEvent.change(oldPassInput, { target: { value: currentPassword } });

    const repeatPassInput = document.getElementById('repeatedPassword');
    fireEvent.change(repeatPassInput, { target: { value: repeatPassword } });
  }

  it('with strong password allows save', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'isthiss3Cu?ere10?ere9';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.getByText(t('forms.actions.save'))).not.toHaveClass('button-disabled');
  });

  it('with strong password allows save, if it is not a dictionary word', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'AcknAwledgement!10';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.getByText(t('forms.actions.save'))).not.toHaveClass('button-disabled');
  });

  it('says a password is weak if it is a dictionary word', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'Acknowledgement!10';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.getByText(t('in-settings:tabs.thePasswordIsWeak'))).toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('complains about small password', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'isthis3Cu?ere9';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.getByText(t('in-settings:tabs.required15CharsMin'))).toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('when repeated password is empty, don´t show the passwords dont match msg', async () => {
    render(<ChangePassword />);

    const newPass = '1 REALLY good password';
    const passInput = document.getElementById('newPassword');

    fireEvent.change(passInput, { target: { value: newPass } });

    const oldPassInput = document.getElementById('password');
    fireEvent.change(oldPassInput, { target: { value: 'Not important' } });

    expect(screen.queryByText(t('in-settings:tabs.thePasswordsMustBeTheSame'))).not.toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('when repeated password is the same, dont show the passwords dont match msg', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = '1 REALLY good password';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.queryByText(t('in-settings:tabs.thePasswordsMustBeTheSame'))).not.toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).not.toHaveClass('button-disabled');
  });

  it('when repeated password is not the same, show the passwords dont match msg', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = '1 REALLY good password';
    fillInputs(changePass, 'previousPass', newPass, '1 REALLY good password with a typo');

    expect(screen.getByText(t('in-settings:tabs.thePasswordsMustBeTheSame'))).toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('complains about password with no number', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'isthisseCu?ereIO';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.getByText(t('in-settings:tabs.required1Number'))).toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('complains about password with no lowercase', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'ISTHISS3CU?ERE10';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(screen.getByText(t('in-settings:tabs.required1Lower'))).toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('complains about password with no uppercase', async () => {
    render(<ChangePassword />);
    //const passInput = changePass.getByLabelText('New password');
    const passInput = document.getElementById('newPassword');
    fireEvent.change(passInput, { target: { value: 'isthiss3cu?ere10' } });
    expect(screen.getByText(t('in-settings:tabs.required1Upper'))).toBeInTheDocument();
    expect(screen.getByText(t('forms.actions.save'))).toHaveClass('button-disabled');
  });

  it('complains about password with no special char', async () => {
    const changePass = render(<ChangePassword />);

    const newPass = 'isthiss3CuSere10';
    fillInputs(changePass, 'previousPass', newPass, newPass);

    expect(
      screen.getByText(`${t('in-settings:tabs.required1SpecialChar')} (!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~)`)
    ).toBeInTheDocument();
  });

  it('accepts all special chars', async () => {
    const chars = `(!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~)`;

    for (let c of chars) {
      const changePass = render(<ChangePassword />);

      const newPass = 'isthiss3CuSere10' + c;
      fillInputs(changePass, 'previousPass', newPass, newPass);

      expect(screen.getByText(t('forms.actions.save'))).not.toHaveClass('button-disabled');
      cleanup();
    }
  });

  it('when unmask button is clicked, it should show the password as text', async () => {
    const { container } = render(<ChangePassword />);
    const oldPassInput = document.getElementById('password');

    fireEvent.change(oldPassInput, { target: { value: 'Not important' } });
    fireEvent.click(container.querySelectorAll('button')[0]);

    const input = await document.getElementById('password');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('Not important');
  });
});
