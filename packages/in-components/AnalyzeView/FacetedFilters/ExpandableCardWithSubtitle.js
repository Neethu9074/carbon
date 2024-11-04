/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

import { IconButton } from '@instana/components';

import { t } from 'in-i18n';

import locals from './ExpandableCardWithSubtitle.mless';

export default function ExpandableCardWithSubtitle({
  title,
  subtitle,
  rightHeaderContent,
  disabled,
  expansionTracker,
  headerClassName,
  bodyClassName,
  className,
  openByDefault = false,
  hasMarginBottom,
  useMaxAvailableHeight,
  tooltipDisabled = false,
  children
}) {
  const [expanded, setExpanded] = useState(openByDefault);

  const id = uniqueId('fieldset_');
  const topLeft = (
    <div
      className={classNames(locals.header, locals.left, {
        [locals.disabled]: disabled
      })}
    >
      {title && (
        <legend id={id} className={locals.title}>
          {title}
        </legend>
      )}
    </div>
  );
  const bottomLeft = (
    <div className={classNames(locals.subheader)}>
      {subtitle && (
        <span
          className={classNames(locals.subtitle, {
            [locals.disabled]: disabled
          })}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  const topRight = (
    <div className={classNames(locals.header, locals.right)}>
      {rightHeaderContent}
      {!disabled && (
        <>
          <IconButton
            isWrapperedByTooltip={!tooltipDisabled}
            iconDescription={
              expanded
                ? t('in-components:expandableCard.tooltipShowLess')
                : t('in-components:expandableCard.tooltipShowMore')
            }
            aria-expanded={expanded}
            kind="action"
            className={locals.icon}
            type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
            onClick={() => {
              expansionTracker?.({
                expanded: !expanded
              });
              setExpanded(!expanded);
            }}
            size="compact"
          />
        </>
      )}
    </div>
  );

  const header = (
    <div className={locals.headerGrid}>
      {topLeft}
      {topRight}
      {subtitle && (!expanded || disabled) && bottomLeft}
    </div>
  );

  return (
    <fieldset aria-describedby={id}>
      <div
        className={classNames(locals.card, {
          [locals.useMaxAvailableHeight]: useMaxAvailableHeight,
          [locals.hasMarginBottom]: hasMarginBottom,
          [className]: className
        })}
      >
        <div
          className={classNames(locals.cardHeader, {
            [locals.withBottomBorder]: !disabled && expanded,
            [headerClassName]: headerClassName,
            [locals.disabled]: disabled
          })}
          onClick={() => setExpanded(!expanded)}
        >
          {header}
        </div>

        {!disabled && expanded && children && (
          <div
            className={classNames(locals.cardBody, {
              [bodyClassName]: bodyClassName && !!children
            })}
          >
            {children}
          </div>
        )}
      </div>
    </fieldset>
  );
}
