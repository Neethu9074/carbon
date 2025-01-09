/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DialogContentWrapper from 'in-alerting/smart-alerts/components/dialog/DialogContentWrapper';

jest.mock('./styles.module.css', () => ({
  dialogSize75_85: 'dialogSize75_85'
}));

describe('DialogContentWrapper', () => {
  it('renders children correctly', () => {
    const childText = 'Hello, Test';
    render(
      <DialogContentWrapper>
        <span>{childText}</span>
      </DialogContentWrapper>
    );

    // Check if the child text is rendered
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('applies the correct CSS class', () => {
    render(
      <DialogContentWrapper>
        <div>Test</div>
      </DialogContentWrapper>
    );

    // Check if the wrapper div has the correct class applied
    const wrapper = screen.getByText('Test').parentElement;
    expect(wrapper).toHaveClass('dialogSize75_85');
  });
});
