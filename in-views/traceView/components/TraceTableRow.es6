import React from 'react';

import './TraceTableRow.less';


const block = 'in-trace-table-row';
const cellClassName = block + '__cell';
const rpt = React.PropTypes;

export default function TraceTableRow({selectedTraceId, trace, onClick}) {
  let classes = block;
  if (selectedTraceId === trace.id) {
    classes += ' ' + block + '--selected';
  }
  return (
    <div className={classes}
         onClick={() => onClick(trace.id)}>
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
    </div>
  );
}

TraceTableRow.propTypes = {
  trace: rpt.object.isRequired,
  onClick: rpt.func.isRequired,
  selectedTraceId: rpt.string
};
