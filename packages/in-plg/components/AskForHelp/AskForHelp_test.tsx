/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';

describe('Ask For Help Component', () => {
  test('renders correctly', () => {
    render(<AskForHelp />);
    const inviteLabel = screen.getByText('Invite a colleague', { selector: 'span' });
    expect(inviteLabel).toBeInTheDocument();
  });
});
