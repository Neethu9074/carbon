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
import { blacklistedTagFiltersOfAlertType } from 'in-applications/alerting/data/blueprintConfig';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { getBlueprintObject } from 'in-applications/alerting/trackingHelpers';
import QuickFilterBar from 'in-applications/alerting/analyze/QuickFilterBar';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getAnalyzeFilterTagKeys } from 'in-applications/tags';
import { propTypeTimeConfig } from 'in-stores/time/config';

const applicationNameTag = 'application.name';
const notContainedInTagSuggestions = ['application.id', 'application.name', 'service.id', 'endpoint.id'];

export default function AlertLocationFilters({
  advancedMode,
  form,
  timeConfig,
  applicationLabel,
  updateForm,
  withoutLatencyItem
}) {
  const alertType = form.get('rule').get('alertType').value;
  const blacklistedTagFilters = blacklistedTagFiltersOfAlertType(alertType);
  const tagSuggestions = getAnalyzeFilterTagKeys()
    .filter(tag => !notContainedInTagSuggestions.includes(tag))
    .filter(tag => !blacklistedTagFilters.includes(tag));

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
                updateTagfilterForm(newTagFilters, updateForm, form);
              }}
              removeTagFilter={(...args) => {
                const tag = args[0];
                const key = args[3];

                if (tag !== applicationNameTag) {
                  const newTagFilters = key
                    ? withoutTagFiltersForNameAndValue(getTagFilters(form), { name: tag, value: key })
                    : withoutTagFiltersForName(getTagFilters(form), tag);

                  updateTagfilterForm(newTagFilters, updateForm, form);

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
                      updateTagfilterForm(tagFilters, updateForm, form);
                    }}
                    tagSuggestions={tagSuggestions}
                    timeConfig={timeConfig}
                    forAnalyzeCalls
                  />
                );
              }}
              align="bottomMiddle"
              showPageSelector
              removeBarPadding
              removeBarBackgroundColor
              hideClearFiltersButton
              withoutFiltersLabel
              withoutLatencyItem={withoutLatencyItem || alertType === 'slowness'}
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
                      updateTagfilterForm(withoutTagFiltersForNameAndValue(tagFilters, tagFilter), updateForm, form);
                      applicationsAlertingFilterEdit({
                        ...getBlueprintObject(form),
                        mode: advancedMode ? 'Advanced' : 'Simple',
                        tagFilters
                      });
                    }}
                    tagSuggestions={tagSuggestions}
                    timeConfig={timeConfig}
                    forAnalyzeCalls
                  />
                );
              }}
              onRemoveTagFilter={tagFilter => {
                updateTagfilterForm(withoutTagFiltersForNameAndValue(getTagFilters(form), tagFilter), updateForm, form);
                applicationsAlertingFilterRemove({
                  ...getBlueprintObject(form),
                  mode: advancedMode ? 'Advanced' : 'Simple',
                  filterName: tagFilter.name
                });
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
  updateTagfilterForm(newTagFilters, updateForm, form);
  applicationsAlertingFilterAdd({
    ...getBlueprintObject(form),
    mode: advancedMode ? 'Advanced' : 'Simple',
    filterName: newTagFilter.name
  });
}

function updateTagfilterForm(newTagFilters, updateForm, form) {
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
