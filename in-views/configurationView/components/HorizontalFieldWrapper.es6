import React from 'react';

import './HorizontalFieldWrapper.less';


const block = 'in-config-view-horizontal-field-wrapper';

export default function HorizontalFieldWrapper({children, widths}) {
  return (
    <div className={block}>
      {children.map((child, i) =>
        <div key={i}
             style={{ width: widths[i] }}>
          {child}
        </div>
      )}
    </div>
  );
}
