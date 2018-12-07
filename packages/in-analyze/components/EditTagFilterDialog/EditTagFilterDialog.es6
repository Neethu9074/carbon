import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { timeout, empty } from 'reactive-observables';
import { compose, withProps } from 'recompose';

import EditTagFilterDialogPresenter from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialogPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { compareIgnoreCase } from 'in-services/util/string';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { getTagType } from 'in-applications/tags';
import connect from 'in-hoc/connectTo';

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
  withProps(
    ({
      tagFilter,
      tagFilters,
      setTagFilters,
      selectedTagType,
      setForm,
      form,
      filterAddedTracker,
      filterChangedTracker,
      filterRemovedTracker
    }) => ({
      onClose: close,
      editMode: Boolean(tagFilter),
      operatorSuggestions: TAG_TYPES[selectedTagType].operators,
      onRemoveTagFilter: () => {
        setTagFilters(tagFilters.filter(f => f !== tagFilter));
        close();

        if (filterRemovedTracker) {
          const before = tagFilters.filter(f => f === tagFilter);
          if (before.length > 0) {
            filterRemovedTracker({ name: tagFilter.name, filter: before[0] });
          } else {
            filterRemovedTracker({ name: tagFilter.name });
          }
        }
      },
      onTagChange: tag => setForm(createForm(tag)),
      onOperatorChange: operator => {
        let updatedForm = form.updateIn(['operator'], f => f.setValue(operator).setTouched(true));
        if (operator === 'NOT_EMPTY' || operator === 'IS_EMPTY') {
          updatedForm = updatedForm.remove('value');
        } else if (!updatedForm.get('value')) {
          updatedForm = updatedForm.put(
            'value',
            createField({
              value: '',
              validator: notBlankValidator
            })
          );
        }
        setForm(updatedForm);
      },
      onKeyChange: key => setForm(form.updateIn(['key'], f => f.setValue(key).setTouched(true))),
      onValueChange: value => setForm(form.updateIn(['value'], f => f.setValue(value).setTouched(true))),
      onSubmit: e => {
        stopPropagationAndPreventDefault(e);
        if (!form.hierarchyValid) {
          setForm(form.setTouched(true, { recurse: true }));
          return;
        }

        const newTagFilter = {
          name: form.get('tag').value,
          operator: form.get('operator').value
        };

        const isPresenceOperator =
          form.get('operator').value === 'NOT_EMPTY' || form.get('operator').value === 'IS_EMPTY';

        if (!isPresenceOperator && selectedTagType === 'BOOLEAN') {
          newTagFilter.booleanValue = 'true' === form.get('value').value;
        } else if (!isPresenceOperator && selectedTagType === 'NUMBER') {
          newTagFilter.numberValue = parseInt(form.get('value').value, 10);
        } else if (!isPresenceOperator && selectedTagType === 'STRING') {
          newTagFilter.stringValue = form.get('value').value;
        } else if (selectedTagType === 'KEY_VALUE_PAIR') {
          // Always include the '=' because when not present, backend treats 'key' as empty
          const value = [
            form.get('key') && form.get('key').value,
            (form.get('value') && form.get('value').value) || ''
          ].join('=');
          newTagFilter.stringValue = value;
        }

        setTagFilters(tagFilters.filter(f => f !== tagFilter).concat(newTagFilter));
        close();

        const before = tagFilters.filter(f => f === tagFilter);
        if (before.length > 0) {
          filterChangedTracker({ before: before[0], after: newTagFilter });
        } else {
          filterAddedTracker({ filter: newTagFilter });
        }
      }
    })
  ),
  connect((props, prevProps) => {
    const currentKey = props.form.get('key') != null ? props.form.get('key').value : null;
    const loadingProps = {
      ...props,
      key: currentKey,
      tag: props.form.get('tag').value,
      // Do not load suggestions with the tag filter that is being edited
      tagFilters: props.tagFilter ? props.tagFilters.filter(f => f !== props.tagFilter) : props.tagFilters
    };

    let keySuggestions$;
    if (props.getKeySuggestions && props.selectedTagType === 'KEY_VALUE_PAIR') {
      keySuggestions$ = props.getKeySuggestions(loadingProps);
    } else {
      keySuggestions$ = empty;
    }

    const prevKey =
      prevProps != null && prevProps.form && prevProps.form.get('key') != null ? prevProps.form.get('key').value : null;
    let valueSuggestions$;
    if (!props.getValueSuggestions) {
      valueSuggestions$ = empty;
    } else if (currentKey !== prevKey) {
      valueSuggestions$ = timeout(1500)
        .flatMap(() => props.getValueSuggestions(loadingProps))
        .startWith(pendingResult);
    } else {
      valueSuggestions$ = props.getValueSuggestions(loadingProps);
    }

    return {
      keySuggestions: keySuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      keySuggestionsLoading: keySuggestions$.map(r => r.progress.loading),
      valueSuggestions: valueSuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      valueSuggestionsLoading: valueSuggestions$.map(r => r.progress.loading)
    };
  })
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
  if (tagType === 'STRING') {
    value = tagFilter ? tagFilter.stringValue || '' : '';
  } else if (tagType === 'NUMBER') {
    value = tagFilter ? String(tagFilter.numberValue || 0) : '0';
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

  if (form.get('operator').value === 'NOT_EMPTY' || form.get('operator').value === 'IS_EMPTY') {
    value = null;
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
        validator: notBlankValidator
      })
    );
  }

  return form;
}
