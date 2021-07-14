/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link, SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './ExistingValue.mless';

/**
 * A label and a remove icon, wrapped in a tooltip displaying the non-ellipsed label.
 * The value passed in is parsed to a String.
 * This is done since the value may also be a boolean or a number.
 */
export default function ExistingValue({ value, removeLink }) {
  return (
    <Tooltip content={String(value)} align="rightMiddle" delay={1000}>
      <div className={locals.suggestion}>
        <span className={locals.label}>{String(value)}</span>
        <Link href={removeLink}>
          <SvgIcon className={locals.icon} type="lib_openclose_cancel" size="s" />
        </Link>
      </div>
    </Tooltip>
  );
}
