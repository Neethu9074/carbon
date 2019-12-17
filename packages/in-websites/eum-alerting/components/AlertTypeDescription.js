import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import Button from 'in-new-components/Button/Button';

import locals from './AlertTypeDescription.mless';

export function AlertTypeDescription({ form, config, onChange }) {
  const { headline, text } = config;

  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>{headline}</h3>
        <DangerousHtmlPresenter className={locals.text} html={text} />
      </div>
      {form && (
        <Button
          className={locals.button}
          onClick={() => {
            // addMetricForOnLoadTime will onle be added this way as long as we have not the secondary menu to select alert types
            const addMetricForOnLoadTime = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };
            // addMetricForJsErrors will onle be added this way as long as we have not the secondary menu to select alert types
            const addMetricForJsErrors = { name: fieldNames.ruleMetricName, value: 'errors' };

            const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
            onChange(
              form,
              fieldNames.ruleAlertType,
              config.type,
              config.type === 'slowness' ? addMetricForOnLoadTime : addMetricForJsErrors,
              doCalculateTresholdOnBackend
            );
          }}
        >
          Select
        </Button>
      )}
    </div>
  );
}

AlertTypeDescription.propTypes = {
  config: PropTypes.object.isRequired,
  form: PropTypes.object,
  onChange: PropTypes.func
};
