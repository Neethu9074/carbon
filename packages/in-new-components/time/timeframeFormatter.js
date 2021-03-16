/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { formatDurationAccurately, formatTime, formatDateShort } from 'in-services/formatters/date';
import { isOnSameDay } from 'in-services/util/date';
import { t } from 'in-i18n';

export function timeDisplayTopFormat(timeConfig) {
  const currentTime = Date.now();
  if (timeConfig.autoRefresh == true) {
    const fromTime = currentTime - timeConfig.windowSize;
    if (isOnSameDay(fromTime, currentTime)) {
      return `${formatDateShort(fromTime)}`;
    } else {
      return t('in-new-components:time.timeFrameFormatterStarting', { fromTime: formatDateShort(fromTime) });
    }
  }

  if (timeConfig.to == null) {
    const fromTime = currentTime - timeConfig.windowSize;
    if (isOnSameDay(fromTime, currentTime)) {
      return `${formatDateShort(fromTime)}`;
    } else {
      return formatDurationAccurately(timeConfig.windowSize, 60000, true);
    }
  }

  const fromTime = timeConfig.to - timeConfig.windowSize;
  const toTime = timeConfig.to;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatDurationAccurately(timeConfig.windowSize)} - ${formatDateShort(fromTime)}`;
  } else {
    return formatDurationAccurately(timeConfig.windowSize, 60000, true);
  }
}

export function timeDisplayBottomFormat(timeConfig) {
  const currentTime = Date.now();

  if (timeConfig.autoRefresh == true) {
    const result = `Last ${formatDurationAccurately(timeConfig.windowSize, 60000, false)}`;
    const match = result.match(/^Last 1 ([a-z]+)$/i);
    if (match && match[1] === 'day') {
      return t('in-new-components:time.timeFrameFormatterLast24Hours');
    } else if (match) {
      return t('in-new-components:time.timeFrameFormatterLast', { duration: match[1] });
    } else {
      return t('in-new-components:time.timeFrameFormatterLast', {
        duration: formatDurationAccurately(timeConfig.windowSize, 60000, false)
      });
    }
  }

  if (timeConfig.to == null) {
    const fromTime = currentTime - timeConfig.windowSize;
    const result = `Last ${formatDurationAccurately(timeConfig.windowSize, 60000, false)}`;
    const match = result.match(/^Last 1 ([a-z]+)$/i);
    if (isOnSameDay(fromTime, currentTime)) {
      if (match) {
        return t('in-new-components:time.timeFrameFormatterLast', { duration: match[1] });
      }
      return result;
    } else {
      if (match && match[1] === 'day') {
        return t('in-new-components:time.timeFrameFormatterLast24Hours');
      }
      return `${formatDateShort(fromTime)} - ${formatDateShort(currentTime)}`;
    }
  }

  const fromTime = timeConfig.to - timeConfig.windowSize;
  const toTime = timeConfig.to;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatTime(fromTime)} - ${formatTime(toTime)}`;
  } else {
    return `${formatDateShort(fromTime)} - ${formatDateShort(toTime)}`;
  }
}

export function formatExact(timeConfig) {
  const toTime = timeConfig.to || Date.now();
  const fromTime = timeConfig.to - timeConfig.windowSize;
  if (isOnSameDay(fromTime, toTime)) {
    return `${formatDateShort(fromTime)} ${formatTime(fromTime)} - ${formatTime(toTime)} (${formatDurationAccurately(
      timeConfig.windowSize
    )})`;
  } else {
    return `${formatDateShort(fromTime)} ${formatTime(fromTime)} - ${formatDateShort(toTime)} ${formatTime(
      toTime
    )} (${formatDurationAccurately(timeConfig.windowSize)})`;
  }
}
