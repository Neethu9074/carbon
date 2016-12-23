
/* eslint-disable react/no-multi-comp */
import React from 'react';

import {evaluateClassNames, joinClassNames} from 'in-services/util/classnames';

import './DescriptionList.less';

const block = 'in-detail-pane';
const listClassName = `${block}__description-list`;
const itemClassName = `${block}__description-item`;


export function DescriptionList({children, className}) {
  return (
    <dl className={joinClassNames(listClassName, className)}>
      {children}
    </dl>
  );
}


export function DescriptionItem({title, children, onClick, className, addSeparator}) {
  if (isItemEmpty(children)) {
    return null;
  }

  return (
    <div className={evaluateClassNames({
           [itemClassName]: true,
           [`${itemClassName}--with-separator`]: addSeparator,
           [className]: className
         })}>
      <dt className={block + '__description-title'}>
        {title}
      </dt>
      <dd className={`${block}__description-text`}
          onClick={onClick}>
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
