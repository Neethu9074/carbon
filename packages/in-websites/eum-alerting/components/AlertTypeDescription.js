import PropTypes from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import Button from 'in-new-components/Button/Button';

import locals from './AlertTypeDescription.mless';

export function AlertTypeDescription({ form, config, onChange }) {
  const { headline, text, additionalContent } = config.description;
  return (
    <div className={locals.container}>
      <div>
        <h3 className={locals.headline}>{headline}</h3>
        <p>{text}</p>
        {additionalContent && <DangerousHtmlPresenter html={additionalContent} />}
      </div>
      {form && (
        <Button className={locals.button} onClick={() => onChange(form, fieldNames.ruleAlertType, config.type)}>
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
