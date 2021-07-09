/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCaseComponent from 'in-custom-dashboards/widgets/TimeZones/ShowCase';
import { demo } from 'in-custom-dashboards/widgets/TimeZones/demo';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/TimeZones/ShowCase', () => {
  it('must render simple widget', async () => {
    render(<ShowCaseComponent />);

    await screen.findByText(t('in-custom-dashboards:widgets.timezone.demo.title'));

    const timeZones = demo.slice(2, 5);
    for (let i = 0; i < timeZones.length; i++) {
      const { label } = timeZones[i];
      await screen.findByText(label);
    }
  });
});
