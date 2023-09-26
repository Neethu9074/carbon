/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import { formatDateTime, formatDateShort, formatTimeWithoutSeconds } from 'in-services/formatters/date';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

import locals from './SloTile.mless';

type Timestamp = number | Date;
interface SloTimeTileProps {
  title?: string;
  timeFrameLabel: string;
  fromTimestamp?: Timestamp;
  objectiveDuration: number;
  objectiveDurationUnit: string;
  compact?: boolean;
}

export default function SloTimeTile({
  compact,
  title,
  fromTimestamp,
  objectiveDuration,
  objectiveDurationUnit,
  timeFrameLabel
}: SloTimeTileProps) {
  if (compact) {
    return (
      <div className={locals.oneRow}>
        <div className={locals.titleValue}>
          <span>{timeFrameLabel}:</span>
          <span className={locals.value}>
            <CompactFromToDates from={fromTimestamp} />
          </span>
        </div>
      </div>
    );
  }

  const durationUnitTranslationKey = objectiveDurationUnit === 'day' ? 'day' : 'week';

  return (
    <div className={locals.tile}>
      <div className={locals.title}>{title}</div>

      <div className={locals.value}>
        <div className={locals.timeRangeValue}>
          <Stack gap="disabled">
            <Typography variant="body-regular">
              {t('in-service-levels:general.from')}: <DateTime timeStamp={fromTimestamp} />
            </Typography>
            <Typography variant="body-regular">
              {`${t('in-service-levels:general.duration')}: ${t('in-service-levels:general.timeWindow.size', {
                context: durationUnitTranslationKey,
                count: objectiveDuration
              })}`}
            </Typography>
          </Stack>
        </div>
      </div>

      <div className={locals.targetInfo}>{timeFrameLabel}</div>
    </div>
  );
}

interface DateTimeProps {
  timeStamp?: Timestamp;
}
function DateTime({ timeStamp }: DateTimeProps) {
  if (!timeStamp) return null;

  return <time dateTime={new Date(timeStamp).toISOString()}>{formatDateTime(timeStamp)}</time>;
}

type CompactTimeInterval = { fromStr: string; toStr: string };
export function compactTimeInterval(from: Timestamp, to: Timestamp): CompactTimeInterval {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();
  const fromStr = fmt(from, fromYear);
  const toStr = fmt(to, toYear);
  return { fromStr, toStr };
}

interface CompactFromToDatesProps {
  from?: Timestamp;
  to?: Timestamp;
}
function CompactFromToDates({ from, to }: CompactFromToDatesProps) {
  if (!from && !to) {
    return <>{valueMissingPlaceholder}</>;
  }
  if (from && to) {
    const { fromStr, toStr } = compactTimeInterval(from, to);
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return (
      <>
        <time dateTime={fromDate.toISOString()}>{fromStr}</time>
        {' – '}
        <time dateTime={toDate.toISOString()}>{toStr}</time>
      </>
    );
  }
  return (
    <>
      {from && <time dateTime={new Date(from).toISOString()}>{formatDateTime(from)}</time>}
      {' – '}
      {to && <time dateTime={new Date(to).toISOString()}>{formatDateTime(to)}</time>}
    </>
  );
}

function fmt(timestamp: Timestamp, appendYear: number): string {
  return `${formatDateShort(timestamp)}${', ' + appendYear} ${formatTimeWithoutSeconds(timestamp)}`;
}
