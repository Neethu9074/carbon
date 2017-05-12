import React from 'react';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      href: props.href$
    };
  },
  function Link({ href, children, target, className }) {
    return (
      <a href={href} target={target} className={className}>
        {children}
      </a>
    );
  }
);
