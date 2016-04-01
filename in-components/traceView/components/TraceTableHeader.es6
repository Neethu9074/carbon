import React from 'react';

import './TraceTableHeader.less';

const block = 'in-trace-table-header';
const cellClassName = block + '__cell';

const selectedClassName = cellClassName + '--selected';

export default function TraceTableHeader() {
  return (
    <div className={block}>
      <span className={cellClassName}>
        Time Stamp
      </span>
      <span className={cellClassName}>
        Call
      </span>
      <span className={cellClassName + ' ' + selectedClassName}>
        Resp. Time
      </span>
    </div>
  );
}
