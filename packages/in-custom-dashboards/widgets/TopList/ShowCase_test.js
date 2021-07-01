/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/TopList/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/TopList/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);

    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListLb'));
    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListItem', { itemNumber: 0 }));
    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListItem', { itemNumber: 1 }));
    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListItem', { itemNumber: 2 }));
    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListItem', { itemNumber: 3 }));
    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListItem', { itemNumber: 4 }));

    await screen.findByText('70,000.00');
    await screen.findByText('35,000.00');
    await screen.findByText('23,333.33');
    await screen.findByText('17,500.00');
    await screen.findByText('14,000.00');

    const lis = document.getElementsByTagName('li');
    expect(lis).toBeDefined();
    expect(lis).toHaveLength(5);
  });
});
