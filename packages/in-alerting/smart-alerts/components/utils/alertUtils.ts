/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
import { ThresholdOperator, TagFilterOperator, Granularity, Nullish } from 'in-types';
import { defaultGracePeriod } from 'in-alerting/smart-alerts/components/GracePeriod';
import { t } from 'in-i18n';

export function toTagFilterNumberOperator(thresholdOperator: ThresholdOperator): TagFilterOperator {
  switch (thresholdOperator) {
    case '<=':
      return 'LESS_OR_EQUAL_THAN';
    case '<':
      return 'LESS_THAN';
    case '>=':
      return 'GREATER_OR_EQUAL_THAN';
    case '>':
      return 'GREATER_THAN';
    default:
      return thresholdOperator;
  }
}

export function isGreaterOperator(thresholdOperator: ThresholdOperator): boolean {
  return thresholdOperator === '>=' || thresholdOperator === '>';
}

export function isGreaterOperatorOrUndefined(operator: ThresholdOperator | undefined): boolean {
  return operator === undefined || isGreaterOperator(operator);
}

export function isDialogAndTearSheetEnabled() {
  if (applicationSmartAlertFullScreenDesignEnabled && applicationSmartAlertDialogView) {
    return true;
  }
  return false;
}
// TODO : Remove this function once all the SA dialog/tearsheet FF checking implementation are Done.
export function getButtonName(label: string) {
  const multipleActionAvailable = isDialogAndTearSheetEnabled();
  const labelNew = t('in-alerting:smartAlerts.applications.inventory.labelNew');
  if (multipleActionAvailable) {
    return `${label} ${labelNew}`;
  }
  return label;
}

export function getGracePeriod(gracePeriod: number | Nullish, granularity: Granularity | undefined) {
  if (!gracePeriod || !granularity) {
    return defaultGracePeriod;
  }
  return gracePeriod - granularity;
}

export function calculateEffectiveGracePeriodForBackend(
  gracePeriod: number,
  granularity: Granularity
): number | undefined {
  if (!gracePeriod) {
    return undefined;
  }
  return gracePeriod + granularity;
}
