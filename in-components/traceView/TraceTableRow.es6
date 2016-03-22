import React from 'react';

import './TraceTableRow.less';

const block = 'in-trace-table-row';
const cellClassName = block + '__cell';

export default function TraceTableRow(props) {
  let classes = block;
  if (props.selectedTraceId === props.trace.id) {
    classes += ' ' + block + '--selected';
  }
  return (
    <div className={classes}
         onClick={() => props.onClick(props.trace.id)}>
      <span className={cellClassName}>
        {props.trace.start}
      </span>
      <span className={cellClassName}>
        {props.trace.name}
      </span>
      <span className={cellClassName}>
        {props.trace.duration}
      </span>
    </div>
  );
}

TraceTableRow.propTypes = {
  trace: React.PropTypes.object.isRequired,
  selectedTraceId: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired
};
