import React, { forwardRef } from 'react';

import classNames from 'classnames';
import useObservable from 'in-hooks/useObservable';

import locals from './Link.mless';

export const useObservableConfig = {
  // It is acceptable to very briefly keep outdated state in the href attribute.
  // We furthermore have some component usages that rely on this behavior.
  // Specifically for situations like this:
  // - link with href$ and onClick prop click
  // - [link is clicked]
  // - onClick causes a re-render of the component changing the href$
  // - useObservable removes the href to ensure consistent state because href$ changed
  // - [link click processing finished]
  // - browser no longer has a link to follow
  // - the new href$ observable emits a value and a new href is set for the link
  resetStateOnObservableChange: false
};

export default forwardRef(function Link(
  { href, href$, onClick, children, title, target, className, style, external, ellipsis, id, onKeyDown, onKeyUp },
  ref
) {
  const resolvedHref = useObservable(href$, [href$], useObservableConfig) || href;
  return (
    <a
      href={resolvedHref}
      onClick={onClick}
      title={title}
      className={classNames({ [className]: className, [locals.ellipsis]: ellipsis })}
      style={style}
      target={target || (external ? '_blank' : undefined)}
      rel={external ? 'noopener noreferrer' : undefined}
      id={id}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      ref={ref}
    >
      {children}
    </a>
  );
});
