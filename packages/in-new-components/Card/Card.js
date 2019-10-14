import React from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { joinClassNames, evaluateClassNames } from 'in-services/util/classnames';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './Card.mless';

export default function Card({
  title,
  titleSubText,
  children,
  withoutPadding,
  header,
  onHeaderBackgroundClicked,
  className,
  bodyClassName,
  framed = true,
  useMaxAvailableHeight
}) {
  const headerProps = onHeaderBackgroundClicked
    ? toInteractiveElement({
        onDefaultInteraction: onHeaderBackgroundClicked
      })
    : {};

  return (
    <div
      className={evaluateClassNames({
        [className]: true,
        [locals.framed]: framed,
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight
      })}
    >
      <div
        className={evaluateClassNames({
          [locals.header]: true,
          [locals.clickableHeader]: onHeaderBackgroundClicked
        })}
        {...headerProps}
      >
        <div className={locals.title}>
          <span className={locals.nonClickable} onClick={stopPropagationAndPreventDefault}>
            {title}
          </span>
          {titleSubText && (
            <span
              className={joinClassNames(locals.titleSubText, locals.nonClickable)}
              onClick={stopPropagationAndPreventDefault}
            >
              {titleSubText}
            </span>
          )}
        </div>
        <div className={locals.nonClickable} onClick={stopPropagationAndPreventDefault}>
          {header}
        </div>
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
