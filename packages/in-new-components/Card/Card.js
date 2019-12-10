import PropTypes from 'prop-types';
import React from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Card.mless';

export default function Card({
  title,
  titleSubContent,
  children,
  withoutPadding,
  header,
  onHeaderBackgroundClicked,
  className,
  bodyClassName,
  darkFrame,
  framed = true,
  useMaxAvailableHeight,
  label
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
        [locals.darkFrame]: darkFrame,
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
        {label ? (
          <div>
            {<div className={locals.twoLineTitleLabel}>{label}</div>}
            {<div className={locals.twoLineTitle}>{title}</div>}
          </div>
        ) : (
          <div className={locals.title}>
            {title}
            {titleSubContent && <span className={locals.titleSubContent}>{titleSubContent}</span>}
          </div>
        )}

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

Card.propTypes = {
  bodyClassName: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  darkFrame: PropTypes.bool,
  framed: PropTypes.bool,
  header: PropTypes.node,
  label: PropTypes.string,
  onHeaderBackgroundClicked: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  titleSubContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  useMaxAvailableHeight: PropTypes.bool,
  withoutPadding: PropTypes.bool
};
