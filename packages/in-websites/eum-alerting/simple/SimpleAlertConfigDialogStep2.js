import PropTypes from 'prop-types';
import React from 'react';

import AlertLocationFilters from 'in-websites/eum-alerting/components/AlertLocationFilters';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';

import locals from './SimpleAlertConfigDialogStep.mless';

export default function SimpleAlertConfigDialogStep2({ form, granularity, onChange, timeConfig, websiteLabel }) {
  return (
    <>
      <h1 className={locals.headline}>Where do you want the alert to trigger?</h1>
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
      </div>
      <ChartSwitch
        alertType={form.get(fieldNames.ruleAlertType).value}
        JsErrorsComponent={() => <JsErrorsChart form={form} timeConfig={timeConfig} granularity={granularity} />}
        SlownessComponent={() => <SlownessChart form={form} timeConfig={timeConfig} granularity={granularity} />}
      />
    </>
  );
}

SimpleAlertConfigDialogStep2.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};
