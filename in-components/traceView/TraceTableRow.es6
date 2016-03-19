import React from 'react';

import './TraceTableRow.less';

const block = 'in-trace-table-row';
const cellClassName = block + '__cell';

export default function TraceTableRow(props) {
  return (
    <div className={block}>
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
  trace: React.PropTypes.object.isRequired
};
