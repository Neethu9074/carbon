/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SelectInSection } from 'in-alerting/smart-alerts/components/tearSheet/Section/SelectInSection';

// Mock CSS module
jest.mock('./SelectInSection.module.css', () => ({
  select: 'mock-select-class',
  actions: 'mock-actions-class'
}));

// Mock Section and Select components
jest.mock('in-alerting/smart-alerts/components/tearSheet/Section/Section', () => ({
  __esModule: true,
  default: ({ title, titleHtmlFor, hasError, children, actions, titleWidth }: any) => (
    <div data-testid="section">
      <div data-testid="title">{title}</div>
      <div data-testid="has-error">{String(hasError)}</div>
      <div data-testid="html-for">{titleHtmlFor}</div>
      <div data-testid="title-width">{titleWidth}</div>
      {actions && <div data-testid="actions">{actions}</div>}
      <div data-testid="children">{children}</div>
    </div>
  )
}));

describe('SelectInSection', () => {
  const baseProps = {
    label: 'Select Label',
    id: 'select-id',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]
  };

  const children = 'Test data';

  it('renders with label and options', () => {
    render(<SelectInSection {...baseProps}>{children}</SelectInSection>);

    expect(screen.getByTestId('title')).toHaveTextContent('Select Label');
    expect(screen.getByTestId('html-for')).toHaveTextContent('select-id');
  });

  it('passes hasError to Section', () => {
    render(
      <SelectInSection {...baseProps} hasError>
        {children}
      </SelectInSection>
    );
    expect(screen.getByTestId('has-error')).toHaveTextContent('true');
  });

  it('renders actions inside Section', () => {
    render(
      <SelectInSection {...baseProps} actions={<div>Actions here</div>}>
        {children}
      </SelectInSection>
    );
    expect(screen.getByTestId('actions')).toHaveTextContent('Actions here');
  });

  it('renders additionalContent below select', () => {
    render(
      <SelectInSection {...baseProps} additionalContent={<div>Additional Info</div>}>
        {children}
      </SelectInSection>
    );
    expect(screen.getByText('Additional Info')).toBeInTheDocument();
  });

  it('forwards ref to Select element', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <SelectInSection {...baseProps} ref={ref}>
        {children}
      </SelectInSection>
    );
    expect(ref.current?.tagName).toBe('SELECT');
  });

  it('passes titleWidth to Section', () => {
    render(
      <SelectInSection {...baseProps} titleWidth="15rem">
        {children}
      </SelectInSection>
    );
    expect(screen.getByTestId('title-width')).toHaveTextContent('15rem');
  });
});
