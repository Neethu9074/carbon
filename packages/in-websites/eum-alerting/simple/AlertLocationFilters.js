import PropTypes from 'prop-types';
import React from 'react';

import { translateDemocratisationTagFiltersToAnalyzeTagFilters, availableFilterTags } from 'in-websites/tags';
import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { setActiveDialog } from 'in-components/DialogPresenter/store';

import locals from './AlertLocationFilters.mless';

export default function AlertLocationFilters({ form, websiteLabel, timeConfig, onChange }) {
  return (
    form && (
      <div className={locals.container}>
        <div className={locals.wrapper}>
          <QuickFilterBar
            className={locals.bar}
            timeConfig={timeConfig}
            showWebsiteSelector
            showPageSelector
            tagFilters={
              form &&
              translateDemocratisationTagFiltersToAnalyzeTagFilters({
                websiteLabel,
                tagFilters: form.get(fieldNames.tagFilters).value
              })
            }
            upsertTagFilter={newTagFilter => {
              const newTagFilters = getTagfilters(form).filter(({ name }) => name !== newTagFilter.name);
              newTagFilters.push(newTagFilter);
              onChange(form, fieldNames.tagFilters, newTagFilters);
            }}
            // removeTagFilter={args => console.log({ args })}
            removeBarPadding
            removeBarBackgroundColor
            hideClearFiltersButton
            align="bottomMiddle"
          />
          <div className={locals.filterList}>
            <TagFilterListPresenter
              onTagFilterClick={tagFilter => {
                setActiveDialog(
                  <WebsiteEditTagFilterDialog
                    tagFilter={tagFilter}
                    tagFilters={[
                      {
                        name: 'beacon.website.name',
                        operator: 'EQUALS',
                        stringValue: websiteLabel
                      },
                      ...form.get(fieldNames.tagFilters).value
                    ]}
                    setTagFilters={tagFilters => {
                      // console.log(tagFilters);
                      onChange(form, fieldNames.tagFilters, tagFilters);
                    }}
                    tagSuggestions={availableFilterTags.error}
                    timeConfig={timeConfig}
                  />
                );
              }}
              tagFilters={[
                {
                  name: 'beacon.website.name',
                  operator: 'EQUALS',
                  stringValue: websiteLabel
                },
                ...form.get(fieldNames.tagFilters).value
              ]}
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

function getTagfilters(form) {
  return form && form.get(fieldNames.tagFilters).value;
}
