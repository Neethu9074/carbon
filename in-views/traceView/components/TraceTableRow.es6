import rpt from 'prop-types';
import React from 'react';

import EntityColumnContent from 'in-views/traceView/components/EntityColumnContent';
import { getServiceSideForOverview } from 'in-sdk/tracing';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './TraceTableRow.less';

const block = 'in-trace-table-row';
const cellClassName = block + '__cell';

export default function TraceTableRow({ selectedTraceId, markedTraces, trace, onRowClicked }) {
  let classes = block;
  const isSelected = selectedTraceId === trace.id;
  const isMarked = markedTraces && markedTraces.has(trace.id);
  if (isSelected) {
    classes += ' ' + block + '--selected';
  }
  if (isMarked) {
    classes += ' ' + block + '--marked';
  }

  const side = getServiceSideForOverview(trace.raw);
  const serviceSnapshotId = trace[`${side}ServiceId`];

  return (
    <div className={classes} onClick={e => onRowClicked(e, trace)}>
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
          ? <EntityColumnContent
              serviceSnapshotId={serviceSnapshotId}
              time={trace.startMillis}
              getLabelCallback={label => getServiceLabelWithEndpoint(label, trace.raw.get('destinationEndpointLabel'))}
            />
          : null}
      </span>
    </div>
  );
}

TraceTableRow.propTypes = {
  onRowClicked: rpt.func.isRequired,
  trace: rpt.object.isRequired,
  selectedTraceId: rpt.string,
  markedTraces: rpt.object
};

function getServiceLabelWithEndpoint(serviceLabel, endpointLabel) {
  if (endpointLabel) {
    return `${serviceLabel} : ${endpointLabel}`;
  }
  return serviceLabel;
}
