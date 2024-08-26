/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import WelcomeHeader from 'in-plg/components/WelcomeHeader/WelcomeHeader';

jest.mock('in-stores/user', () => ({
  user: {
    id: '1234',
    email: 'stan@instana.com',
    fullName: 'Stan'
  }
}));

const activation = {
  'instana#test': {
    c: {
      status: true,
      timestamp: 1580821677019
    }
  }
};

describe('WelcomeHeader Tests', () => {
  it('Check if Header exsists', () => {
    render(<WelcomeHeader onboardingHeaderEnabled accountActivationData={activation} />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('Check if Datepicker exsists', () => {
    render(<WelcomeHeader onboardingHeaderEnabled accountActivationData={activation} />);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('Check Welcome Header content when onboardingHeaderEnabled is true', async () => {
    render(<WelcomeHeader onboardingHeaderEnabled accountActivationData={activation} />);

    expect(screen.getByText(t('in-plg:welcomepage.heading') + ', Stan!')).toBeInTheDocument();
    expect(screen.getByText(t(t('in-components:time.dashboardHeaderButtonLive')))).toBeInTheDocument();
  });
});
