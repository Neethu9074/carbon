import PropTypes from 'prop-types';
import React from 'react';

import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { availableFilterTags } from 'in-websites/tags';

import locals from './AlertLocationFilters.mless';

const BEACON_WEBSITE_NAME = 'beacon.website.name';
const BEACON_WEBSITE_ID = 'beacon.website.id';
const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };

export default function AlertLocationFilters({ advancedMode, form, onChange, timeConfig, websiteLabel, isReadOnly }) {
  return (
    form && (
      <>
        {!isReadOnly && (
          <div className={locals.quickFilterBarWrapper}>
            <QuickFilterBar
              className={locals.bar}
              timeConfig={timeConfig}
              tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
              upsertTagFilter={newTagFilter => {
                const newTagFilters = withoutTagFilterForName(getTagFilters(form), newTagFilter.name);
                newTagFilters.push(newTagFilter);
                onChange(form, fieldNames.tagFilters, newTagFilters, doCalculateTresholdOnBackend);
              }}
              removeTagFilter={name => {
                if (name !== BEACON_WEBSITE_NAME) {
                  onChange(
                    form,
                    fieldNames.tagFilters,
                    withoutTagFilterForName(getTagFilters(form), name),
                    doCalculateTresholdOnBackend
                  );
                }
              }}
              onMoreClick={tagFilter => {
                setActiveDialog(
                  <WebsiteEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={getTagFilters(form)}
                    setTagFilters={tagFilters =>
                      onChange(form, fieldNames.tagFilters, tagFilters, doCalculateTresholdOnBackend)
                    }
                    tagSuggestions={availableFilterTags.error.filter(
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
            />
          </div>
        )}
        <div className={locals.filterList}>
          <TagFilterListPresenter
            onTagFilterClick={tagFilter => {
              setActiveDialog(
                <WebsiteEditTagFilterDialog
                  tagFilter={tagFilter}
                  tagFilters={getTagFilters(form)}
                  setTagFilters={tagFilters =>
                    onChange(form, fieldNames.tagFilters, tagFilters, doCalculateTresholdOnBackend)
                  }
                  tagSuggestions={availableFilterTags.error}
                  timeConfig={timeConfig}
                />
              );
            }}
            onRemoveTagFilter={({ name }) =>
              onChange(
                form,
                fieldNames.tagFilters,
                withoutTagFilterForName(getTagFilters(form), name),
                doCalculateTresholdOnBackend
              )
            }
            tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
            readonlyFilterNames={[BEACON_WEBSITE_NAME]}
            undeleteableFilterNames={[BEACON_WEBSITE_NAME]}
          />
        </div>
      </>
    )
  );
}

AlertLocationFilters.propTypes = {
  advancedMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool
};

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
  return form.get(fieldNames.tagFilters).value;
}
