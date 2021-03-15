/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { timeout, empty } from '@instana/observables';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';

import {
  getTagType,
  requiresSecondLevelName,
  isLatencyTag,
  isIdTag,
  getTagEntity,
  getSourceEntityAvailability
} from 'in-applications/tags';
import EditTagFilterDialogPresenter from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialogPresenter';
import { applicationSourceOrDestinationTracker } from 'in-applications/tracker';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { positiveNumberValidator } from 'in-services/validators/number';
import { entityTypes, operators } from 'in-analyze/applicationFilter';
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
      trackFilterChanged,
      trackFilterRemoved,
      forAnalyzeCalls,
      timeConfig,
      hiddenSourceDestination
    }) => ({
      hiddenSourceDestination,
      tagEntity: getTagEntity(form.get('tag').value),
      sourceEntityAvailability: getSourceEntityAvailability(form.get('tag').value, timeConfig),
      onClose: close,
      editMode: Boolean(tagFilter),
      operatorSuggestions: (form.get('tag').value === 'call.http.status'
        ? httpStatusOperators()
        : get(TAG_TYPES, [selectedTagType, 'operators'], [])
      )
        // IS_BLANK and NOT_BLANK operator are only available when a second level key is defined
        .filter(
          operator =>
            (form.get('key') && !isBlank(form.get('key').value)) || (operator != 'IS_BLANK' && operator != 'NOT_BLANK')
        )
        // restrict id tag operators to EQUALS, NOT_EQUAL, IS_EMPTY and NOT_EMPTY
        .filter(
          operator =>
            !isIdTag(form.get('tag').value) ||
            operator == 'EQUALS' ||
            operator == 'NOT_EQUAL' ||
            operator == 'IS_EMPTY' ||
            operator == 'NOT_EMPTY'
        ),
      onRemoveTagFilter: () => {
        if (removeTagFilter) {
          removeTagFilter(tagFilter);
        }
        if (setTagFilters) {
          setTagFilters(tagFilters.filter(f => !isSameFilter(f, tagFilter)));
        }
        close();

        if (trackFilterRemoved) {
          const before = tagFilters.filter(f => isSameFilter(f, tagFilter));
          if (before.length > 0) {
            trackFilterRemoved({ name: tagFilter.name, filter: before[0] });
          } else {
            trackFilterRemoved({ name: tagFilter.name });
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
      onEntityChange: entity => {
        applicationSourceOrDestinationTracker({ before: form.get('entity').value, after: entity });
        setForm(form.updateIn(['entity'], f => f.setValue(entity).setTouched(true)));
      },
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
          const tagEntity = getTagEntity(form.get('tag').value);

          newTagFilter.value = form.containsKey('value') && form.get('value').value;
          newTagFilter.secondLevelName = form.containsKey('key') && form.get('key').value;
          newTagFilter.entity =
            tagEntity === entityTypes.NOT_APPLICABLE
              ? entityTypes.NOT_APPLICABLE
              : form.containsKey('entity') && form.get('entity').value;
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
        if (trackFilterChanged && before.length > 0) {
          trackFilterChanged({ before: before[0], after: newTagFilter });
        } else if (trackFilterChanged) {
          trackFilterChanged({ filter: newTagFilter });
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
      // If one of the conjunctions are OR send an empty array to show all suggestions instead of breaking.
      tagFilters:
        props.conjunctions && props.conjunctions.includes('OR')
          ? []
          : props.tagFilter
          ? props.tagFilters.filter(f => !isSameFilter(f, props.tagFilter))
          : props.tagFilters
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
    selectedTagType: getTagType(form.get('tag').value),
    tagName: form.get('tag').value
  };
}

function setResolvedEntity(tag) {
  const tagEntity = getTagEntity(tag);
  if (tagEntity === entityTypes.NOT_APPLICABLE) {
    return entityTypes.NOT_APPLICABLE;
  } else if (tagEntity === entityTypes.SOURCE) {
    return entityTypes.SOURCE;
  }
  return entityTypes.DESTINATION;
}

function createForm(tag, tagFilter, forAnalyzeCalls) {
  const resolvedTag = tagFilter ? tagFilter.name : tag;
  const tagType = getTagType(resolvedTag);
  const resolvedEntity = tagFilter ? tagFilter.entity : setResolvedEntity(tag);

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
    )
    .put(
      'entity',
      createField({
        value: resolvedEntity
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

// The 'call.http.status' tag type was changed from 'string' to 'number', however, we still have to support
// the string operators for backward compatibility.
function httpStatusOperators() {
  return [
    ...TAG_TYPES.NUMBER.operators,
    operators.CONTAINS,
    operators.NOT_CONTAIN,
    operators.STARTS_WITH,
    operators.ENDS_WITH,
    operators.NOT_STARTS_WITH,
    operators.NOT_ENDS_WITH
  ];
}
