/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import DetailsOutputTab from 'in-automation/components/ActionHistory/DetailsOutputTab';

jest.mock('in-components/Code', () => ({ code, lang, softWrap }: { code: string; lang: string; softWrap: boolean }) => (
  <div data-testid="mock-code">
    Code: {code}, Lang: {lang}, SoftWrap: {softWrap ? 'true' : 'false'}
  </div>
));

describe('DetailsOutputTab', () => {
  it('renders without crashing', () => {
    render(<DetailsOutputTab output="Test output" />);
    expect(screen.getByTestId('mock-code')).toBeInTheDocument();
  });

  it('displays the correct output', () => {
    const testOutput = 'Test output';
    render(<DetailsOutputTab output={testOutput} />);
    expect(screen.getByTestId('mock-code')).toHaveTextContent(`Code: ${testOutput}, Lang: bash, SoftWrap: true`);
  });
});
