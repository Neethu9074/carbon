/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/BigNumber/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/BigNumber/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);
    await screen.findByText(t('in-custom-dashboards:widgets.topList.index.topListLb'));
    await screen.findByText('12.34');
    await screen.findByText('+43.21%');
  });
});
