import React from 'react';

import ResultHeader from 'in-analyze/components/ResultHeader';

import locals from './GroupedProcessesTableHeader.mless';

export default function GroupedProcessesTableHeader(props) {
  return (
    <div className={locals.wrapper}>
      <ResultHeader
        {...props}
        itemType="Group"
        nbRows={props.totalHits}
        nbItems={props.totalRepresentedItemCount}
        withoutMargin
      />
    </div>
  );
}
