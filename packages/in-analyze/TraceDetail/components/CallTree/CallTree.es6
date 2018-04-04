import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-charts/scale';

import locals from './CallTree.mless';

export default function CallTree({
  spanTreeResult,
  getColor = () => '#e6e6e6',
  selectedCall$,
  onCallClicked,
  onSubCallClicked
}) {
  const isLoading = get(spanTreeResult, ['progress', 'loading'], false);
  if (isLoading) {
    return <LoadingCallTree progress={spanTreeResult.progress} />;
  }

  const hasErrors = spanTreeResult.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={spanTreeResult.errors} />;
  }

  const rootCall = spanTreeResult.data;

  const scale = createScale();
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(rootCall.start);
  scale.setDomainTo(rootCall.start + rootCall.duration);

  return (
    <div className={locals.callTree}>
      <TreeHeader rootCall={rootCall} scale={scale} />
      <Row
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
