/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, Pill } from '@instana/components';

import { useLoggingAnalyzeContext } from 'in-logging/analyze/AnalyzeView/LoggingAnalyzeContext';
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
  const {
    state: { extraChartLogLevel }
  } = useLoggingAnalyzeContext();

  const logLevel = getLogLevel(tags);
  if (!logLevel) {
    return null;
  }

  const isExtraLogLevel = logLevel === extraChartLogLevel?.toUpperCase();
  const standardLogLevelColor = logPillColorMap[logLevel.toLowerCase()] ?? 'cool-gray';
  const extraLogLevelColor = 'teal';

  const color = isExtraLogLevel ? extraLogLevelColor : standardLogLevelColor;

  return (
    <Link href={onSelectTagHref && onSelectTagHref(tagFilter(LOG_LEVEL, EQUALS, logLevel))}>
      {
        <Pill className={locals.pill} type={color} lightenOpacity={0}>
          {logLevel}
        </Pill>
      }
    </Link>
  );
}
