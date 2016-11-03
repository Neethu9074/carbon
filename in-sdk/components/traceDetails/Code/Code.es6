import React from 'react';

import Code from 'in-components/Code';

import './Code.less';

const block = 'in-trace-view-code';

export default function CodeWrapper(props) {
  return (
    <div className={block}>
      <Code {...props} />
    </div>
  );
}
