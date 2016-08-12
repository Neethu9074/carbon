import React from 'react';

import './Button.less';

const rpt = React.PropTypes;
const block = 'in-button';

export default function Button({className, kind = 'default', type = 'button', onClick, style, children, href}) {
  let classes = `${block} ${block}--${kind}`;
  if (className) {
    classes = `${classes} ${className}`;
  }

  if (!href) {
    return (
      <button className={classes}
              type={type}
              onClick={onClick}
              style={style}>
        {children}
      </button>
    );
  }

  return (
    <a href={href}
       className={classes}
       onClick={onClick ? onClick : stopPropagation}
       style={style}>
      {children}
    </a>
  );
}


Button.propTypes = {
  className: rpt.string,
  style: rpt.object,
  children: rpt.any.isRequired,
  type: rpt.oneOf(['button', 'submit']),
  kind: rpt.oneOf(['default', 'secondary']),
  onClick: rpt.func,
  href: rpt.string
};


function stopPropagation(e) {
  e.stopPropagation();
}
