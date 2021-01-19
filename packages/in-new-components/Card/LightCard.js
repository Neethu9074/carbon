/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './LightCard.mless';

export default function LightCard({
  title,
  titleSubContent,
  children,
  withoutPadding,
  header,
  onHeaderBackgroundClicked,
  className,
  headerClassName,
  bodyClassName,
  darkFrame = false,
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
      className={classNames({
        [locals.card]: true,
        [className]: className,
        [locals.framed]: framed,
        [locals.darkFrame]: darkFrame,
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight
      })}
    >
      <div
        className={classNames({
          [locals.header]: true,
          [locals.clickableHeader]: isInteractiveCard,
          [headerClassName]: headerClassName,
          [locals.noSubContent]: !titleSubContent
        })}
        {...headerProps}
      >
        {label ? (
          <div>
            {<div className={locals.twoLineTitle}>{title}</div>}
            {<div className={locals.twoLineTitleLabel}>{label}</div>}
          </div>
        ) : (
          <div className={locals.title}>
            {title}
            {titleSubContent && <span className={locals.titleSubContent}>{titleSubContent}</span>}
          </div>
        )}

        <div
          className={classNames({
            [locals.nonClickable]: isInteractiveCard
          })}
          onClick={isInteractiveCard ? onClickPrevented : undefined}
        >
          {header}
        </div>
      </div>

      <div
        className={classNames({
          [locals.body]: children,
          [locals.bodyWithoutPadding]: withoutPadding,
          [bodyClassName]: bodyClassName
        })}
      >
        {children}
      </div>
    </div>
  );
}

LightCard.propTypes = {
  bodyClassName: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  darkFrame: PropTypes.bool,
  framed: PropTypes.bool,
  header: PropTypes.node,
  headerClassName: PropTypes.string,
  label: PropTypes.string,
  onHeaderBackgroundClicked: PropTypes.func,
  titleSubContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
  useMaxAvailableHeight: PropTypes.bool,
  withoutPadding: PropTypes.bool
};
