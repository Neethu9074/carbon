import React from 'react';

import './LabeledValue.less';

const block = 'in-trace-view-labeled-value';

export default function LabeledValue({label, children, style}) {
  return (
    <span className={block}
          style={style}>
      <span className={`${block}__label`}>
        {label}
      </span>
      {children}
    </span>
  );
}
