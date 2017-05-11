import rpt from 'prop-types';
import React from 'react';

import EntityColumnContent from 'in-views/traceView/components/EntityColumnContent';
import { toggleIncludeInAnalytics } from 'in-stores/traces/analytics';
import { stopPropagation } from 'in-services/util/function';
import { getServiceSideForOverview } from 'in-sdk/tracing';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './TraceTableRow.less';

const block = 'in-trace-table-row';
const cellClassName = block + '__cell';

export default function TraceTableRow({ selectedTraceId, trace, onClick, tracesSelectedForAnalytics }) {
  let classes = block;
  if (selectedTraceId === trace.id) {
    classes += ' ' + block + '--selected';
  }

  const side = getServiceSideForOverview(trace.raw);
  const serviceSnapshotId = trace[`${side}ServiceId`];

  return (
    <div className={classes} onClick={() => onClick(trace.id)}>
      <span className={cellClassName}>
        <input
          type="checkbox"
          className={`${block}__include_in_analytics`}
          onChange={e => onToggleTraceAnalyticsInclusion(e, trace.raw)}
          onClick={stopPropagation}
          checked={trace.id in tracesSelectedForAnalytics}
        />
      </span>
      <span className={cellClassName}>
        {trace.raw.get('errorCount') > 0
          ? <Tooltip content="Erroneous root span" align={'bottomLeft'}>
              <SvgIcon className={`${block}__error-icon`} type="error" height={12} color="#40535b" />
            </Tooltip>
          : null}
      </span>
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
  selectedTraceId: rpt.string,
  tracesSelectedForAnalytics: rpt.object
};

function onToggleTraceAnalyticsInclusion(event, trace) {
  stopPropagation(event);
  toggleIncludeInAnalytics(trace);
}
