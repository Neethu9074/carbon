import React from 'react';

import './TraceHeading.less';


const rpt = React.PropTypes;
const block = 'in-trace-heading';

export default function TraceHeading({children}) {
  return (
    <h1 className={block}>
      {children}
    </h1>
  );
}

TraceHeading.propTypes = {
  className: rpt.string,
  children: rpt.any
};
