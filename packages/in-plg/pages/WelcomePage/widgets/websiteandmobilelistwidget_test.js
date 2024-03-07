/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import WebsitesAndMobileListWidget from 'in-plg/pages/WelcomePage/widgets/WebsitesAndMobileListWidget';

describe('WebsitesAndMobileListWidget', () => {
  it('renders without crashing', () => {
    render(<WebsitesAndMobileListWidget type="website" widgetLabel="Websites" />);
  });

  it('displays correct headers for websites', () => {
    const { getByText } = render(<WebsitesAndMobileListWidget type="website" widgetLabel="Websites" />);
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Page views')).toBeInTheDocument();
    expect(getByText('OnLoad times')).toBeInTheDocument();
  });

  it('displays correct headers for mobileApps', () => {
    const { getByText } = render(<WebsitesAndMobileListWidget type="mobileApp" widgetLabel="Websites" />);
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Sessions')).toBeInTheDocument();
    expect(getByText('Views')).toBeInTheDocument();
  });
});
