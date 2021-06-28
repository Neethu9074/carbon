/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { metricKey, comparisonMetricKey } from 'in-components/KpiCard/BigNumberKpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { Widget } from 'in-custom-dashboards/widgets/BigNumber';
import { successObservable } from 'in-services/util/result';

jest.mock('in-subscription/getUnifiedMetrics');

describe('in-custom-dashboards/widgets/BigNumber/Widget', () => {
  it('must render simple widget', async () => {
    getUnifiedMetrics.mockReturnValue(
      successObservable([
        {
          id: metricKey,
          values: [[Date.now(), 45]]
        },
        {
          id: comparisonMetricKey,
          values: [[Date.now(), 42]]
        }
      ])
    );

    const config = {
      formatter: 'number.detailed',
      metricConfiguration: {
        timeShift: -86400000
      },
      comparisonDecreaseColor: 'greenish',
      comparisonIncreaseColor: 'redish'
    };
    const title = 'Number of Calls (globally)';

    render(<Widget title={title} config={config} />);
    screen.getByText(title);
    await screen.findByText('45.00');
    await screen.findByText('+7.14%');
  });
});
