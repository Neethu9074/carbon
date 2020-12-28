/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import classNames from 'classnames';

import './DescriptionList.less';

const block = 'in-detail-pane';
const listClassName = `${block}__description-list`;
const itemClassName = `${block}__description-item`;
const noDetailClassName = `${block}__description-no-details`;

export function DescriptionList({ children, className }) {
  return (
    <Fragment>
      <dl className={classNames(listClassName, className)}>{children}</dl>
      <div className={noDetailClassName}>No details available.</div>
    </Fragment>
  );
}

export function DescriptionItem({ title, children, onClick, className, addSeparator }) {
  // return null;
  if (isItemEmpty(children)) {
    return null;
  }

  return (
    <div
      className={classNames({
        [itemClassName]: true,
        [`${itemClassName}--with-separator`]: addSeparator,
        [className]: className
      })}
    >
      <dt className={block + '__description-title'}>{title}</dt>
      <dd className={`${block}__description-text`} onClick={onClick}>
        {children}
      </dd>
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
