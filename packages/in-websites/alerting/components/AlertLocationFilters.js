/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { t } from 'in-i18n';
import React from 'react';

import {
  websitesAlertingFilterAdd,
  websitesAlertingFilterSet,
  websitesAlertingFilterRemove,
  websitesAlertingFilterEdit
} from 'in-websites/alerting/tracker';
import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { modeAdvanced, modeSimple } from 'in-websites/alerting/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

const websiteNameTag = 'beacon.website.name';

export default function AlertLocationFilters({ advancedMode, form, timeConfig, websiteLabel, updateForm }) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const metricName = ruleForm.get('metricName').value;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagSuggestions = blueprintConfig.getAvailableTags(metricName);

  if (__DEV__) {
    invariant(tagSuggestions, t('in-websites:alerting.components.tagSuggestions', { alertType: alertType }));
  }

  return (
    form && (
      <>
        <TagFilterConfigurationWrapper
          disabled={false}
          quickFilterBar={
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
                if (name !== websiteNameTag) {
                  updateForm(
                    form
                      .updateIn(['tagFilters'], f =>
                        f.setValue(withoutTagFiltersForName(getTagFilters(form), name)).setTouched(true)
                      )
                      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                  );

                  websitesAlertingFilterRemove(
                    getTrackingObject(form, {
                      mode: advancedMode ? modeAdvanced : modeSimple,
                      filterName: name
                    })
                  );
                }
              }}
              onMoreClick={tagFilter => {
                addActiveDialog(
                  <WebsiteEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      websitesAlertingFilterSet(
                        getTrackingObject(form, {
                          mode: advancedMode ? modeAdvanced : modeSimple,
                          tagFilters
                        })
                      );
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
                  <WebsiteEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      updateForm(
                        form
                          .updateIn(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))
                          .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                      );
                      websitesAlertingFilterEdit(
                        getTrackingObject(form, {
                          mode: advancedMode ? modeAdvanced : modeSimple,
                          tagFilters
                        })
                      );
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
                      f.setValue(withoutTagFiltersForName(getTagFilters(form), name)).setTouched(true)
                    )
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                );
                websitesAlertingFilterRemove(
                  getTrackingObject(form, {
                    mode: advancedMode ? modeAdvanced : modeSimple,
                    filterName: name
                  })
                );
              }}
              tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
              readonlyFilterNames={[websiteNameTag]}
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
  websiteLabel: PropTypes.string.isRequired
};

function addFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = withoutTagFiltersForName(getTagFilters(form), newTagFilter.name);
  newTagFilters.push(newTagFilter);
  updateForm(
    form
      .updateIn(['tagFilters'], f => f.setValue(newTagFilters).setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
  );
  websitesAlertingFilterAdd(
    getTrackingObject(form, {
      mode: advancedMode ? modeAdvanced : modeSimple,
      filterName: newTagFilter.name
    })
  );
}

function withoutTagFiltersForName(tagFilters, name) {
  return tagFilters.filter(tf => tf.name !== name);
}

function mutateFiltersForView(tagFilters, websiteLabel) {
  const hasWebsiteName = tagFilters.some(({ name }) => name === websiteNameTag);
  return hasWebsiteName
    ? tagFilters
    : [
        {
          name: websiteNameTag,
          operator: 'EQUALS',
          stringValue: websiteLabel
        },
        ...tagFilters
      ];
}

function getTagFilters(form) {
  return form.get('tagFilters').value;
}
