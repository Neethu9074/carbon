/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import ProfileNew from 'in-settings/tabs/UserSettings/pages/Profile/ProfileNew';
import { pendingResult } from 'in-services/fixedObjects';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));
jest.mock('in-services/featureFlags', () => ({
  tealiumPrivacyEnabled: true,
  fullTermsConfigEnabled: true
}));
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('in-settings/tabs/UserSettings/pages/Profile/ProfileNew', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('should render loading skeleton when data is loading', () => {
    (useObservable as jest.Mock).mockReturnValue(pendingResult);
    render(<ProfileNew />);
    expect(screen.getByTestId('loading-skeleton')).toHaveClass('cds--skeleton__placeholder');
  });

  it('should render form with mock user data', () => {
    const mockUserData = {
      fullName: 'test name',
      email: 'test.email@example.com'
    };

    (useObservable as jest.Mock).mockReturnValue({
      data: mockUserData
    });

    window.instana.termsAndPrivacySettings = {
      ...window.instana.termsAndPrivacySettings,
      role: 'preferNotToSay',
      dynamicRole: '',
      testingGroup: true
    };
    const { getByText, getByPlaceholderText } = render(<ProfileNew />);

    expect(getByText('in-settings:tabs.profile.email')).toBeInTheDocument(); // Email heading
    expect(getByText('test.email@example.com')).toBeInTheDocument(); // actual email
    expect(getByText('in-settings:tabs.profile.emailHint')).toBeInTheDocument(); // email hint
    expect(getByText('in-settings:tabs.profile.name')).toBeInTheDocument(); // name heading
    expect(getByPlaceholderText('in-settings:tabs.profile.name')).toBeInTheDocument();
    expect(getByPlaceholderText('in-settings:tabs.profile.name')).toHaveValue('test name');
    expect(getByText('in-settings:tabs.profile.nameHint')).toBeInTheDocument(); // name hint

    const roleSelect = screen.getByLabelText('in-settings:terms.role');
    expect(roleSelect).toHaveValue('preferNotToSay');

    const checkbox = screen.getByTestId('testing-group');
    expect(checkbox).toBeChecked();
  });
  it('should show validation error when name is empty and submit is clicked', () => {
    (useObservable as jest.Mock).mockReturnValue({
      data: { fullName: '', email: 'test.email@example.com' }
    });
    const { getByPlaceholderText } = render(<ProfileNew />);
    const nameInput = getByPlaceholderText('in-settings:tabs.profile.name');
    fireEvent.change(nameInput, { target: { value: 'test name' } });
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'forms.actions.save' }));
    expect(screen.getByText('The value must not be blank.')).toBeInTheDocument();
  });
  it('should show another input field when role is set to "other"', () => {
    render(<ProfileNew />);
    const roleSelect = screen.getByLabelText('in-settings:terms.role');
    fireEvent.change(roleSelect, { target: { value: 'other' } });
    const dynamicRoleInput = screen.getByTestId('dynamic-role-selection');
    expect(dynamicRoleInput).toBeInTheDocument();
  });
});
