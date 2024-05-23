/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import ShareAndInviteDialogBox from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { t } from 'in-i18n';

describe('in-settings/tabs/TeamSettings/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox', () => {
  it('Check if the email message has a placeholder', () => {
    const { getByPlaceholderText } = render(<ShareAndInviteDialogBox />);
    expect(getByPlaceholderText(t('in-settings:ShareAndInviteDialogBox.defaultEmailMessage'))).toBeInTheDocument();
  });
});
