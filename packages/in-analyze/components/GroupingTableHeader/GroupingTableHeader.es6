import React from 'react';

import ResultHeader from 'in-analyze/components/ResultHeader';
import Button from 'in-new-components/Button';

import locals from './GroupingTableHeader.mless';

export default function GroupingTableHeader(props) {
  return (
    <div className={locals.wrapper}>
      <ResultHeader {...props} nbRows={props.totalHits} withoutMargin />
      {props.setIsChartSectionExpanded && (
        <Button
          kind="secondary"
          onClick={() => props.setIsChartSectionExpanded(!props.isChartSectionExpanded)}
          icon="lib_views_stats"
        >
          {props.isChartSectionExpanded ? 'Hide' : 'Show'} Graph
        </Button>
      )}
    </div>
  );
}
