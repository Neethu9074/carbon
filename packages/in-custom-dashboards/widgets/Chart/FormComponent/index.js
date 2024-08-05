/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import DataSeriesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/DataSeriesConfigurator';
import AxesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/AxesConfigurator';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Chart/util';
import { unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function ChartWidgetFormComponent({ form, onChange }) {
  return (
    <Stack gap="large">
      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.formCompChart.indexChart.datasets')}</Header>
        <DataSeriesConfigurator
          form={form}
          onChange={onChange}
          getShortMetricKey={getShortMetricKey}
          withUnit={unitForInfraMetricsEnabled}
        />
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.formCompChart.indexChart.axisConfig')}</Header>
        <AxesConfigurator
          form={form}
          onChange={onChange}
          getShortMetricKey={getShortMetricKey}
          withUnit={unitForInfraMetricsEnabled}
        />
      </Stack>
    </Stack>
  );
}
