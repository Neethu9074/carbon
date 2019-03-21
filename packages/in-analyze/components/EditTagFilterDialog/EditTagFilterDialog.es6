import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { timeout, empty } from 'reactive-observables';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';

import EditTagFilterDialogPresenter from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialogPresenter';
import { getTagType, requiresSecondLevelName, isLatencyTag } from 'in-applications/tags';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { positiveNumberValidator } from 'in-services/validators/number';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { close } from 'in-components/DialogPresenter/store';
import { compareIgnoreCase } from 'in-services/util/string';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
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
      addTagFilter,
      updateTagFilter,
      removeTagFilter,
      selectedTagType,
      setForm,
      form,
      filterChangedTracker,
      filterRemovedTracker,
      forAnalyzeCalls
    }) => ({
      onClose: close,
      editMode: Boolean(tagFilter),
      operatorSuggestions: get(TAG_TYPES, [selectedTagType, 'operators'], [])
        // IS_BLANK and NOT_BLANK operator are only available when a second level key is defined
        .filter(
          operator =>
            (form.get('key') && !isBlank(form.get('key').value)) || (operator != 'IS_BLANK' && operator != 'NOT_BLANK')
        ),
      onRemoveTagFilter: () => {
        if (setTagFilters) {
          setTagFilters(tagFilters.filter(f => !isSameFilter(f, tagFilter)));
        }
        if (removeTagFilter) {
          removeTagFilter(tagFilter);
        }
        close();

        if (filterRemovedTracker) {
          const before = tagFilters.filter(f => isSameFilter(f, tagFilter));
          if (before.length > 0) {
            filterRemovedTracker({ name: tagFilter.name, filter: before[0] });
          } else {
            filterRemovedTracker({ name: tagFilter.name });
          }
        }
      },
      onTagChange: tag => setForm(createForm(tag, null, forAnalyzeCalls)),
      onOperatorChange: operator => {
        let updatedForm = form.updateIn(['operator'], f => f.setValue(operator).setTouched(true));
        if (isNoValueOperator(operator)) {
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
      onKeyChange: key => {
        let updatedForm = form.updateIn(['key'], f => f.setValue(key).setTouched(true));
        if (form.get('value')) {
          updatedForm = updatedForm.updateIn(['value'], f => f.setValue(''));
        }
        setForm(updatedForm);
      },
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

        if (forAnalyzeCalls) {
          // for analyze traces/calls
          newTagFilter.value = form.containsKey('value') && form.get('value').value;
          newTagFilter.secondLevelName = form.containsKey('key') && form.get('key').value;
        } else {
          // for website monitoring
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
        }

        if (addTagFilter) {
          addTagFilter(newTagFilter);
        }
        if (updateTagFilter) {
          updateTagFilter(newTagFilter);
        }
        if (setTagFilters) {
          setTagFilters(tagFilters.filter(f => !isSameFilter(f, tagFilter)).concat(newTagFilter));
        }
        close();

        const before = tagFilters.filter(f => isSameFilter(f, tagFilter));
        if (filterChangedTracker && before.length > 0) {
          filterChangedTracker({ before: before[0], after: newTagFilter });
        } else if (filterChangedTracker) {
          filterChangedTracker({ filter: newTagFilter });
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
      tagFilters: props.tagFilter ? props.tagFilters.filter(f => !isSameFilter(f, props.tagFilter)) : props.tagFilters
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

function getInitialState({ tagSuggestions, tagFilter, forAnalyzeCalls }) {
  return getState(createForm(tagSuggestions[0], tagFilter, forAnalyzeCalls));
}

function getState(form) {
  return {
    form,
    selectedTagType: getTagType(form.get('tag').value)
  };
}

function createForm(tag, tagFilter, forAnalyzeCalls) {
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
  if (forAnalyzeCalls) {
    let defaultValue = '';
    if (tagType === 'NUMBER') {
      // only allow filtering latencies with positive integers
      if (isLatencyTag(resolvedTag)) {
        defaultValue = '100';
        valueValidator = positiveNumberValidator;
      } else {
        defaultValue = '0';
      }
    } else if (tagType === 'BOOLEAN') {
      defaultValue = 'true';
    }

    value = tagFilter ? tagFilter.value || defaultValue : defaultValue;
    if (requiresSecondLevelName(resolvedTag)) {
      key = tagFilter ? tagFilter.secondLevelName : '';
      keyValidator = notBlankValidator;
    }
  } else if (tagType === 'STRING') {
    value = tagFilter ? tagFilter.stringValue || '' : '';
  } else if (tagType === 'NUMBER') {
    let defaultValue = 0;
    if (isLatencyTag(resolvedTag)) {
      defaultValue = 100;
      valueValidator = positiveNumberValidator;
    }
    value = tagFilter ? String(tagFilter.numberValue || defaultValue) : String(defaultValue);
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

  if (isNoValueOperator(form.get('operator').value)) {
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
        validator: valueValidator
      })
    );
  }

  return form;
}

function isSameFilter(f1, f2) {
  return f1 === f2;
}

function isNoValueOperator(operator) {
  return ['NOT_EMPTY', 'IS_EMPTY', 'NOT_BLANK', 'IS_BLANK'].includes(operator);
}
