/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-services/scale';

import locals from './CallTree.mless';

// We are reusing this scale object for every render operation. We are doing this because we want to avoid
// excessive creation of scale objects. These scale objects would also interfere with change detection
// mechanisms.
// Warning: This code will break when we want to show two call trees concurrently (which is not on the roadmap)
const scale = createScale();

export default function CallTree({
  callTreeResult,
  getColor = () => '#e6e6e6',
  selectedCall$,
  openedCall$,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace
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

  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(start);
  scale.setDomainTo(end);

  return (
    <div className={locals.callTree}>
      <TreeHeader rootCall={rootCall} scale={scale} />
      <Row
        call={rootCall}
        getColor={getColor}
        scale={scale}
        selectedCall$={selectedCall$}
        openedCall$={openedCall$}
        onSubCallClicked={onSubCallClicked}
        onCallClicked={onCallClicked}
        isLargeTrace={isLargeTrace}
      />
    </div>
  );
}
