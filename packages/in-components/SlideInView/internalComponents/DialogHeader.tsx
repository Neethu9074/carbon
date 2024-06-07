/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { IconButton } from '@instana/components';

import locals from './DialogHeader.mless';

interface DialogHeaderProps {
  scrollShadow?: boolean;
  title: React.ReactNode;
  onTitleIconClick?: React.MouseEventHandler<HTMLElement>;
}

export default function DialogHeader({ title, onTitleIconClick, scrollShadow }: DialogHeaderProps) {
  return (
    <div
      className={classNames({
        [locals.header]: true,
        [locals.scrollShadow]: scrollShadow
      })}
    >
      <span className={locals.titleContainer}>
        <IconButton iconSize="l" type="lib_arrow_left" onClick={onTitleIconClick} alignment="left" />
        <h1 className={locals.title}>{title}</h1>
      </span>
    </div>
  );
}
