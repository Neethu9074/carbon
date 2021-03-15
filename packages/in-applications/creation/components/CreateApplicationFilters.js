/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import {
  getSecondLevelKeySuggestions,
  getValueSuggestions
} from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import { applicationCreationAddTag, applicationCreationRemoveTag } from 'in-applications/creation/tracker';
import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import QuickFilterBar from 'in-applications/creation/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import { getApplicationCreationTagKeys } from 'in-applications/tags';
import { entityTypes } from 'in-analyze/applicationFilter';
import ServicesEndpointsBar from './ServicesEndpointsBar';

export default function CreateApplicationFilters({
  curatedTagFilters,
  timeConfig,
  form,
  updateForm,
  selectedBlueprint
}) {
  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(form.get('matchSpecification').toJS());
  const filters = {
    timeConfig,
    tagFilter: tagFiltersForSubscription
  };
  const conjunctions = form.toJS().matchSpecification?.map(item => item.conjunction);
  return (
    <TagFilterConfigurationWrapper
      quickFilterBar={
        selectedBlueprint.type === 'servicesEndpoints' || selectedBlueprint.type === 'userJourney' ? (
          <ServicesEndpointsBar
            tagFilters={filters.tagFilter}
            timeConfig={filters.timeConfig}
            addTagFilter={_tag => addTagFunction(_tag, form, updateForm)}
            removeTagFilter={(item, operator, secondLevelName, value) => {
              multiSelectRemoveMatchspecification({ value, form, updateForm });
            }}
            onMoreClick={() => {
              addActiveDialog(
                <EditTagFilterDialog
                  tagFilters={filters.tagFilter}
                  tagSuggestions={getApplicationCreationTagKeys()}
                  getKeySuggestions={getSecondLevelKeySuggestions}
                  getValueSuggestions={getValueSuggestions}
                  timeConfig={filters.timeConfig}
                  addTagFilter={_tag => addTagFunction(_tag, form, updateForm)}
                  conjunctions={conjunctions}
                  forAnalyzeCalls
                />
              );
            }}
            withoutFiltersLabel
          />
        ) : (
          <QuickFilterBar
            curatedTagFilters={curatedTagFilters.map(curatedFilter => (
              <BarItem
                key={curatedFilter.category}
                timeConfig={timeConfig}
                onClick={() =>
                  addActiveDialog(
                    <EditTagFilterDialog
                      tagFilters={filters.tagFilter}
                      tagSuggestions={curatedFilter.tags}
                      getKeySuggestions={getSecondLevelKeySuggestions}
                      getValueSuggestions={getValueSuggestions}
                      timeConfig={filters.timeConfig}
                      addTagFilter={_tag => addTagFunction(_tag, form, updateForm)}
                      conjunctions={conjunctions}
                      categoryTitle={curatedFilter.category}
                      forAnalyzeCalls
                    />
                  )
                }
                showMore
              >
                {curatedFilter.category}
              </BarItem>
            ))}
            onMoreClick={() => {
              addActiveDialog(
                <EditTagFilterDialog
                  tagFilters={filters.tagFilter}
                  tagSuggestions={getApplicationCreationTagKeys()}
                  getKeySuggestions={getSecondLevelKeySuggestions}
                  getValueSuggestions={getValueSuggestions}
                  timeConfig={filters.timeConfig}
                  addTagFilter={_tag => addTagFunction(_tag, form, updateForm)}
                  conjunctions={conjunctions}
                  forAnalyzeCalls
                />
              );
            }}
            hideClearFiltersButton
            withoutFiltersLabel
          />
        )
      }
      tagFilterList={
        <TagFilterList
          filterConnectionOperators={['OR', 'AND']}
          onOperatorChanged={(i, operator) => {
            updateForm(
              form.updateIn(['matchSpecification', i, 'conjunction'], field =>
                field.setValue(operator).setTouched(true)
              )
            );
          }}
          tagFilters={form.get('matchSpecification').map((matchSpecification, i) => ({
            tag: {
              name: matchSpecification.get('key').value,
              entity: matchSpecification.get('entity').value,
              value: matchSpecification.get('value').value,
              operator: matchSpecification.get('operator').value,
              secondLevelName: matchSpecification.get('secondLevelName').value,
              conjunction: matchSpecification.get('conjunction').value
            },
            onClick: () =>
              addActiveDialog(
                <EditTagFilterDialog
                  tagFilter={{
                    name: matchSpecification.get('key').value,
                    entity: matchSpecification.get('entity').value,
                    value: matchSpecification.get('value').value,
                    operator: matchSpecification.get('operator').value,
                    secondLevelName: matchSpecification.get('secondLevelName').value
                  }}
                  tagFilters={filters.tagFilter}
                  timeConfig={filters.timeConfig}
                  tagSuggestions={getApplicationCreationTagKeys()}
                  getKeySuggestions={getSecondLevelKeySuggestions}
                  getValueSuggestions={getValueSuggestions}
                  updateTagFilter={_tag => {
                    form = form.updateIn(['matchSpecification', i, 'value'], field =>
                      field.setValue(_tag.value || '').setTouched(true)
                    );
                    form = form.updateIn(['matchSpecification', i, 'key'], field =>
                      field.setValue(_tag.name).setTouched(true)
                    );
                    form = form.updateIn(['matchSpecification', i, 'entity'], field =>
                      field.setValue(_tag.entity).setTouched(true)
                    );
                    form = form.updateIn(['matchSpecification', i, 'operator'], field =>
                      field.setValue(_tag.operator).setTouched(true)
                    );
                    form = form.updateIn(['matchSpecification', i, 'secondLevelName'], field =>
                      field.setValue(_tag.secondLevelName).setTouched(true)
                    );

                    updateForm(form);
                  }}
                  removeTagFilter={() => {
                    removeMatchSpecification(i, form, updateForm);
                  }}
                  conjunctions={conjunctions}
                  forAnalyzeCalls
                />
              ),
            onRemove: () => {
              removeMatchSpecification(i, form, updateForm);
            }
          }))}
        />
      }
    />
  );
}

