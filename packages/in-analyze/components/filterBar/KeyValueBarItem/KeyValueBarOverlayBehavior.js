/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState, withProps } from 'recompose';
import { createField, createMapForm } from 'formalistic';
import { timeout, empty } from '@instana/observables';

import KeyValueBarOverlayPresenter from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { notBlankValidator } from 'in-services/validators/string';
import { requiresSecondLevelName } from 'in-applications/tags';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('form', 'setForm', getEmptyForm()),
  withProps(
    ({ form, setForm, addTagFilter, tag, close, tagFilters, setTagFilters, serializeFilter, trackFilterRemoved }) => ({
      onKeyChange: key => {
        let updatedForm = form.updateIn(['key'], f => f.setValue(key).setTouched(true));
        if (requiresSecondLevelName(key)) {
          updatedForm = updatedForm.put('secondLevelName', getNotBlankValidatedFieldDefinition());
        } else {
          updatedForm = updatedForm.remove('secondLevelName');
        }
        setForm(updatedForm);
      },
      onSecondLevelKeyChange: secondLevelKey => {
        setForm(form.updateIn(['secondLevelName'], f => f.setValue(secondLevelKey).setTouched(true)));
      },
      onValueChange: value => setForm(form.updateIn(['value'], f => f.setValue(value).setTouched(true))),
      onOperatorChange: e => {
        const newOperator = e.target.value;
        let updatedForm = form.updateIn(['operator'], f => f.setValue(newOperator).setTouched(true));
        const requiresValueField = newOperator !== 'NOT_EMPTY' && newOperator !== 'IS_EMPTY';
        if (requiresValueField) {
          if (!updatedForm.get('value')) {
            updatedForm = updatedForm.put('value', getNotBlankValidatedFieldDefinition());
          }
        } else {
          updatedForm = updatedForm.remove('value');
        }

        setForm(updatedForm);
      },
      onSubmit(e) {
        stopPropagationAndPreventDefault(e);
        if (!form.hierarchyValid) {
          setForm(form.setTouched(true, { recurse: true }));
          return;
        }

        if (serializeFilter) {
          // For Website Monitoring:
          // Always include the '=' because when not present, backend treats 'key' as empty
          let stringValue = `${form.get('key').value}=`;
          if (form.containsKey('value')) {
            // value is optional for some keywords
            stringValue = `${form.get('key').value}=${form.get('value').value}`;
          }

          addTagFilter({
            name: tag,
            operator: form.get('operator').value,
            stringValue
          });
        } else {
          // For Analyze Traces/Calls:
          const submittedFilter = {
            name: form.get('key').value,
            operator: form.get('operator').value
          };
          if (form.containsKey('secondLevelName')) {
            submittedFilter.secondLevelName = form.get('secondLevelName').value;
          }
          if (form.containsKey('value')) {
            submittedFilter.value = form.get('value').value;
          }
          addTagFilter(submittedFilter);
        }

        close();
      },
      onRemoveTagFilter(tagFilter) {
        setTagFilters(tagFilters.filter(f => f !== tagFilter));

        if (trackFilterRemoved) {
          const before = tagFilters.filter(f => f === tagFilter);
          if (before.length > 0) {
            trackFilterRemoved({ name: tagFilter.name, filter: before[0] });
          } else {
            trackFilterRemoved({ name: tagFilter.name });
          }
        }
      }
    })
  ),
  connect((props, prevProps) => {
    let keySuggestions$;
    if (props.getKeySuggestions) {
      keySuggestions$ = props.getKeySuggestions(props);
    } else {
      keySuggestions$ = empty;
    }

    const key = props.form.get('key').value;
    const keyChanged = prevProps && prevProps.form && key !== prevProps.form.get('key').value;

    let secondLevelKeySuggestions$;
    if (isBlank(key) || !props.getSecondLevelKeySuggestions) {
      secondLevelKeySuggestions$ = empty;
    } else if (keyChanged) {
      secondLevelKeySuggestions$ = timeout(1500)
        .flatMap(() =>
          props.getSecondLevelKeySuggestions({
            ...props,
            key
          })
        )
        .startWith(pendingResult);
    } else {
      secondLevelKeySuggestions$ = props.getSecondLevelKeySuggestions({
        ...props,
        key
      });
    }

    let valueSuggestions$;
    if (isBlank(key) || !props.getValueSuggestions) {
      valueSuggestions$ = empty;
    } else if (keyChanged) {
      valueSuggestions$ = timeout(1500)
        .flatMap(() =>
          props.getValueSuggestions({
            ...props,
            key
          })
        )
        .startWith(pendingResult);
    } else {
      valueSuggestions$ = props.getValueSuggestions({
        ...props,
        key
      });
    }

    return {
      keySuggestions: keySuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      keySuggestionsLoading: keySuggestions$.map(r => r.progress.loading),
      secondLevelKeySuggestions: secondLevelKeySuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      secondLevelKeySuggestionsLoading: secondLevelKeySuggestions$.map(r => r.progress.loading),
      valueSuggestions: valueSuggestions$
        .map(r => (r.data || emptyArray).slice().sort(compareIgnoreCase))
        .startWith(emptyArray),
      valueSuggestionsLoading: valueSuggestions$.map(r => r.progress.loading)
    };
  })
)(KeyValueBarOverlayPresenter);

function getEmptyForm() {
  return createMapForm()
    .put(
      'key',
      createField({
        validator: notBlankValidator
      })
    )
    .put('value', getNotBlankValidatedFieldDefinition())
    .put(
      'operator',
      createField({
        value: 'EQUALS',
        validator: notBlankValidator
      })
    );
}

function getNotBlankValidatedFieldDefinition() {
  return createField({
    validator: notBlankValidator
  });
}
