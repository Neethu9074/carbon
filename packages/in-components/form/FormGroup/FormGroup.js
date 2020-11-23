import React, { forwardRef } from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './FormGroup.less';

const block = 'in-form-group';

export default forwardRef(function FormGroup({ children, className, style, withoutBottomMargin }, ref) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [className]: className,
        [`${block}--without-bottom-margin`]: withoutBottomMargin
      })}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});
