/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';

const testData = {
  //The text is not approved in time for the release, so do not put them in i18n files. The infoPanel is not displayed for now.
  title: 'Resource optimizations, powered by Turbonomic',
  columns: [
    {
      title: 'Set up integration',
      text: 'You can automate actions to comply with service level objectives and improve business efficiency.',
      link: {
        url: 'https://www.ibm.com',
        label: 'Set up'
      }
    },
    {
      title: 'Upgrade to Instana Premium',
      text: 'You can automate actions to comply with service levels and improve business efficiency.',
      link: {
        url: '#',
        label: 'Upgrade'
      }
    },
    {
      title: 'View documentation',
      text: 'You can automate actions to comply with service levels and improve business efficiency.',
      link: {
        url: '#',
        label: 'View docs'
      }
    }
  ]
};

// Test cases
describe('InfoPanel tests', () => {
  test('renders correctly with initial props', () => {
    const { getByText, getAllByRole } = render(<InfoPanel content={testData} />);
    expect(getByText('View documentation')).toBeInTheDocument();
    expect(getAllByRole('link')[0].href).toContain('https://www.ibm.com');
  });

  test('click of hide button', () => {
    const { queryByText, getByText, getAllByRole } = render(<InfoPanel content={testData} />);
    const hideButton = getAllByRole('button')[0];
    expect(getByText('Set up integration')).toBeInTheDocument();
    fireEvent.click(hideButton);
    expect(queryByText('Set up integration')).toBeNull();
  });
});
