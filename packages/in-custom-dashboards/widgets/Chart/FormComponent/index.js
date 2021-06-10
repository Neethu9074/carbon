/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PotentialProblemsConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/PotentialProblemsConfigurator';
import DataSeriesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/DataSeriesConfigurator';
import AxesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/AxesConfigurator';
import { potentialProblemsInCustomDashboardEnabled } from 'in-services/featureFlags';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Chart/util';
import Divider from 'in-new-components/workspace/Divider';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-components/layout/Stack';
import { t } from 'in-i18n';

export default function ChartWidgetFormComponent({ form, onChange }) {
  return (
    <Stack space="large">
      <Stack space="normal">
        <Header>{t('in-custom-dashboards:widgets.formCompChart.indexChart.datasets')}</Header>
        <DataSeriesConfigurator form={form} onChange={onChange} getShortMetricKey={getShortMetricKey} />
      </Stack>

      <Divider />

      <Stack space="normal">
        <Header>{t('in-custom-dashboards:widgets.formCompChart.indexChart.axisConfig')}</Header>
        <AxesConfigurator form={form} onChange={onChange} getShortMetricKey={getShortMetricKey} />
      </Stack>

      {potentialProblemsInCustomDashboardEnabled && (
        <>
          <Divider />

          <Stack space="normal">
            <Header>{t('in-custom-dashboards:widgets.formCompChart.indexChart.potentialProblems')}</Header>
            <PotentialProblemsConfigurator form={form} onChange={onChange} />
          </Stack>
        </>
      )}
    </Stack>
  );
}
