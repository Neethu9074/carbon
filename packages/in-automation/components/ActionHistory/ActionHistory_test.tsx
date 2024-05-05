/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import ActionHistory from 'in-automation/components/ActionHistory/ActionHistory';

describe('ActionHistory', () => {
  it('loads without crashing', () => {
    const { container } = render(<ActionHistory />);
    expect(container).toBeInTheDocument();
  });
});
