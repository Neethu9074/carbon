import { compose, withProps } from 'recompose';
import React from 'react';

import {
  analyzeOrderByUrlParameter,
  analyzeOrderDirectionUrlParameter,
  analyzeTagFiltersUrlParameter,
  analyzeGroupingUrlParameter,
  analyzeDataSourceUrlParameter
} from 'in-profiling/navigation/urlParameters';
import GroupedProfiledProcesses from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/GroupedProfiledProcesses';
import ProfiledProcesses from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcesses';
import EditGroupDialog from 'in-analyze/components/EditGroupDialog/EditGroupDialog';
import getProfiledProcesses from 'in-profiling/subscriptions/getProfiledProcesses';
import EmptyAnalyzeView from 'in-profiling/analyze/AnalyzeView/EmptyAnalyzeView';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { analyzeGrouping as groupingTrackers } from 'in-profiling/tracker';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { tagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import { entityTypes } from 'in-analyze/applicationFilter';
import { availableGroupingTags } from 'in-profiling/tags';
import { operators } from 'in-analyze/applicationFilter';
import { createFilter } from 'in-analyze/filterBuilder';
import { getTimeConfig } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-new-components/Footer';

export default compose(
  withUrlState({
    bind: [
      analyzeTagFiltersUrlParameter,
      analyzeGroupingUrlParameter,
      analyzeDataSourceUrlParameter,
      analyzeOrderByUrlParameter,
      analyzeOrderDirectionUrlParameter
    ],
    reducerName: 'onChange',
    reduceAndGetAsUrlName: 'getChangeAsUrl'
  }),
  withProps(({ group, tagFilters, orderBy, orderDirection }) => {
    return {
      tagFilters,
      orderBy,
      defaultSorting: group && group.groupbyTag ? 'groupName' : 'processName',
      orderDirection
    };
  }),
  withProps(({ tagFilters: existingTagFilters, dataSource, onChange, location, orderBy, orderDirection }) => {
    const timeConfig = getTimeConfig(location);
    return {
      setTagFilters: tagFilters => onChange({ tagFilters }),
      setGroup: group => {
        onChange({ group });
        if (!group || !group.groupbyTag) {
          groupingTrackers.remove({
            filters: existingTagFilters
          });
        } else {
          groupingTrackers.set({
            group: group,
            filters: existingTagFilters
          });
        }
      },
      disableGrouping: () => {
        groupingTrackers.remove();
        onChange({
          group: {},
          orderBy: orderBy,
          orderDirection: orderDirection
        });
      },
      timeConfig,
      filters: {
        dataSource,
        tagFilter: existingTagFilters,
        timeConfig
      }
    };
  }),
  withProps(props => ({
    openEditGroupDialog() {
      setActiveDialog(
        <EditGroupDialog
          help="Select a tag by which your profiles should be grouped."
          setGroup={props.setGroup}
          group={props.group}
          tagSuggestions={availableGroupingTags}
          timeConfig={props.timeConfig}
          tagFilters={props.tagFilters}
        />
      );
    },
    getGroupAsFilterUrl: params => getGroupAsFilterUrl({ ...props, ...params })
  })),
  tagFilterManipulators
)(props => (
  <WithEmptyStateFallback
    center={false}
    getHasDataToRender={() => getHasDataToRender(props)}
    FallbackComponent={EmptyAnalyzeView}
    type="Profiles"
  >
    <AnalyzeView {...props} />
  </WithEmptyStateFallback>
));

function AnalyzeView(props) {
  return (
    <>
      {props.group.groupbyTag ? <GroupedProfiledProcesses {...props} /> : <ProfiledProcesses {...props} />}
      <Footer />
    </>
  );
}

function getHasDataToRender({ timeConfig }) {
  return getProfiledProcesses({
    pagination: {
      cursor: null,
      retrievalSize: 1
    },
    order: {
      by: 'processName',
      direction: 'DESC'
    },
    filter: {
      timeConfig
    },
    tagFilters: []
  }).map(result => !result.data || result.data.totalHits > 0);
}

function getGroupAsFilterUrl({ getChangeAsUrl, tagFilters, group, orderBy, orderDirection, name }) {
  return getChangeAsUrl({
    tagFilters: tagFilters.concat(
      createFilter({
        name: group.groupbyTag,
        value: name,
        operator: operators.EQUALS,
        entity: entityTypes.SOURCE
      })
    ),
    group: {},
    orderBy: orderBy,
    orderDirection: orderDirection
  });
}
