/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from './HeaderToggleIcon.mless';

export default function HeaderToggleIcon({ expanded }) {
  return <SvgIcon className={locals.icon} type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="s" />;
}
