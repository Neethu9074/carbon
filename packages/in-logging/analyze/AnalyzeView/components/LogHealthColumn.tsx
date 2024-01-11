/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, Pill } from '@instana/components';

import { logPillColorMap } from 'in-logging/analyze/AnalyzeView/utils/constants';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { LOG_LEVEL } from 'in-logging/queryBuilder';
import { LogTag, TagFilter } from 'in-types';

import locals from './LogHealthColumn.mless';

interface Props {
  tags: LogTag[];
  onSelectTagHref?: (tag: TagFilter) => string;
}

export default function LogHealthColumn({ tags, onSelectTagHref }: Props) {
  const logLevel = getLogLevel(tags);
  if (!logLevel) {
    return null;
  }

  const color = logPillColorMap.get(logLevel.toLowerCase());

  return (
    <Link href={onSelectTagHref ? onSelectTagHref(tagFilter(LOG_LEVEL, EQUALS, logLevel)) : undefined}>
      <Pill className={locals.pill} color={color}>
        {logLevel}
      </Pill>
    </Link>
  );
}
