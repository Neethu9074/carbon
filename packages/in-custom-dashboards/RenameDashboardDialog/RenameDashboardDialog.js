import { createField, notBlankValidator } from 'formalistic';
import { compose, withProps } from 'recompose';

import RenameDashboardDialogPresenter from 'in-custom-dashboards/RenameDashboardDialog/RenameDashboardDialogPresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';

export default compose(
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['title'],
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
    onChange: newValue => setField(field.setValue(newValue).setTouched(true)),
    onSubmit() {
      if (!field.valid) {
        setField(field.setTouched(true));
        return;
      }

      onSubmit(field.value);
      close();
    }
  }))
)(RenameDashboardDialogPresenter);

function getInitialState({ title }) {
  return {
    field: createField({
      value: title ?? '',
      validator: notBlankValidator
    })
  };
}
