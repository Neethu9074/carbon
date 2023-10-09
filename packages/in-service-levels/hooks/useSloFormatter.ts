/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { CustomBlueprintType } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { ServiceLevelIndicatorType, SloEntityType } from 'in-types';
import { minutes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export type SloFormatterFunction = (value: number) => string;

interface useSloFormatterProps {
  blueprintType?: CustomBlueprintType;
  indicatorType?: ServiceLevelIndicatorType;
  sloEntityType?: SloEntityType;
}

export default function useSloFormatter({
  blueprintType,
  indicatorType,
  sloEntityType
}: useSloFormatterProps): SloFormatterFunction {
  if (blueprintType === 'availability' || (sloEntityType === 'website' && indicatorType === 'eventBased')) {
    return callsFormatter;
  }

  return minutes.fixedCompact;
}

function callsFormatter(value: number): string {
  if (value >= 10000) {
    return t('in-service-levels:sloChart.sloFormatter.thousandCallsFormat', {
      count: number.detailed(value / 1000)
    });
  }

  return `${number.compact(value)} ${t('in-service-levels:sloChart.sloFormatter.unit', { count: value })}`;
}
