/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

import TearSheetStepTitleWrapper, {
  TearSheetStepTitleWrapperProps
} from 'in-alerting/components/TearSheetStepTitleWrapper';

describe('TearSheetStepTitleWrapper', () => {
  const props: TearSheetStepTitleWrapperProps = {
    headline: 'Headline',
    children: <div>Test</div>,
    description: 'Description',
    hideSpace: false
  };
  it('renders without crashing', () => {
    const { container } = render(<TearSheetStepTitleWrapper {...props} />);
    expect(container).toBeTruthy();
  });

  it('renders headline', () => {
    const { getByText } = render(<TearSheetStepTitleWrapper {...props} />);
    expect(getByText('Headline')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(<TearSheetStepTitleWrapper {...props} />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('renders description', () => {
    const { getByText } = render(<TearSheetStepTitleWrapper {...props} hideSpace />);
    expect(getByText('Description')).toBeTruthy();
  });
});
