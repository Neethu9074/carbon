import { createField, createMapForm, notBlankValidator, composeValidators } from 'formalistic';
import { compose, withProps } from 'recompose';

import EditTagFilterDialogPresenter from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialogPresenter';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { numericValidator } from 'in-services/validators/number';
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
  withProps(({ tagFilter, tagFilters, setTagFilters, selectedTagType, setForm }) => ({
    onClose: close,
    editMode: tagFilter,
    operatorSuggestions: TAG_TYPES[selectedTagType].operators,
    keySuggestions: [], // TODO
    valueSuggestions: [], // TODO
    onRemoveTagFilter: () => {
      setTagFilters(tagFilters.filter(f => f !== tagFilter));
      close();
    },
    onTagChange: tag => setForm(createForm(tag))
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
    selectedTagType: getTagType(form.get('tag').value)
  };
}

function createForm(tag, tagFilter) {
  const resolvedTag = tagFilter ? tagFilter.name : tag;
  const tagType = getTagType(resolvedTag);

  let form = createMapForm()
    .put(
      'tag',
      createField({
        value: resolvedTag,
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: tagFilter ? tagFilter.operator : 'EQUALS',
        validator: notBlankValidator
      })
    );

  let key;
  let keyValidator;
  let value;
  let valueValidator = notBlankValidator;
  if (tagType === 'STRING') {
    value = tagFilter ? tagFilter.stringValue || '' : '';
  } else if (tagType === 'NUMBER') {
    value = tagFilter ? String(tagFilter.numberValue || 0) : '0';
    valueValidator = composeValidators(notBlankValidator, numericValidator);
  } else if (tagType === 'BOOLEAN') {
    value = tagFilter ? String(tagFilter.booleanValue || false) : 'true';
  } else if (tagType === 'KEY_VALUE_PAIR') {
    if (form.get('operator').value === 'NOT_EMPTY' || form.get('operator').value === 'IS_EMPTY') {
      key = tagFilter ? tagFilter.stringValue : '';
      keyValidator = notBlankValidator;
    } else {
      const [matchedKey, matchedValue] = tagFilter ? tagFilter.stringValue.split('=', 2) : ['', ''];
      key = matchedKey;
      keyValidator = notBlankValidator;
      value = matchedValue;
    }
  }

  if (key != null) {
    form = form.put(
      'key',
      createField({
        value: key,
        validator: keyValidator
      })
    );
  }

  if (value != null) {
    form = form.put(
      'value',
      createField({
        value: value,
        validator: valueValidator
      })
    );
  }

  return form;
}
