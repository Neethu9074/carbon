/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/ApplicationHealth/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/ApplicationHealth/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);
    screen.getByText(t('in-custom-dashboards:widgets.applicationHealth.index.applicationHealth'));
    await screen.findByText('k8s-demo');
    await screen.findByText('kubernetes label not contain');
    await screen.findByText('payment service');

    // pagination items
    await screen.findByText('1');
    await screen.findByText('2');
    await screen.findByText('3');
  });
});
