import PropTypes from 'prop-types';
import React from 'react';

import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { availableFilterTags } from 'in-websites/tags';

import locals from './AlertLocationFilters.mless';

export default function AlertLocationFilters({ form, websiteLabel, timeConfig, onChange, advancedMode }) {
  return (
    form && (
      <div className={locals.container}>
        <div className={locals.wrapper}>
          <QuickFilterBar
            className={locals.bar}
            timeConfig={timeConfig}
            tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
            upsertTagFilter={newTagFilter => {
              const newTagFilters = withoutTagFilterForName(getTagFilters(form), newTagFilter.name);
              newTagFilters.push(newTagFilter);
              onChange(form, fieldNames.tagFilters, newTagFilters);
            }}
            removeTagFilter={name => {
              if (name !== 'beacon.website.name') {
                onChange(form, fieldNames.tagFilters, withoutTagFilterForName(getTagFilters(form), name));
              }
            }}
            onMoreClick={tagFilter => {
              setActiveDialog(
                <WebsiteEditTagFilterDialog
                  tagFilter={tagFilter}
                  tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
                  setTagFilters={tagFilters => onChange(form, fieldNames.tagFilters, tagFilters)}
                  tagSuggestions={availableFilterTags.error.filter(
                    name => name !== 'beacon.website.name' && name !== 'beacon.website.id'
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
          <div className={locals.filterList}>
            <TagFilterListPresenter
              onTagFilterClick={tagFilter => {
                setActiveDialog(
                  <WebsiteEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
                    setTagFilters={tagFilters => onChange(form, fieldNames.tagFilters, tagFilters)}
                    tagSuggestions={availableFilterTags.error}
                    timeConfig={timeConfig}
                  />
                );
              }}
              tagFilters={mutateFiltersForView(getTagFilters(form), websiteLabel)}
              readonly
            />
          </div>
        </div>
      </div>
    )
  );
}

AlertLocationFilters.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

function withoutTagFilterForName(tagFilters, name) {
  return tagFilters.filter(tf => tf.name !== name);
}

function mutateFiltersForView(tagFilters, websiteLabel) {
  const hasWebsiteName = tagFilters.some(({ name }) => name === 'beacon.website.name');
  return hasWebsiteName
    ? tagFilters
    : [
        {
          name: 'beacon.website.name',
          operator: 'EQUALS',
          stringValue: websiteLabel
        },
        ...tagFilters
      ];
}

function getTagFilters(form) {
  return form && form.get(fieldNames.tagFilters).value;
}
