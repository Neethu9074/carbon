/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import WelcomeHeader from 'in-plg/components/WelcomeHeader/WelcomeHeader';

jest.mock('in-plg/pages/WelcomePage/OnboardingStepBuilder', () =>
  jest.fn(() => {
    return [
      {
        key: 'inviteUsers',
        title: 'Connect with your experts',
        description: 'Get help to complete setup tasks and try out product features.',
        buttonName: 'Invite users',
        buttonType: 'ghost',
        href: '/#/config/team/accessControl/users',
        hasPermission: true,
        isActionCompleted: false
      }
    ];
  })
);

jest.mock('in-stores/user', () => ({
  user: {
    id: '1234',
    email: 'stan@instana.com',
    fullName: 'Stan'
  }
}));

describe('WelcomeHeader Tests', () => {
  it('Check if Header exsists', () => {
    render(<WelcomeHeader onboardingHeaderEnabled />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('Check if Datepicker exsists', () => {
    render(<WelcomeHeader onboardingHeaderEnabled />);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('Check Welcome Header content when onboardingHeaderEnabled is true', async () => {
    render(<WelcomeHeader onboardingHeaderEnabled />);

    expect(screen.getByText(t('in-plg:welcomepage.heading') + ', Stan!')).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.foldableTileTitle'))).toBeInTheDocument();
    expect(screen.getByText(t(t('in-components:time.dashboardHeaderButtonLive')))).toBeInTheDocument();
  });
});
