import React from 'react';

import './LogLine.less';

const block = 'in-log-line';

export default function LogLine({line}) {
  return (
    <div className={block}>
      {line}
    </div>
  );
}
