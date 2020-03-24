import PropTypes from 'prop-types';
import React from 'react';

import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { withSlownessFormHistoricBaseline } from 'in-websites/eum-alerting/form/slownessForm';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import createRuleForm from 'in-websites/eum-alerting/form/ruleForm';
import * as constants from 'in-websites/eum-alerting/constants';
import Button from 'in-new-components/Button/Button';

import locals from './AlertTypeDescription.mless';

export function AlertTypeDescription({ form, config, selectButtonDisabled, setSelectButtonDisabled, updateForm }) {
  const { headline, text } = config;

  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>{headline}</h3>
        <DangerousHtmlPresenter className={locals.text} html={text} />
      </div>
      {form && (
        <Button
          kind={selectButtonDisabled ? 'info' : 'primary'}
          className={locals.button}
          disabled={selectButtonDisabled}
          onClick={() => {
            if (form && updateForm) {
              setSelectButtonDisabled(true);
              updateFormAndCallOnChange(form, config, updateForm);
            }
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
  updateForm: PropTypes.func,
  selectButtonDisabled: PropTypes.bool,
  setSelectButtonDisabled: PropTypes.func
};

function updateFormAndCallOnChange(form, config, updateForm) {
  const newRuleForm = createRuleForm(
    {
      ...form.get('rule').toJS(),
      alertType: config.type
    },
    form.get(fieldNames.thresholdType).value
  );

  let newForm = form.put('rule', newRuleForm);

  if (config.type === alertTypes.specificJsError) {
    newForm = newForm.updateIn(['rule', 'metricName'], f => f.setValue(constants.errorCount).setTouched(true));
    updateForm(
      withJsErrorsFormSpecificError(newForm)
        .updateIn([fieldNames.thresholdType], f => f.setValue('staticThreshold').setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }

  if (config.type === alertTypes.slowness) {
    newForm = newForm.updateIn(['rule', 'metricName'], f => f.setValue(constants.onLoadTime).setTouched(true));
    updateForm(
      withSlownessFormHistoricBaseline(newForm)
        .updateIn([fieldNames.thresholdType], f => f.setValue('historicBaseline.DAILY').setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }

  if (config.type === alertTypes.specificStatusCode) {
    newForm = newForm.updateIn(['rule', 'metricName'], f => f.setValue(constants.statusCodeCount).setTouched(true));
    updateForm(
      withStatusCodesFormSpecificStatusCode(newForm)
        .updateIn([fieldNames.thresholdType], f => f.setValue('staticThreshold').setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
}
