/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AssistMe from 'in-plg/components/AssistMe/AssistMe';

describe('AssistMe Component', () => {
  test('renders correctly', () => {
    render(<AssistMe />);
    const getAnswersLabel = screen.getByText('Get answers', { selector: 'button' });
    expect(getAnswersLabel).toBeInTheDocument();
  });
});
