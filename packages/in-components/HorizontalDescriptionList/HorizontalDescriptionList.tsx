/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { isBlank } from 'in-services/util/string';

import locals from './HorizontalDescriptionList.mless';

interface DiProps {
  title: ReactNode;
  children?: ReactNode;
  ddClassName?: string;
  rowClassName?: string;
  dtClassName?: string;
  verticalDisplay?: boolean;
}

interface DlProps {
  children: ReactNode;
}

export function Dl({ children }: DlProps) {
  return <dl className={locals.list}>{children}</dl>;
}

export function Di({ title, children, ddClassName, rowClassName, dtClassName, verticalDisplay }: DiProps) {
  if (children == null || (typeof children === 'string' && isBlank(children))) {
    return null;
  }

  return (
    <div className={classNames(locals.item, rowClassName, verticalDisplay ? locals.verticalDisplay : '')}>
      <dt className={classNames(locals.title, dtClassName)}>{title}</dt>
      <dd className={classNames(locals.description, ddClassName)}>{children}</dd>
    </div>
  );
}
