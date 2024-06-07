/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ThresholdOperator } from '@instana/types';

import { convertToPercent } from 'in-custom-dashboards/widgets/_shared/formatters';
import { defaultFormatter } from 'in-stores/metric/formatters';

export interface ThresholdProps {
  critical: string;
  warning: string;
  operator: ThresholdOperator;
  thresholdEnabled?: boolean;
}

export type Threshold = 'normal' | 'warning' | 'critical';
export type ThresholdFn = (value?: number) => Threshold;

export function getThreshold(thresholdProps?: ThresholdProps, formatter: string = defaultFormatter.id): ThresholdFn {
  return value => {
    if (!thresholdProps || !value || !thresholdProps?.thresholdEnabled) {
      return 'normal';
    }

    const { operator, critical, warning } = thresholdProps;

    const currentValue = formatter.startsWith('percentage') ? convertToPercent(100) : value;
    const criticalValue = parseFloat(critical);
    const warningValue = parseFloat(warning);

    const hasCriticalValue = critical !== '';
    const hasWarningValue = warning !== '';

    switch (operator) {
      case '>=':
        if (hasCriticalValue && currentValue >= criticalValue) return 'critical';
        if (hasWarningValue && currentValue >= warningValue) return 'warning';
        break;
      case '>':
        if (hasCriticalValue && currentValue > criticalValue) return 'critical';
        if (hasWarningValue && currentValue > warningValue) return 'warning';
        break;
      case '<=':
        if (hasCriticalValue && currentValue <= criticalValue) return 'critical';
        if (hasWarningValue && currentValue <= warningValue) return 'warning';
        break;
      case '<':
        if (hasCriticalValue && currentValue < criticalValue) return 'critical';
        if (hasWarningValue && currentValue < warningValue) return 'warning';
        break;
    }

    return 'normal';
  };
}
