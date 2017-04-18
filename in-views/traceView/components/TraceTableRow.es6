import rpt from 'prop-types';
import React from 'react';

import EntityColumnContent from 'in-views/traceView/components/EntityColumnContent';
import { getServiceSideForOverview } from 'in-sdk/tracing';
import SvgIcon from 'in-components/SvgIcon';

import './TraceTableRow.less';

const block = 'in-trace-table-row';
const cellClassName = block + '__cell';

export default function TraceTableRow({ selectedTraceId, trace, onClick }) {
  let classes = block;
  if (selectedTraceId === trace.id) {
    classes += ' ' + block + '--selected';
  }

  const side = getServiceSideForOverview(trace.raw);
  const serviceSnapshotId = trace[`${side}ServiceId`];

  return (
    <div className={classes} onClick={() => onClick(trace.id)}>
      <div className={cellClassName}>
        {trace.raw.get('errorCount') > 0
          ? <SvgIcon className={`${block}__error-icon`} type="error" height={12} color="#40535b" />
          : null}
      </div>
      <span className={cellClassName}>
        {trace.start}
      </span>
      <span className={cellClassName}>
        {trace.name}
      </span>
      <span className={cellClassName}>
        {trace.duration}
      </span>
      <span className={cellClassName}>
        {trace.totalErrorCount}
      </span>
      <span className={cellClassName}>
        {serviceSnapshotId
          ? <EntityColumnContent serviceSnapshotId={serviceSnapshotId} time={trace.startMillis} />
          : null}
      </span>
    </div>
  );
}

TraceTableRow.propTypes = {
  trace: rpt.object.isRequired,
  onClick: rpt.func.isRequired,
  selectedTraceId: rpt.string
};
