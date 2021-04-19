/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps } from 'recompose';
import { createField } from 'formalistic';

import PromptPresenter from 'in-new-components/Dialog/PromptPresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { notBlankValidator } from 'in-services/validators/string';

export default compose(
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['initialValue'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setField',
    reducer: (prevState, field) => ({
      ...prevState,
      field
    })
  }),
  withProps(({ field, setField, onSubmit }) => ({
    onChange: v => setField(field.setValue(v).setTouched(true)),
    onSubmit: () => {
      if (!field.valid) {
        setField(field.setTouched(true));
        return;
      }

      onSubmit(field.value);
    }
  }))
)(PromptPresenter);

function getInitialState({ initialValue }) {
  return {
    field: createField({
      value: initialValue ?? '',
      validator: notBlankValidator
    })
  };
}
