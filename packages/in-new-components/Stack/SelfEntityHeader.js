/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SelfEntityHeader.mless';

export default function SelfEntityHeader({ selfEntity }) {
  if (!selfEntity) {
    return null;
  }

  const { label, icon, size, href$ } = selfEntity;
  return (
    <Link href$={href$}>
      <div className={locals.entity}>
        <SvgIcon className={locals.icon} type={icon} size={size} />
        <span className={locals.label}>{label}</span>
      </div>
    </Link>
  );
}
