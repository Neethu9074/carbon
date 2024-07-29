/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { Variant } from '@instana/components/types/components/Typography/types';

import AlertTypography from 'in-alerting/components/AlertTypography';

describe('in-alerting/components/AlertingTearSheet', () => {
  const props = {
    variant: 'heading-200' as Variant,
    color: 'color900',
    content: null,
    noMargin: true,
    children: false
  };
  it('Test component renders nothing when content is not provided', () => {
    const { container } = render(<AlertTypography {...props} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Test component renders the content with the correct variant and no margin', () => {
    const content = 'This is some text';
    const { getByText } = render(<AlertTypography {...props} content={content} />);

    expect(getByText(content)).toBeInTheDocument();
  });
});
