/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { ScopeWrapper, SectionWrapper } from 'in-alerting/smart-alerts/infrastructure/tearsheet/Wrapper';

describe('ScopeWrapper', () => {
  const children = <div>Test Children</div>;

  it('renders without crashing', () => {
    const { getByText } = render(
      <ScopeWrapper title="Test Title" description="Test Description" gap="small">
        {children}
      </ScopeWrapper>
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Test Children')).toBeTruthy();
  });
});

describe('SectionWrapper', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(
      <SectionWrapper>
        <p>Section</p>
      </SectionWrapper>
    );
    expect(baseElement).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <SectionWrapper>
        <p>Section</p>
      </SectionWrapper>
    );
    expect(getByText('Section')).toBeTruthy();
  });
});
