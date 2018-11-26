import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { compose, withProps } from 'recompose';

import EditTagFilterDialogPresenter from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialogPresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { getTagType } from 'in-applications/tags';

export default compose(
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['tagFilter', 'tagSuggestions'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setForm',
    reducer: (prev, form) => getState(form)
  }),
  withProps(({ tagFilter, tagFilters, setTagFilters, selectedTagType }) => ({
    onClose: close,
    editMode: tagFilter,
    operatorSuggestions: TAG_TYPES[selectedTagType].operators,
    keySuggestions: [], // TODO
    valueSuggestions: [], // TODO
    onRemoveTagFilter: () => {
      setTagFilters(tagFilters.filter(f => f !== tagFilter));
      close();
    }
    // onTagChange={action('onTagChange')}
    // onOperatorChange={action('onOperatorChange')}
    // onKeyChange={action('onKeyChange')}
    // onValueChange={action('onValueChange')}
    // onSubmit={action('onSubmit')}
  }))
)(EditTagFilterDialogPresenter);

function getInitialState({ tagSuggestions, tagFilter }) {
  return getState(createForm(tagSuggestions[0], tagFilter));
}

function getState(form) {
  return {
    form,
    selectedTagType: getTagType(form.get('tag').value) || 'STRING'
  };
}

function createForm(tag /*, tagFilter*/) {
  return createMapForm()
    .put(
      'tag',
      createField({
        value: tag,
        validator: notBlankValidator
      })
    )
    .put(
      'key',
      createField({
        value: 'environment',
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: 'production',
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: 'EQUALS',
        validator: notBlankValidator
      })
    );
}
