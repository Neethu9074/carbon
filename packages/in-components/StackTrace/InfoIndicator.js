/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { IconButton } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './InfoIndicator.mless';

export default function InfoIndicator({ href, href$, children, target = 'blank' }) {
  return (
    <Tooltip content={<div className={locals.content}>{children}</div>}>
      <IconButton type="lib_infra_unknownIcon" href={href$ ?? href} target={target} />
    </Tooltip>
  );
}
