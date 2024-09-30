/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/Pie/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Pie/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);

    // legend should be present
    let legend = await screen.findAllByText(t('in-custom-dashboards:widgets.pie.index.testLegendItem1'));
    expect(legend[0]).toBeVisible();

    legend = await screen.findAllByText(t('in-custom-dashboards:widgets.pie.index.testLegendItem2'));
    expect(legend[0]).toBeVisible();

    legend = await screen.findAllByText(t('in-custom-dashboards:widgets.pie.index.testLegendItem3'));
    expect(legend[0]).toBeVisible();

    const charts = document.getElementsByTagName('svg');
    expect(charts).toBeDefined();
    expect(charts).toHaveLength(1);

    const paths = document.getElementsByTagName('path');
    expect(paths).toBeDefined();
    expect(paths).toHaveLength(3);
  });
});
