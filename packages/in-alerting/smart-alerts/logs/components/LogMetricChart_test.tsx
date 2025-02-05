/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { screen, render } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import { TimeConfig } from '@instana/types';

import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { LogMetricChart } from 'in-alerting/smart-alerts/logs/components/LogMetricChart';
import { chartTimeConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import data from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { t } from 'in-i18n';

const alertConfig = data.alertConfig as LogSmartAlertConfigWithMetadata;
const timeConfig = {
  ...chartTimeConfig
} as TimeConfig;
describe('LogMetricChart', () => {
  it('should render a chart preview for a log metric alert', () => {
    const result = shallow(<LogMetricChart alertConfig={alertConfig} timeConfig={timeConfig} />);
    expect(result).toMatchInlineSnapshot(`ShallowWrapper {}`);
  });

  it('should render No group selected message', () => {
    render(<LogMetricChart alertConfig={alertConfig} timeConfig={timeConfig} />);

    expect(screen.getByText(t('in-alerting:smartAlerts.logs.form.noDataForSelectedGroup'))).toBeInTheDocument();
  });
});
