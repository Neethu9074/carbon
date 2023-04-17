/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { timeout, empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import KeyValueBarOverlayPresenter from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayPresenter';
// eslint-disable-next-line no-restricted-imports
import { requiresSecondLevelName } from 'in-applications/tags';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { notBlankValidator } from 'in-services/validators/string';
import { pendingResult } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';

export default function KeyValueBarOverlayBehavior(props) {
  const { addTagFilter, tag, close, tagFilters, setTagFilters, serializeFilter, trackFilterRemoved } = props;

  const [form, setForm] = useState(getEmptyForm());
  const keySuggestions$ = useObservable(props.getKeySuggestions ? props.getKeySuggestions(props) : empty, [
    props.getKeySuggestions
  ]);
  const key = form.get('key').value;
  const secondLevelKeySuggestions$ = useObservable(
    !isBlank(key) && props.getSecondLevelKeySuggestions
      ? timeout(1500)
          .flatMap(() =>
            props.getSecondLevelKeySuggestions({
              ...props,
              key
            })
          )
          .startWith(pendingResult)
      : empty,
    [props.getSecondLevelKeySuggestions, key]
  );
  const valueSuggestions$ = useObservable(
    !isBlank(key) && props.getValueSuggestions
      ? timeout(1500)
          .flatMap(() =>
            props.getValueSuggestions({
              ...props,
              key
            })
          )
          .startWith(pendingResult)
      : empty,
    [key]
  );

  const keySuggestionsLoading = keySuggestions$?.progress?.loading;
  const secondLevelKeySuggestionsLoading = secondLevelKeySuggestions$?.progress.loading;
  const valueSuggestionsLoading = valueSuggestions$?.progress.loading;

  const keySuggestions = !keySuggestionsLoading ? keySuggestions$?.data.slice().sort() : [];

  const secondLevelKeySuggestions = !secondLevelKeySuggestionsLoading
    ? secondLevelKeySuggestions$?.data.slice().sort()
    : [];

  const valueSuggestions = !valueSuggestionsLoading ? valueSuggestions$?.data.slice().sort() : [];

  return (
    <KeyValueBarOverlayPresenter
      form={form}
      keySuggestions={keySuggestions}
      secondLevelKeySuggestions={secondLevelKeySuggestions}
      valueSuggestions={valueSuggestions}
      secondLevelKeySuggestionsLoading={secondLevelKeySuggestionsLoading}
      keySuggestionsLoading={keySuggestionsLoading}
      valueSuggestionsLoading={valueSuggestionsLoading}
      setForm={setForm}
      onKeyChange={key => {
        let updatedForm = form.updateIn(['key'], f => f.setValue(key).setTouched(true));
        if (requiresSecondLevelName(key)) {
          updatedForm = updatedForm.put('secondLevelName', getNotBlankValidatedFieldDefinition());
        } else {
          updatedForm = updatedForm.remove('secondLevelName');
        }
        setForm(updatedForm);
      }}
      onSecondLevelKeyChange={secondLevelKey => {
        setForm(form.updateIn(['secondLevelName'], f => f.setValue(secondLevelKey).setTouched(true)));
      }}
      onValueChange={value => setForm(form.updateIn(['value'], f => f.setValue(value).setTouched(true)))}
      onOperatorChange={e => {
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
      }}
      onSubmit={e => {
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
      }}
      onRemoveTagFilter={tagFilter => {
        setTagFilters(tagFilters.filter(f => f !== tagFilter));

        if (trackFilterRemoved) {
          const before = tagFilters.filter(f => f === tagFilter);
          if (before.length > 0) {
            trackFilterRemoved({ name: tagFilter.name, filter: before[0] });
          } else {
            trackFilterRemoved({ name: tagFilter.name });
          }
        }
      }}
      {...props}
    />
  );
}

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
