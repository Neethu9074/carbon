/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import InviteUserButton from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

jest.mock('in-components/DialogPresenter/store', () => ({
  addActiveDialog: jest.fn()
}));

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserButton', () => {
  beforeEach(jest.clearAllMocks);

  it('happy day', async () => {
    render(<InviteUserButton />);
  });

  it('should open invitation dialog when invite user button is clicked', async () => {
    render(<InviteUserButton />);
    const inviteBtn = screen.getByText(t('in-settings:tabs.inviteUser'));
    expect(inviteBtn).toBeVisible();
    fireEvent.click(inviteBtn);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});
