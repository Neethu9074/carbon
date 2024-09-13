/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './InfoIndicator.mless';

export default function InfoIndicator({ href, href$, children, target, external }) {
  return (
    <Tooltip content={<div className={locals.content}>{children}</div>}>
      {href || href$ ? (
        <Link href={href$ ?? href} target={target} external={external} className={locals.indicator}>
          ?
        </Link>
      ) : (
        <div className={locals.icon}>
          <SvgIcon type="lib_infra_unknownIcon" size="s" />
        </div>
      )}
    </Tooltip>
  );
}
