/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';

describe('Section Component', () => {
  const title = 'Test Title';
  const content = 'This is content';
  const actions = 'Action buttons here';

  it('renders title and children correctly', () => {
    render(
      <Section title={title}>
        <div>{content}</div>
      </Section>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <Section title={title} actions={<div>{actions}</div>}>
        <div>{content}</div>
      </Section>
    );

    expect(screen.getByText(actions)).toBeInTheDocument();
  });

  it('sets htmlFor when titleHtmlFor is passed', () => {
    const { container } = render(
      <Section title={title} titleHtmlFor="input-id">
        <div>{content}</div>
      </Section>
    );

    const label = container.querySelector('label');
    expect(label).toHaveAttribute('for', 'input-id');
  });
});
