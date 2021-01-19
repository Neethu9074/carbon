/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import AnalyzeGroupingInfo from 'in-analyze/AnalyzeView/components/AnalyzeEditGroupingInfo';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import ResultHeader from 'in-analyze/components/ResultHeader';
import Toggle from 'in-components/form/Toggle';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './GroupingTableHeader.mless';

export default connectTo({ isInternalVisible: isInternalVisible$ }, function GroupingTableHeader(props) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.leftSide}>
        <ResultHeader
          {...props}
          itemType={props.itemType || 'Row'}
          nbRows={props.totalHits}
          nbItems={props.totalRepresentedItemCount}
          withoutMargin
        />

        {props.forAnalyzeCalls ? (
          <AnalyzeGroupingInfo
            {...props}
            group={props.groupBy}
            timeConfig={props.timeConfig}
            tagFilters={props.tagFilters}
          />
        ) : (
          <GroupingInfo {...props} />
        )}
      </div>

      <div className={locals.labelWrapper}>
        {props.isInternalVisible && props.onPreviewEnabledChange && (
          <>
            <span className={locals.label}>Preview</span>
            <Toggle
              checked={props.previewEnabled}
              onChange={e => {
                props.onPreviewEnabledChange(e.target.checked);
              }}
            />
          </>
        )}
        <Button
          kind="secondary"
          icon="lib_views_folder"
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            props.openEditGroupDialog();
          }}
        >
          Group by
        </Button>
        {props.openMetricSelector && (
          <Button kind="secondary" onClick={props.openMetricSelector} icon="lib_actions_settings">
            Select Metrics
          </Button>
        )}
        {props.onChange && (
          <Button
            kind="secondary"
            onClick={() => props.onChange({ showGraph: !props.showGraph })}
            icon="lib_views_stats"
          >
            {props.showGraph ? 'Hide' : 'Show'} Graph
          </Button>
        )}
      </div>
    </div>
  );
});
