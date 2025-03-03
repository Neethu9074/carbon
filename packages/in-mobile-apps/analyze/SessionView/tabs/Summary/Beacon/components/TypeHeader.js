/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Pill } from '@instana/components';

import { getType, types } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import Tooltip from 'in-components/Tooltip';

import locals from './TypeHeader.mless';

export default function TypeHeader({ beacon }) {
  const type = getType(beacon);
  const typeDefinition = types[type] ?? types.default;

  return (
    <Tooltip content={typeDefinition.long} align="rightMiddle">
      <Pill type={typeDefinition.colorType} className={locals.type}>
        {typeDefinition.badgeLabel}
      </Pill>
    </Tooltip>
  );
}
