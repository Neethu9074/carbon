import React from 'react';

import combinedValidationResults from 'in-services/util/validation';
import { create, combineLatest } from 'reactive-observables';
import { validate } from 'in-api/search';

export default class FormDataEnrichment extends React.Component {
  static displayName = 'FormDataEnrichment';

  queryInput = create();
  validationResultSubscription = null;

  componentWillMount() {
    const debouncedQuery = this.queryInput.debounce(1000);
    this.queryInput.emit(this.props.form.get('query').value);
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
      });
  }

  componentWillUpdate(nextProps) {
    this.queryInput.emit(nextProps.form.get('query').value);
  }

  shouldComponentUpdate(nextProps) {
    const prevQuery = this.props.form.get('query').value;
    const nextQuery = nextProps.form.get('query').value;
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

  render() {
    return null;
  }
}
