/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Pill } from '@instana/components';

import { getType, types } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import Tooltip from 'in-components/Tooltip';

import locals from './TypeHeader.mless';

export default function TypeHeader({ beacon }) {
  const type = getType(beacon);
  const typeDefinition = types[type];

  return (
    <Tooltip content={typeDefinition.long} align="rightMiddle">
      <Pill type={typeDefinition.pillType} className={locals.type}>
        {typeDefinition.badgeLabel}
      </Pill>
    </Tooltip>
  );
}
