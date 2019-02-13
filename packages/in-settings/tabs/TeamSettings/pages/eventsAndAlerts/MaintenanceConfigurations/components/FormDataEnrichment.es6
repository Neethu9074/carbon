import React from 'react';

import { combinedValidationResults, valid } from 'in-settings/validation';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { create, combineLatest } from 'reactive-observables';
import { validate } from 'in-api/search';

export default class FormDataEnrichment extends React.Component {
  static displayName = 'FormDataEnrichment';

  queryInput = create();
  validationResultSubscription = null;

  componentWillMount() {
    const debouncedQuery = this.queryInput.debounce(1000);
    this.emitQueryIfNotBlank(getValueOrNull(this.props.form, 'query'));
    this.validationResultSubscription = debouncedQuery
      .flatMap(query => {
        return combineLatest([
          validate({ query, newApplicationModelEnabled: false }),
          validate({ query, newApplicationModelEnabled: true })
        ]);
      })
      .subscribe(([validationResponse10, validationResponse20]) => {
        this.props.onChange(
          'validationResult',
          combinedValidationResults(validationResponse10.body, validationResponse20.body)
        );
        this.props.onChange('queryValidationInProgress', false);
      });
  }

  componentWillUpdate(nextProps) {
    startValidationInProgress(nextProps.setForm, nextProps.form);
    this.emitQueryIfNotBlank(getValueOrNull(nextProps.form, 'query'));
  }

  shouldComponentUpdate(nextProps) {
    const prevQuery = getValueOrNull(this.props.form, 'query');
    const nextQuery = getValueOrNull(nextProps.form, 'query');
    if (prevQuery !== nextQuery) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    if (this.validationResultSubscription) {
      this.validationResultSubscription.dispose();
      this.validationResultSubscription = null;
    }
  }

  emitQueryIfNotBlank = query => {
    if (isNotBlank(query)) {
      this.queryInput.emit(query);
    } else {
      if (this.props.form.containsKey('query')) {
        this.props.onChange('validationResult', valid());
        this.props.onChange('queryValidationInProgress', false);
      }
    }
  };

  render() {
    return null;
  }
}

function getValueOrNull(form, key) {
  return form.containsKey(key) ? form.get(key).value : null;
}

function startValidationInProgress(setForm, form) {
  const query = getValueOrNull(form, 'query');
  if (isBlank(query)) {
    return;
  }
  // hide previous error message
  let updatedForm = form.updateIn(['validationResult'], field => field.setValue(valid()).setTouched(false));
  // show progress indicator
  updatedForm = updatedForm.updateIn(['queryValidationInProgress'], field => field.setValue(true).setTouched(false));
  setForm(updatedForm);
}
