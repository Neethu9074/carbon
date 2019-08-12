import React from 'react';

import { getKeyboardActivatedOnClickHandler } from 'in-services/util/accessibility';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './List.mless';

export function Ul(props) {
  return (
    <ul style={props.style ? props.style : null} className={locals.list}>
      {props.children}
    </ul>
  );
}

export function Li(props) {
  const { renderActions, children, onClick } = props;
  return (
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
      {children}
      {renderActions && <div className={locals.actions}>{renderActions}</div>}
    </li>
  );
}
