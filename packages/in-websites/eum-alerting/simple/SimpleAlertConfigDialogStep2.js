import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/components/SimpleModeStepContentWrapper';
import AlertLocationFilters from 'in-new-components/Alerting/components/AlertLocationFilters';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import StatusCodeChart from 'in-websites/eum-alerting/components/StatusCodeChart';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';

import locals from './SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({ form, granularity, onChange, timeConfig, websiteLabel }) {
  return (
    <SimpleModeStepContentWrapper headline="Where do you want the alert to trigger?">
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
      </div>
      <ChartSwitch
        alertType={form.get(fieldNames.ruleAlertType).value}
        JsErrorsComponent={() => <JsErrorsChart form={form} timeConfig={timeConfig} granularity={granularity} />}
        StatusCodeComponent={() => <StatusCodeChart form={form} timeConfig={timeConfig} granularity={granularity} />}
        SlownessComponent={() => <SlownessChart form={form} timeConfig={timeConfig} granularity={granularity} />}
      />
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};
