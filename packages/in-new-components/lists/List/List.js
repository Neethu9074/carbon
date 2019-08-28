import React, { Fragment, useState } from 'react';

import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

export function Ul(props) {
  return (
    <ul style={props.style ? props.style : null} className={locals.list}>
      {props.children}
    </ul>
  );
}

export function Li(props) {
  const { renderActions, children, onClick, size, renderNestedContent } = props;

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <li
        style={props.style ? props.style : null}
        className={evaluateClassNames({
          [locals.listItem]: true,
          [locals.clickable]: onClick
        })}
        onClick={onClick}
        onKeyUp={getKeyboardActivatedOnClickHandler(onClick)}
        tabIndex="0"
      >
        <div
          className={evaluateClassNames({
            [locals.itemContent]: true,
            [locals.itemContentWithNestedContent]: renderNestedContent,
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
      </li>
    </Fragment>
  );
}
