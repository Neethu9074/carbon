import React, { Fragment } from 'react';
import { withProps } from 'recompose';

import SelectedApplication from 'in-settings/tabs/TeamSettings/components/SelectedApplication';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ApplicationSelect.mless';

const last24Hours = {
  windowSize: 86400000, // 24 hours
  to: null, // now
  autoRefresh: false
};

const tagFilters = [];

export default withProps(({ onSelectApplicationName }) => ({
  filterSuggestionsClientSide: true,
  getSuggestions: ({ timeConfig, tagFilters, tag }) => {
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName: tag
    }).map(mapData);
  },
  tag: 'application.name',
  singularLabel: 'Application',
  pluralLabel: 'Application',
  tagFilters,
  timeConfig: last24Hours,
  dataSource: 'calls',
  itemLabelRenderer: ApplicationItemLabel,
  withoutTextTransform: true,
  upsertTagFilter: ({ stringValue }) => onSelectApplicationName(stringValue)
}))(SelectedApplication);

function mapData(result) {
  if (!result.data) {
    return result;
  }
  return { ...result, data: result.data.suggestions };
}

function ApplicationItemLabel(itemLabel) {
  return (
    <Fragment>
      <SvgIcon className={locals.entityIcon} type="lib_application" width={24} height={24} />
      <span className={locals.itemText}>{itemLabel}</span>
    </Fragment>
  );
}
