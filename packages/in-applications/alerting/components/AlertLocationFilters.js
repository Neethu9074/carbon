/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { Object } from 'core-js';
import React from 'react';

import {
  applicationsAlertingFilterAdd,
  applicationsAlertingFilterSet,
  applicationsAlertingFilterRemove,
  applicationsAlertingFilterEdit
} from 'in-applications/alerting/tracker';
import {
  convertToApplicationAreaSpecificTagFilter,
  getTagFilterListForBackendSubscription
} from 'in-analyze/applicationFilter';
import ApplicationEditTagFilterDialog from 'in-applications/alerting/analyze/ApplicationEditTagFilterDialog';
import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import QuickFilterBar from 'in-applications/alerting/analyze/QuickFilterBar';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { propTypeTimeConfig } from 'in-stores/time/config';

const applicationNameTag = 'application.name';

export default function AlertLocationFilters({
  advancedMode,
  form,
  timeConfig,
  applicationLabel,
  updateForm,
  withoutLatencyItem
}) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const metricName = ruleForm.get('metricName').value;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagSuggestions = blueprintConfig.getAvailableTags(metricName);

  return (
    form && (
      <>
        <TagFilterConfigurationWrapper
          disabled={false}
          quickFilterBar={
            <QuickFilterBar
              timeConfig={timeConfig}
              tagFilters={convertToApplicationAreaSpecificTagFilter(
                mutateFiltersForView({ tagFilters: getTagFilters(form), applicationLabel })
              )}
              upsertTagFilter={newTagFilter => {
                upsertFilter(form, newTagFilter, updateForm, advancedMode);
              }}
              addTagFilter={newTagFilter => {
                addFilter(form, newTagFilter, updateForm, advancedMode);
              }}
              setTagFilters={newTagFilters => {
                updateTagFilterForm(newTagFilters, updateForm, form);
              }}
              removeTagFilter={(...args) => {
                const tag = args[0];
                const key = args[3];

                if (tag !== applicationNameTag) {
                  const newTagFilters = key
                    ? withoutTagFiltersForNameAndValue(getTagFilters(form), { name: tag, value: key })
                    : withoutTagFiltersForName(getTagFilters(form), tag);

                  updateTagFilterForm(newTagFilters, updateForm, form);

                  applicationsAlertingFilterRemove(
                    getTrackingObject(form, {
                      mode: advancedMode ? 'Advanced' : 'Simple',
                      filterName: tag
                    })
                  );
                }
              }}
              onMoreClick={tagFilter => {
                addActiveDialog(
                  <ApplicationEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      applicationsAlertingFilterSet(
                        getTrackingObject(form, {
                          mode: advancedMode ? 'Advanced' : 'Simple',
                          tagFilters
                        })
                      );
                      updateTagFilterForm(tagFilters, updateForm, form);
                    }}
                    tagSuggestions={tagSuggestions}
                    timeConfig={timeConfig}
                    forAnalyzeCalls
                  />
                );
              }}
              align="bottomMiddle"
              disabledTagFilters={blueprintConfig.disabledTagFilters}
              withoutLatencyItem={withoutLatencyItem} // only for the purpose because otherwise the filter-bar would overflow in Simple-mode
              withoutFiltersLabel
              showPageSelector
              removeBarPadding
              removeBarBackgroundColor
              hideClearFiltersButton
            />
          }
          tagFilterList={
            <TagFilterListPresenter
              onTagFilterClick={tagFilter => {
                addActiveDialog(
                  <ApplicationEditTagFilterDialog
                    tagFilter={convertToApplicationAreaSpecificTagFilter([tagFilter])?.[0]}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters => {
                      updateTagFilterForm(withoutTagFiltersForNameAndValue(tagFilters, tagFilter), updateForm, form);
                      applicationsAlertingFilterEdit(
                        getTrackingObject(form, {
                          mode: advancedMode ? 'Advanced' : 'Simple',
                          tagFilters
                        })
                      );
                    }}
                    tagSuggestions={tagSuggestions}
                    timeConfig={timeConfig}
                    forAnalyzeCalls
                  />
                );
              }}
              onRemoveTagFilter={tagFilter => {
                updateTagFilterForm(withoutTagFiltersForNameAndValue(getTagFilters(form), tagFilter), updateForm, form);
                applicationsAlertingFilterRemove(
                  getTrackingObject(form, {
                    mode: advancedMode ? 'Advanced' : 'Simple',
                    filterName: tagFilter.name
                  })
                );
              }}
              tagFilters={getTagFilterListForBackendSubscription(
                mutateFiltersForView({ tagFilters: getTagFilters(form), applicationLabel })
              )}
              readonlyFilterNames={[applicationNameTag]}
              showEntityIndicator
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
  timeConfig: propTypeTimeConfig.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  withoutLatencyItem: PropTypes.bool
};

function upsertFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = withoutTagFiltersForName(getTagFilters(form), newTagFilter.name);
  newTagFilters.push(newTagFilter);
  addNewTagFiltersToFormWithTracking(updateForm, form, newTagFilters, advancedMode, newTagFilter);
}

function addFilter(form, newTagFilter, updateForm, advancedMode) {
  const newTagFilters = getTagFilters(form).filter(tf => !Object.is(tf, newTagFilter));
  newTagFilters.push(newTagFilter);
  addNewTagFiltersToFormWithTracking(updateForm, form, newTagFilters, advancedMode, newTagFilter);
}

function addNewTagFiltersToFormWithTracking(updateForm, form, newTagFilters, advancedMode, newTagFilter) {
  updateTagFilterForm(newTagFilters, updateForm, form);
  applicationsAlertingFilterAdd(
    getTrackingObject(form, {
      mode: advancedMode ? 'Advanced' : 'Simple',
      filterName: newTagFilter.name
    })
  );
}

function updateTagFilterForm(newTagFilters, updateForm, form) {
  const backendTagFilters = getTagFilterListForBackendSubscription(newTagFilters);
  const tagFilters = withoutViewOnlyFilters(backendTagFilters);
  updateForm(
    form
      .updateIn(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
  );
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

function withoutViewOnlyFilters(tagFilters) {
  return tagFilters.filter(tf => tf.name !== applicationNameTag);
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
