import PropTypes from 'prop-types';
import { Object } from 'core-js';
import React from 'react';

import {
  websitesAlertingFilterAdd,
  websitesAlertingFilterSet,
  websitesAlertingFilterRemove,
  websitesAlertingFilterEdit
} from 'in-websites/alerting/tracker';
import ApplicationEditTagFilterDialog from 'in-applications/alerting/analyze/ApplicationEditTagFilterDialog';
import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getBlueprintObject } from '../trackingHelpers';
import QuickFilterBar from '../analyze/QuickFilterBar';
import { getAnalyzeFilterTagKeys } from '../../tags';

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
                addFilter(form, newTagFilter, updateForm, advancedMode);
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
              removeTagFilter={name => {
                if (name !== applicationNameTag) {
                  updateForm(
                    form
                      .updateIn(['tagFilters'], f =>
                        f.setValue(withoutTagFiltersForName(getTagFilters(form), name)).setTouched(true)
                      )
                      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                  );

                  websitesAlertingFilterRemove({
                    ...getBlueprintObject(form),
                    mode: advancedMode ? 'Advanced' : 'Simple',
                    filterName: name
                  });
                }
              }}
              onMoreClick={tagFilter => {
                addActiveDialog(
                  <ApplicationEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      websitesAlertingFilterSet({
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
              showWebsiteSelector={advancedMode}
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
                      websitesAlertingFilterEdit({
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
                    .updateIn(['tagFilters'], f => f.setValue(withoutTagFilter(form, tagFilter)).setTouched(true))
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                );
                websitesAlertingFilterRemove({
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

function addFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = withoutTagFilter(form, newTagFilter);
  newTagFilters.push(newTagFilter);
  updateForm(
    form
      .updateIn(['tagFilters'], f => f.setValue(newTagFilters).setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
  );
  websitesAlertingFilterAdd({
    ...getBlueprintObject(form),
    mode: advancedMode ? 'Advanced' : 'Simple',
    filterName: newTagFilter.name
  });
}

function withoutTagFiltersForName(tagFilters, name) {
  return tagFilters.filter(tf => tf.name !== name);
}

function withoutTagFilter(form, tagFilter) {
  return getTagFilters(form).filter(tf => !Object.is(tf, tagFilter));
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
