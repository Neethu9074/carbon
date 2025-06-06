/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import GetStartedFreetrial from 'in-plg/components/NoviceToPro/GetStartedFreetrial';

jest.mock('in-stores/user', () => ({
  user: { fullName: 'Test User', email: 'test@example.com' }
}));

jest.mock('in-services/userSettings', () => ({
  saveUserSettings: jest.fn()
}));

jest.mock('in-services/userSettings/globals', () => ({
  userSettings: {}
}));

jest.mock('in-i18n', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'in-plg:trialNoviceToProDialog.getStarted': 'Ready to get started?',
      'in-plg:trialNoviceToProDialog.descriptionFreeTrial': 'Deploy an agent to see your own data in action.',
      'in-plg:trialNoviceToProDialog.descriptionSandbox':
        'Or explore Instana in the Sandbox – our interactive demo environment with sample data.',
      'in-plg:trialNoviceToProDialog.trialButtonData': 'Start with my own data',
      'in-plg:trialNoviceToProDialog.sandboxButtonData': 'Start with sample data'
    };
    return translations[key] || key;
  }
}));

jest.mock('@instana/ibm-products', () => ({
  Tearsheet: ({ children }: any) => <div data-testid="tearsheet">{children}</div>
}));

jest.mock('in-plg/components/NoviceToPro/assets/GetStarted.png', () => 'mock-image-path');

describe('GetStartedFreetrial', () => {
  const handleButtonClick = jest.fn();

  it('renders welcome message and progress steps', () => {
    render(<GetStartedFreetrial handleButtonClick={handleButtonClick} />);

    expect(screen.getByText(/Ready to get started?/)).toBeInTheDocument();
    expect(screen.getByText(/Deploy an agent to see your own data in action./)).toBeInTheDocument();
    expect(
      screen.getByText(/Or explore Instana in the Sandbox – our interactive demo environment with sample data./)
    ).toBeInTheDocument();
  });

  it('renders trial and sandbox buttons', () => {
    render(<GetStartedFreetrial handleButtonClick={handleButtonClick} />);

    expect(screen.getByText('Start with my own data')).toBeInTheDocument();
    expect(screen.getByText('Start with sample data')).toBeInTheDocument();
  });

  it('calls handleButtonClick when Free Trial button is clicked', () => {
    render(<GetStartedFreetrial handleButtonClick={handleButtonClick} />);

    fireEvent.click(screen.getByText('Start with my own data'));
    expect(handleButtonClick).toHaveBeenCalledTimes(1);
  });

  it('calls saveUserSettings and sets window.instana.termsAndPrivacySettings on Sandbox click', () => {
    const { saveUserSettings } = require('in-services/userSettings');
    render(<GetStartedFreetrial handleButtonClick={handleButtonClick} />);

    // Mock window.instana
    (window as any).instana = {};

    fireEvent.click(screen.getByText('Start with sample data'));

    expect(saveUserSettings).toHaveBeenCalledTimes(1);
    const callback = saveUserSettings.mock.calls[0][1];
    const fakeSettings = { foo: 'bar' };
    callback(fakeSettings);
    expect(window.instana.termsAndPrivacySettings).toEqual(fakeSettings);
  });

  it('has sandbox link with prefilled email', () => {
    render(<GetStartedFreetrial handleButtonClick={handleButtonClick} />);
    const sandboxLink = screen.getByRole('link', {
      name: /Start with sample data/i
    });
    expect(sandboxLink).toHaveAttribute('href', expect.stringContaining('test%40example.com'));
  });
});
