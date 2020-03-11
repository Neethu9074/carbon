import React, { Fragment, useState } from 'react';

import HorizontalIndicatorLiComponent from 'in-new-components/lists/List/HorizontalIndicatorLi';
import LoadingSkeletonLiComponent from 'in-new-components/lists/List/LoadingSkeletonLi';
import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import LoadMoreLiComponent from 'in-new-components/lists/List/LoadMoreLi';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './List.mless';

export const LoadMoreLi = LoadMoreLiComponent;
export const HorizontalIndicatorLi = HorizontalIndicatorLiComponent;
export const LoadingSkeletonLi = LoadingSkeletonLiComponent;

export function Ul({ framed = true, className, children }) {
  return (
    <ul
      className={evaluateClassNames({
        [locals.list]: true,
        [locals.framed]: framed === true,
        [locals.framedTopBottom]: framed === 'topBottom',
        [className]: className
      })}
    >
      {children}
    </ul>
  );
}

export function Li(props) {
  const {
    className,
    renderActions,
    children,
    onClick,
    size,
    renderNestedContent,
    href,
    href$,
    style,
    noAlternatingBg
  } = props;

  const [open, setOpen] = useState(false);

  let itemElement = (
    <Fragment>
      <div
        className={evaluateClassNames({
          [locals.itemContent]: true,
          [locals.itemContentWithNestedContent]: renderNestedContent,
          [locals.itemContentExpanded]: open,
          [locals[size]]: size,
          [className]: className
        })}
        style={style}
      >
        {children}

        {(renderActions || renderNestedContent) && (
          <div className={locals.actions}>
            {renderActions && renderActions()}
            {renderNestedContent && (
              <SvgIcon
                className={locals.expandIcon}
                type={open ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                aria-label="Expand button for row"
                tabIndex={0}
                onClick={() => setOpen(!open)}
              />
            )}
          </div>
        )}
      </div>
      {renderNestedContent && open && <div className={locals.nestedContent}>{renderNestedContent()}</div>}
    </Fragment>
  );

  return (
    <li
      className={evaluateClassNames({
        [locals.listItem]: true,
        [locals.noAlternatingBg]: noAlternatingBg,
        [locals.clickable]: onClick || href || href$,
        [locals.expanded]: open
      })}
      onClick={onClick}
      onKeyUp={onClick && getKeyboardActivatedOnClickHandler(onClick)}
      tabIndex={onClick && 0}
    >
      {href || href$ ? (
        <Link className={locals.link} href={href} href$={href$}>
          {itemElement}
        </Link>
      ) : (
        itemElement
      )}
    </li>
  );
}
