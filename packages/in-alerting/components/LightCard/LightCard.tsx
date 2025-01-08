/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { toInteractiveElement } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './LightCard.mless';

interface LightCardProps {
  title?: ReactNode;
  titleSubContent?: ReactNode;
  children?: ReactNode;
  header?: ReactNode;
  label?: string;

  onHeaderBackgroundClicked?: () => void;

  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  withoutPadding?: boolean;
  darkFrame?: boolean;
  framed?: boolean;
  useMaxAvailableHeight?: boolean;
  isTearSheetView?: boolean;
}

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
  label,
  isTearSheetView = false
}: LightCardProps) {
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
        // @ts-expect-error this creates an undefined: undefined key value pair if className is undefined. TS errors on this, but in the context of class names it is acceptable.
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
          // @ts-expect-error this creates an undefined: undefined key value pair if className is undefined. TS errors on this, but in the context of class names it is acceptable.
          [headerClassName]: headerClassName,
          [locals.noSubContent]: !titleSubContent,
          [locals.whiteBg]: isTearSheetView
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
          onClick={onClickPrevented}
        >
          {header}
        </div>
      </div>

      <div
        className={classNames({
          [locals.body]: children,
          [locals.bodyWithoutPadding]: withoutPadding,
          // @ts-expect-error this creates an undefined: undefined key value pair if className is undefined. TS errors on this, but in the context of class names it is acceptable.
          [bodyClassName]: bodyClassName
        })}
      >
        {children}
      </div>
    </div>
  );
}
