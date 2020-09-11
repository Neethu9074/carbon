import React, { useState } from 'react';

import { toInteractiveElement, withInteractivitySideEffects } from 'in-new-components/interactiveCustomElement';
import HorizontalIndicatorLiComponent from 'in-new-components/lists/List/HorizontalIndicatorLi';
export { default as ColumnizedContent } from 'in-new-components/lists/List/ColumnizedContent';
import LoadingSkeletonLiComponent from 'in-new-components/lists/List/LoadingSkeletonLi';
import LoadMoreLiComponent from 'in-new-components/lists/List/LoadMoreLi';
import ListGroupComponent from 'in-new-components/lists/List/ListGroup';
import { evaluateClassNames } from 'in-services/util/classnames';
import { emptyObject } from 'in-services/fixedObjects';
import useAutoFocus from 'in-hooks/useAutoFocus';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './List.mless';

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
      className={evaluateClassNames({
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
    highlightOpenState = true
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
      onDefaultInteraction: () => setOpen(!open),
      ariaLabel: 'Toggle extra content'
    });
  }

  const itemElement = (
    <div
      className={evaluateClassNames({
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
      onDefaultInteraction: onDefaultHrefInteractionSideEffect
    });
  }

  return (
    <Component
      className={evaluateClassNames({
        [locals.listItem]: true,
        [locals.noAlternatingBg]: noAlternatingBg,
        [locals.expanded]: open && highlightOpenState,
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
