/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { getSliConfigurations } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { success } from 'in-services/util/result';

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => ({
  getSliConfigurations: jest.fn()
}));

describe('in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator', () => {
  describe('SLI Data Source', () => {
    it('Displays an existing configuration of an SLO', () => {
      //GIVEN
      let form = createForm({
        source: 'SLI',
        metric: 'SLI',
        aggregation: 'MEAN',
        timeShift: 0,
        sliConfigId: 'sliConfigId',
        slo: 0.02
      });

      getSliConfigurations.mockReturnValueOnce(
        just(
          success([
            {
              id: 'sliConfigId',
              initialEvaluationTimestamp: 0,
              sliEntity: {},
              sliName: 'Stans SLI'
            }
          ])
        )
      );

      //WHEN
      const { getByText, getByLabelText, getByRole } = render(<MetricConfigurator form={form} />);

      //THEN
      expect(getByText('Service-Level Indicators')).toBeInTheDocument();
      expect(getByLabelText('Data Source')).toHaveValue('SLI');

      expect(getByRole('button')).toHaveTextContent('Stans SLI');

      expect(getByText('SLI')).toBeInTheDocument();
      expect(getByLabelText('Value Type')).toHaveValue('SLI');
    });
  });
});
