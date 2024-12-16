/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/Histogram/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Histogram/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);

    await screen.findByText(t('in-custom-dashboards:widgets.histogram.demo.title'));

    // Maximum value should be displayed
    await screen.findByText('80');

    // Legend should be displayed
    await screen.findAllByText(`${t('in-components:histogram.metricLabel')} - Total 523`);
  });

  it('must render correct number of bars', async () => {
    const { container } = render(<ShowCaseComponent />);

    const bars = container.getElementsByClassName('local-css-bucket').length;

    await expect(bars).toBe(28);
  });
});
