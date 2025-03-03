/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { SloEntityType, ServiceLevelIndicatorType } from '@instana/types';

import { minutes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export type SloFormatterFunction = (value: number) => string;

interface useSloFormatterProps {
  indicatorType?: ServiceLevelIndicatorType;
  sloEntityType?: SloEntityType;
}

export default function useSloFormatter({ indicatorType, sloEntityType }: useSloFormatterProps): SloFormatterFunction {
  if (!sloEntityType) return _value => '';

  if (indicatorType === 'eventBased') {
    return getEventBasedFormatter(sloEntityType);
  }

  return minutes.fixedCompact;
}

function getEventBasedFormatter(sloEntityType: SloEntityType): (value: number) => string {
  return value => {
    if (value >= 10000) {
      const thousandthVal = value / 1000;
      const detailedValue = number.detailed(thousandthVal);
      return t('in-service-levels:sloChart.sloFormatter.thousandCallsFormat', {
        entityType: sloEntityType,
        formattedCount: detailedValue,
        count: thousandthVal
      });
    }

    return t('in-service-levels:sloChart.sloFormatter.callsFormat', {
      entityType: sloEntityType,
      formattedCount: number.compact(value),
      count: value
    });
  };
}
