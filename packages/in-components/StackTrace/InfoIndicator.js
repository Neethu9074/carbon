/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { IconButton, Button } from '@instana/components';

import { carbonButtonEnabled } from 'in-services/featureFlags';
import Tooltip from 'in-components/Tooltip';

import locals from './InfoIndicator.mless';

export default function InfoIndicator({ href, href$, children, target = 'blank' }) {
  return (
    <Tooltip content={<div className={locals.content}>{children}</div>}>
      {href || href$ ? (
        <Button
          kind="action"
          icon="lib_infra_unknownIcon"
          href={href$ ?? href}
          target={target}
          {...(carbonButtonEnabled ? { hasIconOnly: true } : {})}
        >
          {''}
        </Button>
      ) : (
        <IconButton type="lib_infra_unknownIcon" />
      )}
    </Tooltip>
  );
}
