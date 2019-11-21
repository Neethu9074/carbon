import React from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';

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
  const isInteractiveCard = !!onHeaderBackgroundClicked;
  const onClickPrevented = isInteractiveCard ? stopPropagationAndPreventDefault : undefined;
  const headerProps = isInteractiveCard
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
          [locals.clickableHeader]: isInteractiveCard
        })}
        {...headerProps}
      >
        <div className={locals.title}>
          {title}
          {titleSubText && <span className={locals.titleSubText}>{titleSubText}</span>}
        </div>
        <div
          className={evaluateClassNames({
            [locals.nonClickable]: isInteractiveCard
          })}
          onClick={onClickPrevented}
        >
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
