/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ShareAndInviteDialogBox from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { t } from 'in-i18n';

describe('in-settings/tabs/TeamSettings/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox', () => {
  it('Check if the email message has a placeholder.', () => {
    const { getByPlaceholderText } = render(<ShareAndInviteDialogBox />);
    expect(getByPlaceholderText(t('in-settings:ShareAndInviteDialogBox.defaultEmailMessage'))).toBeInTheDocument();
  });

  it('Check if the number of users that can be added is limited to 5.', () => {
    render(<ShareAndInviteDialogBox />);
    const button = screen.getByText(t('in-settings:ShareAndInviteDialogBox.addUser'));
    expect(button).toBeInTheDocument();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(button);
    }
    const userList = screen.getByTestId('user-list').children.length;
    expect(userList).toBe(5);
  });
});
