/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/Pie/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Pie/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);

    // legend should be present
    await screen.findByText(t('in-custom-dashboards:widgets.pie.index.testLegendItem1'));
    await screen.findByText(t('in-custom-dashboards:widgets.pie.index.testLegendItem2'));
    await screen.findByText(t('in-custom-dashboards:widgets.pie.index.testLegendItem3'));

    const charts = document.getElementsByTagName('svg');
    expect(charts).toBeDefined();
    expect(charts).toHaveLength(1);

    const paths = document.getElementsByTagName('path');
    expect(paths).toBeDefined();
    expect(paths).toHaveLength(3);
  });
});
