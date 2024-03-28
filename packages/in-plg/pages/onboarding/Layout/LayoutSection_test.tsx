/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';

describe('in-plg/pages/onboarding/Layout/LayoutSection.tsx', () => {
  const title = 'Title';
  const children = <div data-testid="children">Body</div>;
  it('Check if the title and children are rendered.', () => {
    render(<LayoutSection title={title}>{children}</LayoutSection>);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });
});
