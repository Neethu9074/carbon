import PropTypes from 'prop-types';
import React from 'react';

import {
  fieldNames,
  getStatusCodeLabel,
  getMetricLabel
} from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getThreshold, getTimeThreshold } from 'in-websites/eum-alerting/alertConfigUtil';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import SelectedAlertTypeInfo from 'in-websites/eum-alerting/components/SelectedAlertTypeInfo';
import ProvideStatusCode from 'in-websites/eum-alerting/components/ProvideStatusCode';
import StatusCodeChart from 'in-websites/eum-alerting/components/StatusCodeChart';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';
import { modeAdvanced } from 'in-websites/eum-alerting/constants';

import locals from './UseCaseSelection.mless';

export default function StatusCodeUseCaseSelection({ form, timeConfig, onChange, granularity, isReadOnly }) {
  const metricName = form.get(fieldNames.ruleMetricName).value;
  let chart = isReadOnly ? (
    <StatusCodeAlertingBarChart
      websiteId={form.get(fieldNames.websiteId).value}
      threshold={getThreshold(form)}
      timeThreshold={getTimeThreshold(form)}
      timeConfig={timeConfig}
      tagFilters={form.get(fieldNames.tagFilters).value}
      numeratorFilter={{
        name: 'beacon.http.status',
        operator: form.get(fieldNames.ruleOperator).value,
        stringValue: form.get(fieldNames.ruleValue).value
      }}
      metricName={form.get(fieldNames.ruleMetricName).value}
      granularity={granularity}
      alertsPreviewEnabled
    />
  ) : (
    <StatusCodeChart form={form} onChange={onChange} timeConfig={timeConfig} granularity={granularity} />
  );

  return (
    <>
      <ExpandableCard
        title="Specific HTTP Status Codes"
        label={getMetricLabel(alertTypes.specificStatusCode, metricName)}
        bodyWithoutPadding
        openByDefault
        darkFrame={!isReadOnly}
        framed={isReadOnly}
        headerClassName={isReadOnly && locals.cardHeader}
      >
        {isReadOnly ? (
          <SelectedAlertTypeInfo
            title="HTTP Status Code"
            description={getStatusCodeLabel(form.get(fieldNames.ruleValue).value)}
          />
        ) : (
          <ProvideStatusCode form={form} onChange={onChange} mode={modeAdvanced} />
        )}
      </ExpandableCard>
      <div className={locals.chartContainer}>{chart}</div>
    </>
  );
}

StatusCodeUseCaseSelection.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  timeConfig: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired
};
