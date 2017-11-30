import React from 'react';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    if (props.href) {
      return {};
    }
    return {
      href: props.href$
    };
  },
  function Link({ href, onClick, children, title, target, className, style, external }) {
    if (external) {
      return (
        <a
          href={href}
          onClick={onClick}
          title={title}
          className={className}
          style={style}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <a href={href} onClick={onClick} title={title} target={target} className={className} style={style}>
        {children}
      </a>
    );
  }
);
