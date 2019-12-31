import React, { Fragment, useState } from 'react';

import HorizontalIndicatorLiComponent from 'in-new-components/lists/List/HorizontalIndicatorLi';
import LoadingSkeletonLiComponent from 'in-new-components/lists/List/LoadingSkeletonLi';
import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import LoadMoreLiComponent from 'in-new-components/lists/List/LoadMoreLi';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
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
        [locals.framed]: framed,
        [className]: className
      })}
    >
      {children}
    </ul>
  );
}

export const Li = connectTo(
  ({ href, href$ }) => {
    if (href) {
      return {};
    }

    return {
      href: href$
    };
  },
  function Li(props) {
    const { renderActions, children, onClick, size, renderNestedContent, href, style } = props;

    const [open, setOpen] = useState(false);

    const ItemContent = () => (
      <Fragment>
        <div
          className={evaluateClassNames({
            [locals.itemContent]: true,
            [locals.itemContentWithNestedContent]: renderNestedContent,
            [locals.itemContentExpanded]: open,
            [locals[size]]: size
          })}
        >
          {children}
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
        </div>
        {renderNestedContent && open && <div className={locals.nestedContent}>{renderNestedContent()}</div>}
      </Fragment>
    );

    return (
      <li
        style={style ? style : null}
        className={evaluateClassNames({
          [locals.listItem]: true,
          [locals.clickable]: onClick || href,
          [locals.expanded]: open
        })}
        onClick={onClick}
        onKeyUp={getKeyboardActivatedOnClickHandler(onClick)}
        tabIndex="0"
      >
        {href ? (
          <Link className={locals.link} href={href}>
            <ItemContent />
          </Link>
        ) : (
          <ItemContent />
        )}
      </li>
    );
  }
);
