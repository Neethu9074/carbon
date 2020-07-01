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

export default function CreateApplicationFilters({ curatedTagFilters, timeConfig, form, updateForm }) {
  const tagFiltersForSubscription = getTagFilterListForBackendSubscription(form.get('matchSpecification').toJS());
  const filters = {
    timeConfig,
    tagFilter: tagFiltersForSubscription
  };
  const conjunctions = form.toJS().matchSpecification?.map(item => item.conjunction);
  return (
    <TagFilterConfigurationWrapper
      quickFilterBar={
        <QuickFilterBar
          hideClearFiltersButton
          withoutFiltersLabel
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
                    addTagFilter={_tag => {
                      const additionalSubForm = getEnrichedMatchSpecificationForm({
                        key: _tag.name,
                        entity: _tag.entity,
                        secondLevelName: _tag.secondLevelName || '',
                        value: _tag.value || '',
                        operator: _tag.operator
                      });
                      updateForm(
                        form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true))
                      );
                      applicationCreationAddTag({ _tag });
                    }}
                    conjunctions={conjunctions}
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
                addTagFilter={_tag => {
                  const additionalSubForm = getEnrichedMatchSpecificationForm({
                    key: _tag.name,
                    entity: _tag.entity,
                    secondLevelName: _tag.secondLevelName || '',
                    value: _tag.value || '',
                    operator: _tag.operator
                  });
                  updateForm(
                    form.updateIn(['matchSpecification'], list => list.push(additionalSubForm).setTouched(true))
                  );
                  applicationCreationAddTag({ _tag });
                }}
                conjunctions={conjunctions}
                forAnalyzeCalls
              />
            );
          }}
        />
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

function getEnrichedMatchSpecificationForm(matchSpecification) {
  return getMatchSpecificationForm(matchSpecification).put(
    'conjunction',
    createField({
      value: get(matchSpecification, 'conjunction', 'AND')
    })
  );
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
