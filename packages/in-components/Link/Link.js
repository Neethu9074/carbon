import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import useObservable from 'in-hooks/useObservable';

import locals from './Link.mless';

export default function Link({
  href,
  href$,
  onClick,
  children,
  title,
  target,
  className,
  style,
  external,
  ellipsis,
  id
}) {
  const resolvedHref = useObservable(href$, [href$]) || href;
  return (
    <a
      href={resolvedHref}
      onClick={onClick}
      title={title}
      className={evaluateClassNames({ [className]: className, [locals.ellipsis]: ellipsis })}
      style={style}
      target={target || (external ? '_blank' : undefined)}
      rel={external ? 'noopener noreferrer' : undefined}
      id={id}
    >
      {children}
    </a>
  );
}
