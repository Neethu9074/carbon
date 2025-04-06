/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { ShowPrivacyNotification } from 'in-plg/components/ShowPrivacyNotification/ShowPrivacyNotification';

jest.mock('in-i18n', () => ({
  ...jest.requireActual('in-i18n'),
  t: (key: string) => key,
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

describe('ShowPrivacyNotification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders when localStorage does not have "shown" key', () => {
    render(<ShowPrivacyNotification />);
    expect(screen.getByText('in-plg:privacyNotification.title')).toBeInTheDocument();
    expect(screen.getByText('in-plg:privacyNotification.description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'in-plg:privacyNotification.buttonText' })).toBeInTheDocument();
  });

  it('does not render when localStorage has "shown" key', () => {
    localStorage.setItem('showPrivacyNotification', 'shown');
    render(<ShowPrivacyNotification />);
    expect(screen.queryByText('in-plg:privacyNotification.title')).not.toBeInTheDocument();
  });
});
