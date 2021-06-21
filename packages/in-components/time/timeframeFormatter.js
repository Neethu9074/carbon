/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { formatDurationAccurately, formatTime, formatDateShort } from 'in-services/formatters/date';
import { days, hours, minutes } from 'in-services/time';
import { isOnSameDay } from 'in-services/util/date';
import { t } from 'in-i18n';

export function timeDisplayTopFormat(timeConfig) {
  const currentTime = Date.now();
  if (timeConfig.autoRefresh == true) {
    const fromTime = currentTime - timeConfig.windowSize;
    if (isOnSameDay(fromTime, currentTime)) {
      return `${formatDateShort(fromTime)}`;
    } else {
      return t('in-components:time.timeFrameFormatterStarting', { fromTime: formatDateShort(fromTime) });
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
  const fromTime = (timeConfig.to ?? currentTime) - timeConfig.windowSize;
  const oneDay = days.toMillis(1);
  const oneHour = hours.toMillis(1);
  const oneMinute = minutes.toMillis(1);
  const numHours = Math.floor(timeConfig.windowSize / oneHour);
  const numMinutes = Math.floor((timeConfig.windowSize - numHours * oneHour) / oneMinute);

  if (timeConfig.autoRefresh || timeConfig.to == null) {
    if (!isOnSameDay(fromTime, currentTime)) {
      //special case for 24 hours
      return timeConfig.windowSize === oneDay
        ? t('in-components:time.timeFrameFormatterHours', { count: numHours })
        : `${formatDateShort(fromTime)} - ${formatDateShort(currentTime)}`;
    }

    if (numHours && numMinutes) {
      return t('in-components:time.timeFrameFormatterHoursMinutes', { hours: numHours, minutes: numMinutes });
    }
    if (numMinutes) {
      return t('in-components:time.timeFrameFormatterMinutes', { count: numMinutes });
    }
    return t('in-components:time.timeFrameFormatterHours', { count: numHours });
  }

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
