/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { LOG_LEVEL } from 'in-logging/queryBuilder';
import { LogTag, TagFilter } from 'in-types';
import Pill from 'in-components/Pill';
import theme from 'in-themes';

// @ts-ignore
import locals from './LogHealthColumn.mless';

interface Props {
  tags: LogTag[];
  onSelectTagHref?: (tag: TagFilter) => string;
}

const colorMappings = new Map<string, string>([
  ['error', theme.lib.colors.red800],
  ['warn', theme.lib.colors.yellow800],
  ['info', theme.lib.colors.lightBlue800]
]);

export default function LogHealthColumn({ tags, onSelectTagHref }: Props) {
  const logLevel = getLogLevel(tags);
  if (!logLevel) {
    return null;
  }

  const color = colorMappings.get(logLevel.toLowerCase());

  return (
    <Link
      href={
        onSelectTagHref
          ? onSelectTagHref({
              name: LOG_LEVEL,
              value: logLevel,
              type: 'STRING',
              operator: EQUALS,
              entity: 'NOT_APPLICABLE'
            })
          : undefined
      }
    >
      <Pill className={locals.pill} color={color}>
        {logLevel}
      </Pill>
    </Link>
  );
}
