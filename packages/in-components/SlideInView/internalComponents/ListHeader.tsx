/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EventPlaceholder } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

// @ts-expect-error
import locals from './ListHeader.mless';

interface ListHeaderProps {
  title: React.ReactNode;
  onTitleIconClick?: (e: EventPlaceholder) => void;
}

export default function ListHeader({ title, onTitleIconClick }: ListHeaderProps) {
  return (
    <div className={locals.header}>
      <span className={locals.titleContainer}>
        <SvgIcon className={locals.icon} type="lib_arrow_expand_left" onClick={onTitleIconClick} />
        <span className={locals.title}>{title}</span>
      </span>
    </div>
  );
}
