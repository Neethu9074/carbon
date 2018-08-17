import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-charts/scale';

import locals from './CallTree.mless';

export default function CallTree({
  openedCall,
  callTreeResult,
  getColor = () => '#e6e6e6',
  selectedCall$,
  onCallClicked,
  onSubCallClicked
}) {
  const isLoading = get(callTreeResult, ['progress', 'loading'], false);
  if (isLoading) {
    return <LoadingCallTree progress={callTreeResult.progress} />;
  }

  const hasErrors = callTreeResult.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={callTreeResult.errors} />;
  }

  const rootCall = callTreeResult.data;
  const start = getStart(rootCall);
  const end = getEnd(rootCall);

  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(start);
  scale.setDomainTo(end);

  return (
    <div className={locals.callTree}>
      <TreeHeader rootCall={rootCall} scale={scale} />
      <Row
        openedCall={openedCall}
        call={rootCall}
        getColor={getColor}
        scale={scale}
        selectedCall$={selectedCall$}
        onSubCallClicked={onSubCallClicked}
        onCallClicked={onCallClicked}
      />
    </div>
  );
}
