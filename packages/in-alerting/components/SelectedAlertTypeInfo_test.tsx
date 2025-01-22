/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';

describe('SelectedAlertTypeInfo', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <SelectedAlertTypeInfo
        title="Test Title"
        description="Test Description"
        svgIconType="testSvgIcon"
        darkSvgIcon
        badges={['testBadge']}
      />
    );
    expect(container).toBeTruthy();
  });

  it('renders with no badges', () => {
    const { container } = render(
      <SelectedAlertTypeInfo
        title="Test Title"
        description="Test Description"
        svgIconType="testSvgIcon"
        darkSvgIcon
        badges={[]}
      />
    );
    expect(container).toBeTruthy();
  });

  it('renders with no svg icon', () => {
    const { container } = render(
      <SelectedAlertTypeInfo
        title="Test Title"
        description="Test Description"
        svgIconType=""
        darkSvgIcon
        badges={['testBadge']}
      />
    );
    expect(container).toBeTruthy();
  });

  it('renders with no title', () => {
    const { container } = render(
      <SelectedAlertTypeInfo
        title=""
        description="Test Description"
        svgIconType="testSvgIcon"
        darkSvgIcon
        badges={['testBadge']}
      />
    );
    expect(container).toBeTruthy();
  });

  it('renders with no description', () => {
    const { container } = render(
      <SelectedAlertTypeInfo
        title="Test Title"
        description=""
        svgIconType="testSvgIcon"
        darkSvgIcon
        badges={['testBadge']}
      />
    );
    expect(container).toBeTruthy();
  });
});
