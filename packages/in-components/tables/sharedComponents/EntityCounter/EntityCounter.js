/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { number } from 'in-services/formatters/number';

import locals from './EntityCounter.mless';

export default function EntityCounter({ icon, count }) {
  return (
    <div className={locals.flexWrapper}>
      {icon && <SvgIcon className={locals.entityIcon} type={icon} />}
      {count >= 0 && <span>{number.compact(count)}</span>}
    </div>
  );
}
