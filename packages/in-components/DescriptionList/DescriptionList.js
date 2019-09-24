/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import locals from './DescriptionList.mless';
import Tooltip from 'in-components/Tooltip';

export function DescriptionList({ children }) {
  return (
    <Fragment>
      <dl className={locals.descriptionList}>{children}</dl>
      <div className={locals.descriptionListNoDetails}>No details available.</div>
    </Fragment>
  );
}

export function DescriptionItem({ title, children, onClick, style, verticalDisplay }) {
  if (isItemEmpty(children)) {
    return null;
  }

  return (
    <div
      className={evaluateClassNames({
        [locals.descriptionListItem]: true,
        [locals.descriptionListItemVertical]: verticalDisplay
      })}
    >
      <dt className={locals.itemTitle} style={style}>
        {title}
      </dt>
      <Tooltip content={children} themeStyle="light">
        <dd className={locals.itemText} onClick={onClick} style={style}>
          {children}
        </dd>
      </Tooltip>
    </div>
  );
}

function isItemEmpty(children) {
  if (children === null || children === undefined) {
    return true;
  }

  // React avoids using an array of children when there is only one child
  // node. In these cases we are going to have a string
  if (typeof children === 'string') {
    return children.length === 0;
  }

  // For any other cases we are currently not able to tell whether it is
  // empty, e.g. for child components.
  return false;
}
