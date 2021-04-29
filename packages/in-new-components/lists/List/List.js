/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, forwardRef } from 'react';
import { useAutoFocus } from '@instana/hooks';
import { Link } from '@instana/components';
import classNames from 'classnames';
import rpt from 'prop-types';

import { toInteractiveElement, withInteractivitySideEffects } from 'in-new-components/interactiveCustomElement';
import HorizontalIndicatorLiComponent from 'in-new-components/lists/List/HorizontalIndicatorLi';
import LoadingSkeletonLiComponent from 'in-new-components/lists/List/LoadingSkeletonLi';
import LoadMoreLiComponent from 'in-new-components/lists/List/LoadMoreLi';
import ListGroupComponent from 'in-new-components/lists/List/ListGroup';
import { emptyObject } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './List.mless';

export { default as ColumnizedContent } from 'in-new-components/lists/List/ColumnizedContent';

export const ListGroup = ListGroupComponent;
export const LoadMoreLi = LoadMoreLiComponent;
export const HorizontalIndicatorLi = HorizontalIndicatorLiComponent;
export const LoadingSkeletonLi = LoadingSkeletonLiComponent;
export const supportBorderRadii = ['medium'];

export const Ul = forwardRef(function Ul(
  {
    framed = true,
    className,
    children,
    borderRadius,
    refSetter,
    component: Component = 'ul',
    space = 'disabled',
    ...otherProps
  },
  ref
) {
  return (
    <Component
      className={classNames({
        [locals.list]: true,
        [locals.framed]: framed === true && space === 'disabled',
        [locals.framedTopBottom]: framed === 'topBottom',
        [locals.frameChildren]: framed === true && space !== 'disabled',
        [className]: className,
        [locals[`spacing-${space}`]]: space,
        [locals[`${borderRadius}BorderRadius`]]: borderRadius
      })}
      ref={ref || refSetter}
      {...otherProps}
    >
      {children}
    </Component>
  );
});

export const Li = forwardRef(function Li(props, ref) {
  const {
    active,
    className,
    children,
    size,
    renderNestedContent,
    subList,
    href,
    href$,
    style,
    noAlternatingBg,
    forceAlternateBg,
    toggleContentOnRowClick,
    initiallyOpen,
    onDefaultHrefInteractionSideEffect,
    autoFocus,
    component: Component = 'li',
    borderRadius,
    highlightOpenState = true,
    tracking,
    roundShadow,
    ...liProps
  } = props;
  let { onClick } = props;

  const expandable = renderNestedContent || subList;
  const [open, setOpen] = useState(initiallyOpen);
  const itemElementRef = useAutoFocus();

  let itemElementInteractivityProps = emptyObject;
  if (onClick) {
    itemElementInteractivityProps = toInteractiveElement({
      onDefaultInteraction: onClick,
      ariaLabel: t('in-new-components:list.labelInitiateDefaultAction')
    });
  } else if (toggleContentOnRowClick) {
    itemElementInteractivityProps = toInteractiveElement({
      onDefaultInteraction: () => {
        const nextState = !open;
        tracking?.onToggleContentRow?.(nextState);
        setOpen(nextState);
      },
      ariaLabel: t('in-new-components:list.labelToggleExtraContent')
    });
  }

  const itemElement = (
    <div
      className={classNames({
        [locals.itemContent]: true,
        [locals.itemContentWithNestedContent]: expandable,
        [locals.itemContentExpanded]: open,
        [locals.clickable]: onClick || href || href$ || toggleContentOnRowClick,
        [locals[size]]: size,
        [className]: className
      })}
      style={style}
      {...itemElementInteractivityProps}
      ref={autoFocus ? itemElementRef : undefined}
    >
      {children}

      {expandable && (
        <div className={locals.actions}>
          <SvgIcon
            className={classNames({
              [locals.expandIcon]: true,
              [locals.expandIconRoundShadow]: roundShadow
            })}
            type={open ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
            aria-label={t('in-new-components:list.labelToggleExtraContent')}
            onClick={toggleContentOnRowClick ? undefined : () => setOpen(!open)}
          />
        </div>
      )}
    </div>
  );

  let linkInteractivityProps = emptyObject;
  if (onDefaultHrefInteractionSideEffect) {
    linkInteractivityProps = withInteractivitySideEffects({
      // Enforce asynchronous execution to truly only support side-effects. With synchronous
      // execution, it can happen that the side-effect is used to close an overlay and re-focus
      // the overlay button. In those synchronous side effect cases, the currently executing event
      // handling mechanism gets into a weird state that is very hard to reason about.
      onDefaultInteraction: () => setTimeout(onDefaultHrefInteractionSideEffect, 0),
      allowSideEffectsOnPrimaryInteractiveElements: true
    });
  }

  return (
    <Component
      className={classNames({
        [locals.listItem]: true,
        [locals.noAlternatingBg]: noAlternatingBg,
        [locals.forceAlternateBg]: forceAlternateBg,
        [locals.expanded]: open && highlightOpenState,
        [locals.active]: active,
        [locals[`${borderRadius}ListItemBorderRadius`]]: borderRadius
      })}
      ref={ref}
      {...liProps}
    >
      {href || href$ ? (
        <Link className={locals.link} href={href} href$={href$} {...linkInteractivityProps}>
          {itemElement}
        </Link>
      ) : (
        itemElement
      )}

      {renderNestedContent && open && <div className={locals.nestedContent}>{renderNestedContent()}</div>}
      {open && subList}
    </Component>
  );
});

Li.propTypes = {
  active: rpt.bool,
  autoFocus: rpt.bool,
  borderRadius: rpt.oneOf(['medium']),
  children: rpt.node.isRequired,
  className: rpt.string,
  component: rpt.oneOfType([rpt.string, rpt.elementType]),
  highlightOpenState: rpt.bool,
  href: rpt.string,
  href$: rpt.any,
  initiallyOpen: rpt.bool,
  // No automatic switching between the two possible background colors
  noAlternatingBg: rpt.bool,
  // Force the alternate background color. Can be used together with noAlternatingBg
  // to implement custom coloring rules.
  forceAlternateBg: rpt.bool,
  onClick: rpt.func,
  onDefaultHrefInteractionSideEffect: rpt.func,
  tracking: rpt.shape({
    onToggleContentRow: rpt.func
  }),
  renderNestedContent: rpt.func,
  size: rpt.oneOf(['compact', 'normal']),
  style: rpt.object,
  subList: rpt.node,
  toggleContentOnRowClick: rpt.bool,
  roundShadow: rpt.bool
};
