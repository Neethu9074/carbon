import PropTypes from 'prop-types';
import React from 'react';

import createBlueprintForm from 'in-websites/eum-alerting/form/blueprintFormCreator';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
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
  updateForm(
    createBlueprintForm(form, config.type).updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
      f.setValue(true)
    )
  );
}
