import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Card.mless';

export default function Card({
  title,
  titleSubText,
  children,
  withoutPadding,
  header,
  className,
  bodyClassName,
  framed = true,
  useMaxAvailableHeight
}) {
  return (
    <div
      className={evaluateClassNames({
        [className]: true,
        [locals.framed]: framed,
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight
      })}
    >
      <div className={locals.header}>
        <div className={locals.title}>
          {title}
          {titleSubText && <span className={locals.titleSubText}>{titleSubText}</span>}
        </div>
        {header}
      </div>

      <div
        className={evaluateClassNames({
          [locals.body]: true,
          [locals.bodyWithoutPadding]: withoutPadding,
          [bodyClassName]: bodyClassName
        })}
      >
        {children}
      </div>
    </div>
  );
}
