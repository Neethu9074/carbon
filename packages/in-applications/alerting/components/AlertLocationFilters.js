import PropTypes from 'prop-types';
import { Object } from 'core-js';
import React from 'react';

import {
  websitesAlertingFilterAdd,
  websitesAlertingFilterSet,
  websitesAlertingFilterRemove,
  websitesAlertingFilterEdit
} from 'in-websites/alerting/tracker';
import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getBlueprintObject } from '../trackingHelpers';
import QuickFilterBar from '../analyze/QuickFilterBar';

import locals from './AlertLocationFilters.mless';

const applicationNameTag = 'application.name';
const APPLICATION_ID_TAG = 'application.id';

export default function AlertLocationFilters({ advancedMode, form, timeConfig, applicationName, updateForm }) {
  const tagSuggestions = [];

  // if (__DEV__) {
  //   invariant(tagSuggestions, `Tag suggestions not defined for alert type ${alertType}`);
  // }

  return (
    form && (
      <>
        <div className={locals.quickFilterBarWrapper}>
          <QuickFilterBar
            timeConfig={timeConfig}
            tagFilters={mutateFiltersForView(getTagFilters(form), applicationName)}
            upsertTagFilter={newTagFilter => {
              addFilter(form, newTagFilter, updateForm, advancedMode);
            }}
            addTagFilter={newTagFilter => {
              addFilter(form, newTagFilter, updateForm, advancedMode);
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
                <WebsiteEditTagFilterDialog
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
                  tagSuggestions={tagSuggestions.filter(
                    name =>
                      name !== applicationNameTag && name !== APPLICATION_ID_TAG && name !== 'beacon.error.message'
                  )}
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
        </div>
        <div className={locals.filterList}>
          <TagFilterListPresenter
            onTagFilterClick={tagFilter => {
              addActiveDialog(
                <WebsiteEditTagFilterDialog
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
            tagFilters={mutateFiltersForView(getTagFilters(form), applicationName)}
            readonlyFilterNames={[applicationNameTag]}
          />
        </div>
      </>
    )
  );
}

AlertLocationFilters.propTypes = {
  advancedMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  applicationName: PropTypes.string.isRequired
};

function addFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = withoutTagFilter(getTagFilters(form), newTagFilter);
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

function mutateFiltersForView(tagFilters, applicationName) {
  const hasWebsiteName = tagFilters.some(({ name }) => name === applicationNameTag);
  return hasWebsiteName
    ? tagFilters
    : [
        {
          name: applicationNameTag,
          operator: 'EQUALS',
          stringValue: applicationName
        },
        ...tagFilters
      ];
}

function getTagFilters(form) {
  return form.get('tagFilters').value;
}
