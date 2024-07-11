/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';

describe('in-alerting/components/TearSheetStepContentWrapper', () => {
  it('renders component correctly', () => {
    const props = {
      headline: 'Test headline',
      description: 'Test description',
      children: <></>
    };
    render(<TearSheetStepContentWrapper {...props} />);
    expect(screen.getByText(props.headline)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });
});
