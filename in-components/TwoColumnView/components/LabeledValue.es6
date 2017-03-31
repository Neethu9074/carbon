import React from 'react';

import './LabeledValue.less';

const block = 'in-two-columns-view-labeled-value';

export default function LabeledValue({ label, children, style, lightTheme = false }) {
  return (
    <span className={block} style={style}>
      <span
        className={`${block}__label`}
        style={{
          background: lightTheme ? '#00d8da' : '#92A5AE'
        }}
      >
        {label}
      </span>
      {children}
    </span>
  );
}
