import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import locals from './Link.mless';

export default connectTo(
  props => {
    if (props.href) {
      return {};
    }
    return {
      href: props.href$
    };
  },
  function Link({ href, onClick, children, title, target, className, style, external, ellipsis }) {
    if (external) {
      return (
        <a
          href={href}
          onClick={onClick}
          title={title}
          className={evaluateClassNames({ [className]: className, [locals.ellipsis]: ellipsis })}
          style={style}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        onClick={onClick}
        title={title}
        target={target}
        className={evaluateClassNames({ [className]: className, [locals.ellipsis]: ellipsis })}
        style={style}
      >
        {children}
      </a>
    );
  }
);
