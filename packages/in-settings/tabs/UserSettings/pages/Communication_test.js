/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Communication from 'in-settings/tabs/UserSettings/pages/Communication';
import { saveUserSettings } from 'in-settings/api/userSettings';
import { roles } from 'in-settings/terms/rolesConfig';
import { nothing } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

jest.mock('in-settings/api/userSettings');

describe('in-settings/tabs/UserSettings/pages/Communication', () => {
  it('must support role changes', () => {
    saveUserSettings.mockReturnValue(nothing);
    render(<Communication />);
    const htmlElement = screen.getByLabelText(t('in-settings:terms.role'));
    expect(htmlElement.value).toEqual('');

    // change role and hit save
    fireEvent.change(htmlElement, {
      target: {
        value: roles[1].value
      }
    });
    expect(htmlElement.value).toEqual(roles[1].value);
    fireEvent.click(screen.getByText('Save'));

    // ensure that the API call reflects our change
    expect(saveUserSettings.mock.calls.length).toEqual(1);
    expect(saveUserSettings.mock.calls[0][0].role).toEqual(roles[1].value);
  });
});