function getEnrichedMatchSpecificationForm(matchSpecification, form) {
  const formMatchSpecification = form.get('matchSpecification');
  const formMatchSpecificationSize = formMatchSpecification.size;

  if (formMatchSpecificationSize === 0)
    return getMatchSpecificationForm(matchSpecification).put(
      'conjunction',
      createField({
        value: get(matchSpecification, 'conjunction', 'AND')
      })
    );

  const lastItem = formMatchSpecification.get(formMatchSpecificationSize - 1);
  const lastItemKey = lastItem.get('key').value;
  return getMatchSpecificationForm(matchSpecification).put(
    'conjunction',
    createField({
      value: get(matchSpecification, 'conjunction', matchSpecification.key === lastItemKey ? 'OR' : 'AND')
    })
  );
}

function updateConjunction(form, tag) {
  const matchSpecification = form.get('matchSpecification');
  const matchSpecificationSize = matchSpecification.size;

  if (matchSpecificationSize === 0) return form;

  const lastItem = matchSpecification.get(matchSpecificationSize - 1);
  const lastItemKey = lastItem.get('key').value;

  return form.updateIn(['matchSpecification', matchSpecificationSize - 1, 'conjunction'], field =>
    field.setValue(tag.name === lastItemKey ? 'OR' : 'AND').setTouched(true)
  );
}

const addTagFunction = (_tag, form, updateForm) => {
  const additionalSubForm = getEnrichedMatchSpecificationForm(
    {
      key: _tag.name,
      entity: _tag.entity,
      secondLevelName: _tag.secondLevelName || '',
      value: _tag.value || _tag.stringValue || '',
      operator: _tag.operator
    },
    form
  );
  const updatedForm = updateConjunction(form, _tag).updateIn(['matchSpecification'], list => {
    const conjunction = additionalSubForm.get('conjunction').value;
    return conjunction === 'OR' ? list.push(additionalSubForm).setTouched(true) : addToAnd(list, additionalSubForm);
  });
  updateForm(updatedForm, form);
  applicationCreationAddTag({ _tag });
};

function addToAnd(list, additionalSubForm) {
  const andArr = list.toJS().filter(item => item.conjunction === 'AND');
  return list.insert(andArr.length === 1 ? 1 : andArr.length - 1, additionalSubForm).setTouched(true);
}

function getMatchSpecificationForm(matchSpecification = {}) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'entity',
      createField({
        value: get(matchSpecification, 'entity', entityTypes.NOT_APPLICABLE),
        validator: notBlankValidator
      })
    )
    .put(
      'secondLevelName',
      createField({
        value: get(matchSpecification, 'secondLevelName', '')
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', '')
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );
}

function removeMatchSpecification(i, form, updateForm) {
  const jsForm = form.toJS();
  const tagToRemove = jsForm.matchSpecification[i];
  applicationCreationRemoveTag({ tagToRemove });
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
}

function multiSelectRemoveMatchspecification({ value, form, updateForm }) {
  const jsForm = form.toJS();
  const indexToRemove = jsForm.matchSpecification.map(item => item.value).indexOf(value);
  const tagToRemove = jsForm.matchSpecification[indexToRemove];
  applicationCreationRemoveTag({ tagToRemove });
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(indexToRemove).setTouched(true)));
}
