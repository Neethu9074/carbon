/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ApplicationLabelContent from 'in-synthetics/dashboards/global/tabs/tests/components/ApplicationLabelContent';

describe('ApplicationLabelContent', () => {
  it('displays the application label when provided', () => {
    render(<ApplicationLabelContent applicationId="123" applicationLabel="Test Application" shouldDisplayLink />);
    expect(screen.getByText('Test Application')).toBeInTheDocument();
    expect(screen.getByTitle('linked')).toBeInTheDocument();
  });

  it('does not display a link when shouldDisplayLink is false', () => {
    render(
      <ApplicationLabelContent applicationId="123" applicationLabel="Test Application" shouldDisplayLink={false} />
    );
    expect(screen.getByTitle('notLinked')).toBeInTheDocument();
  });

  it('displays an empty string when no label is provided', () => {
    render(<ApplicationLabelContent applicationId="123" applicationLabel="" shouldDisplayLink />);
    expect(screen.getByTitle('empty')).toBeInTheDocument();
  });
});
