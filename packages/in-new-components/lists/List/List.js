import React, { useState } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import { toInteractiveElement, withInteractivitySideEffects } from 'in-new-components/interactiveCustomElement';
import HorizontalIndicatorLiComponent from 'in-new-components/lists/List/HorizontalIndicatorLi';
import LoadingSkeletonLiComponent from 'in-new-components/lists/List/LoadingSkeletonLi';
import LoadMoreLiComponent from 'in-new-components/lists/List/LoadMoreLi';
import ListGroupComponent from 'in-new-components/lists/List/ListGroup';
import { emptyObject } from 'in-services/fixedObjects';
import useAutoFocus from 'in-hooks/useAutoFocus';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './List.mless';

export { default as ColumnizedContent } from 'in-new-components/lists/List/ColumnizedContent';

export const ListGroup = ListGroupComponent;
export const LoadMoreLi = LoadMoreLiComponent;
export const HorizontalIndicatorLi = HorizontalIndicatorLiComponent;
export const LoadingSkeletonLi = LoadingSkeletonLiComponent;
export const supportBorderRadii = ['medium'];

export function Ul({
  framed = true,
  className,
  children,
  borderRadius,
  style,
  refSetter,
  onKeyUp,
  onKeyDown,
  component: Component = 'ul',
  space = 'disabled'
}) {
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
      style={style}
      ref={refSetter}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
    >
      {children}
    </Component>
  );
}

export function Li(props) {
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
    toggleContentOnRowClick,
    initiallyOpen,
    onDefaultHrefInteractionSideEffect,
    autoFocus,
    component: Component = 'li',
    borderRadius,
    highlightOpenState = true,
    tracking
  } = props;
  let { onClick } = props;

  const expandable = renderNestedContent || subList;
  const [open, setOpen] = useState(initiallyOpen);
  const itemElementRef = useAutoFocus();

  let itemElementInteractivityProps = emptyObject;
  if (onClick) {
    itemElementInteractivityProps = toInteractiveElement({
      onDefaultInteraction: onClick,
      ariaLabel: 'Initiate default action'
    });
  } else if (toggleContentOnRowClick) {
    itemElementInteractivityProps = toInteractiveElement({
      onDefaultInteraction: () => {
        const nextState = !open;
        tracking?.onToggleContentRow?.(nextState);
        setOpen(nextState);
      },
      ariaLabel: 'Toggle extra content'
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
            className={locals.expandIcon}
            type={open ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
            aria-label="Toggle extra content"
            onClick={
              toggleContentOnRowClick
                ? undefined
                : e => {
                    e.stopPropagation();
                    setOpen(!open);
                  }
            }
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
        [locals.expanded]: open && highlightOpenState,
        [locals.active]: active,
        [locals[`${borderRadius}ListItemBorderRadius`]]: borderRadius
      })}
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
}

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
  noAlternatingBg: rpt.bool,
  onClick: rpt.func,
  onDefaultHrefInteractionSideEffect: rpt.func,
  tracking: rpt.shape({
    onToggleContentRow: rpt.func
  }),
  renderNestedContent: rpt.func,
  size: rpt.oneOf(['compact', 'normal']),
  style: rpt.object,
  subList: rpt.node,
  toggleContentOnRowClick: rpt.bool
};
