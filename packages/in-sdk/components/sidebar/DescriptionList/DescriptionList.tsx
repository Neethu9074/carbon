/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';

import locals from './DescriptionList.mless';

export function DescriptionList({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <>
      <dl className={classNames(locals.descriptionList, className)}>{children}</dl>
      <div className={locals.descriptionListNoDetails}>No details available.</div>
    </>
  );
}

export function DescriptionItem({
  title,
  children,
  onClick
}: PropsWithChildren<{ title: string; onClick?: () => void }>) {
  if (isItemEmpty(children)) {
    return null;
  }

  return (
    <div className={locals.descriptionListItem}>
      <dt className={locals.itemTitle}>{title}</dt>
      <dd className={locals.itemText} onClick={onClick}>
        {children}
      </dd>
    </div>
  );
}

function isItemEmpty(children?: ReactNode): boolean {
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
