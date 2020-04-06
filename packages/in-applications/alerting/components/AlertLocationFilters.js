import PropTypes from 'prop-types';
import { Object } from 'core-js';
import React from 'react';

import {
  applicationsAlertingFilterAdd,
  applicationsAlertingFilterSet,
  applicationsAlertingFilterRemove,
  applicationsAlertingFilterEdit
} from 'in-applications/alerting/tracker';
import ApplicationEditTagFilterDialog from 'in-applications/alerting/analyze/ApplicationEditTagFilterDialog';
import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { getBlueprintObject } from 'in-applications/alerting/trackingHelpers';
import QuickFilterBar from 'in-applications/alerting/analyze/QuickFilterBar';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getAnalyzeFilterTagKeys } from 'in-applications/tags';

const applicationNameTag = 'application.name';
const notContainedInTagSuggestions = ['application.id', 'application.name', 'service.id', 'endpoint.id'];

export default function AlertLocationFilters({ advancedMode, form, timeConfig, applicationLabel, updateForm }) {
  const tagSuggestions = getAnalyzeFilterTagKeys().filter(tag => !notContainedInTagSuggestions.includes(tag));

  return (
    form && (
      <>
        <TagFilterConfigurationWrapper
          disabled={false}
          quickFilterBar={
            <QuickFilterBar
              timeConfig={timeConfig}
              tagFilters={mutateFiltersForView({ tagFilters: getTagFilters(form), applicationLabel })}
              upsertTagFilter={newTagFilter => {
                upsertFilter(form, newTagFilter, updateForm, advancedMode);
              }}
              addTagFilter={newTagFilter => {
                addFilter(form, newTagFilter, updateForm, advancedMode);
              }}
              setTagFilters={newTagFilters => {
                updateForm(
                  form
                    .updateIn(['tagFilters'], f => f.setValue(newTagFilters).setTouched(true))
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                );
              }}
              removeTagFilter={(...args) => {
                const tag = args[0];
                const key = args[3];
                if (tag !== applicationNameTag) {
                  updateForm(
                    form
                      .updateIn(['tagFilters'], f =>
                        f
                          .setValue(withoutTagFiltersForNameAndValue(getTagFilters(form), { name: tag, value: key }))
                          .setTouched(true)
                      )
                      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                  );

                  applicationsAlertingFilterRemove({
                    ...getBlueprintObject(form),
                    mode: advancedMode ? 'Advanced' : 'Simple',
                    filterName: tag
                  });
                }
              }}
              onMoreClick={tagFilter => {
                addActiveDialog(
                  <ApplicationEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      applicationsAlertingFilterSet({
                        ...getBlueprintObject(form),
                        mode: advancedMode ? 'Advanced' : 'Simple',
                        tagFilters
                      });
                      updateForm(
                        form
                          .updateIn(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))
                          .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                      );
                    }}
                    tagSuggestions={tagSuggestions}
                    timeConfig={timeConfig}
                  />
                );
              }}
              align="bottomMiddle"
              showPageSelector
              removeBarPadding
              removeBarBackgroundColor
              hideClearFiltersButton
              withoutFiltersLabel
            />
          }
          tagFilterList={
            <TagFilterListPresenter
              onTagFilterClick={tagFilter => {
                addActiveDialog(
                  <ApplicationEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      updateForm(
                        form
                          .updateIn(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))
                          .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                      );
                      applicationsAlertingFilterEdit({
                        ...getBlueprintObject(form),
                        mode: advancedMode ? 'Advanced' : 'Simple',
                        tagFilters
                      });
                    }}
                    tagSuggestions={tagSuggestions}
                    timeConfig={timeConfig}
                  />
                );
              }}
              onRemoveTagFilter={tagFilter => {
                updateForm(
                  form
                    .updateIn(['tagFilters'], f =>
                      f.setValue(withoutTagFiltersForNameAndValue(getTagFilters(form), tagFilter)).setTouched(true)
                    )
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                );
                applicationsAlertingFilterRemove({
                  ...getBlueprintObject(form),
                  mode: advancedMode ? 'Advanced' : 'Simple',
                  filterName: tagFilter.name
                });
              }}
              tagFilters={mutateFiltersForView({ tagFilters: getTagFilters(form), applicationLabel })}
              readonlyFilterNames={[applicationNameTag]}
            />
          }
        />
      </>
    )
  );
}

AlertLocationFilters.propTypes = {
  advancedMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  applicationLabel: PropTypes.string.isRequired
};

function upsertFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = withoutTagFiltersForName(getTagFilters(form), newTagFilter.name);
  newTagFilters.push(newTagFilter);
  addNewTagFiltersToForm(updateForm, form, newTagFilters, advancedMode, newTagFilter);
}

function addFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = getTagFilters(form).filter(tf => !Object.is(tf, newTagFilter));
  newTagFilters.push(newTagFilter);
  addNewTagFiltersToForm(updateForm, form, newTagFilters, advancedMode, newTagFilter);
}

function addNewTagFiltersToForm(updateForm, form, newTagFilters, advancedMode, newTagFilter) {
  updateForm(
    form
      .updateIn(['tagFilters'], f => f.setValue(newTagFilters).setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
  );
  applicationsAlertingFilterAdd({
    ...getBlueprintObject(form),
    mode: advancedMode ? 'Advanced' : 'Simple',
    filterName: newTagFilter.name
  });
}

function withoutTagFiltersForName(tagFilters, name) {
  return tagFilters.filter(tf => tf.name !== name);
}

function withoutTagFiltersForNameAndValue(tagFilters, tagFilter) {
  const { name, key, value, stringValue, booleanValue, numberValue } = tagFilter;
  const _value = stringValue ?? booleanValue ?? numberValue ?? value;
  const _name = name ?? key;

  return tagFilters.filter(tf => {
    const tfValue = tf.stringValue ?? tf.booleanValue ?? tf.numberValue;
    return !(tf.name === _name && tfValue === _value);
  });
}

function mutateFiltersForView({ tagFilters, applicationLabel }) {
  const tagFiltersContainApplicationNameTag = tagFilters.some(({ name }) => name === applicationNameTag);
  return tagFiltersContainApplicationNameTag
    ? tagFilters
    : [
        {
          name: applicationNameTag,
          operator: 'EQUALS',
          stringValue: applicationLabel
        },
        ...tagFilters
      ];
}

function getTagFilters(form) {
  return form.get('tagFilters').value;
}
