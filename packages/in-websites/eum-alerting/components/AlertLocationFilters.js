import PropTypes from 'prop-types';
import invariant from 'invariant';
import React from 'react';

import {
  websitesAlertingFilterAdd,
  websitesAlertingFilterSet,
  websitesAlertingFilterRemove,
  websitesAlertingFilterEdit
} from 'in-websites/eum-alerting/tracker';
import { availableTagFiltersPerAlertType } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { modeAdvanced, modeSimple } from 'in-websites/eum-alerting/constants';
import { getBlueprintObject } from 'in-websites/eum-alerting/trackingHelpers';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

import locals from './AlertLocationFilters.mless';

const BEACON_WEBSITE_NAME = 'beacon.website.name';
const BEACON_WEBSITE_ID = 'beacon.website.id';

export default function AlertLocationFilters({ advancedMode, form, timeConfig, websiteLabel, updateForm }) {
  const alertType = form.get('rule').get('alertType').value;
  const tagSuggestions = availableTagFiltersPerAlertType[alertType];
  if (__DEV__) {
    invariant(tagSuggestions, `Tag suggestions not defined for alert type ${alertType}`);
  }

  return (
    form && (
      <>
        <div className={locals.quickFilterBarWrapper}>
          <QuickFilterBar
            timeConfig={timeConfig}
            tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
            upsertTagFilter={newTagFilter => {
              addFilter(form, newTagFilter, updateForm, advancedMode);
            }}
            addTagFilter={newTagFilter => {
              addFilter(form, newTagFilter, updateForm, advancedMode);
            }}
            removeTagFilter={name => {
              if (name !== BEACON_WEBSITE_NAME) {
                updateForm(
                  form
                    .updateIn(['tagFilters'], f =>
                      f.setValue(withoutTagFilterForName(getTagFilters(form), name)).setTouched(true)
                    )
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                );

                websitesAlertingFilterRemove({
                  ...getBlueprintObject(form),
                  mode: advancedMode ? modeAdvanced : modeSimple,
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
                      mode: advancedMode ? modeAdvanced : modeSimple,
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
                      name !== BEACON_WEBSITE_NAME && name !== BEACON_WEBSITE_ID && name !== 'beacon.error.message'
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
                      mode: advancedMode ? modeAdvanced : modeSimple,
                      tagFilters
                    });
                  }}
                  tagSuggestions={tagSuggestions}
                  timeConfig={timeConfig}
                />
              );
            }}
            onRemoveTagFilter={({ name }) => {
              updateForm(
                form
                  .updateIn(['tagFilters'], f =>
                    f.setValue(withoutTagFilterForName(getTagFilters(form), name)).setTouched(true)
                  )
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );
              websitesAlertingFilterRemove({
                ...getBlueprintObject(form),
                mode: advancedMode ? modeAdvanced : modeSimple,
                filterName: name
              });
            }}
            tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
            readonlyFilterNames={[BEACON_WEBSITE_NAME]}
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
  websiteLabel: PropTypes.string.isRequired
};

function addFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = withoutTagFilterForName(getTagFilters(form), newTagFilter.name);
  newTagFilters.push(newTagFilter);
  updateForm(
    form
      .updateIn(['tagFilters'], f => f.setValue(newTagFilters).setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
  );
  websitesAlertingFilterAdd({
    ...getBlueprintObject(form),
    mode: advancedMode ? modeAdvanced : modeSimple,
    filterName: newTagFilter.name
  });
}

function withoutTagFilterForName(tagFilters, name) {
  return tagFilters.filter(tf => tf.name !== name);
}

function mutateFiltersForView(tagFilters, websiteLabel) {
  const hasWebsiteName = tagFilters.some(({ name }) => name === BEACON_WEBSITE_NAME);
  return hasWebsiteName
    ? tagFilters
    : [
        {
          name: BEACON_WEBSITE_NAME,
          operator: 'EQUALS',
          stringValue: websiteLabel
        },
        ...tagFilters
      ];
}

function getTagFilters(form) {
  return form.get('tagFilters').value;
}
