import PropTypes from 'prop-types';
import React from 'react';

import {
  fieldNames,
  getStatusCodeLabel,
  getMetricLabel
} from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import SelectedAlertTypeInfo from 'in-websites/eum-alerting/components/SelectedAlertTypeInfo';
import ProvideStatusCode from 'in-websites/eum-alerting/components/ProvideStatusCode';
import StatusCodeChart from 'in-websites/eum-alerting/components/StatusCodeChart';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';

import locals from './UseCaseSelection.mless';

export default function StatusCodeUseCaseSelection({ form, timeConfig, onChange, granularity, isReadOnly }) {
  const metricName = form.get(fieldNames.ruleMetricName).value;
  let chart = (
    <StatusCodeChart
      form={form}
      onChange={!isReadOnly ? onChange : undefined}
      timeConfig={timeConfig}
      granularity={granularity}
    />
  );

  if (!isReadOnly) {
    chart = <ChartContainer headline="Specific HTTP Status Codes">{chart}</ChartContainer>;
  }
  return (
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
        <ProvideStatusCode form={form} onChange={onChange} />
      )}
      <div className={locals.chartContainer}>{chart}</div>
    </ExpandableCard>
  );
}

StatusCodeUseCaseSelection.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  timeConfig: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired
};
