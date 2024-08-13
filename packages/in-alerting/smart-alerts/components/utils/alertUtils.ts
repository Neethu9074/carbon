/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
import { ThresholdOperator, TagFilterOperator } from 'in-types';
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

export function getButtonName(label: string) {
  const multipleActionAvailable = isDialogAndTearSheetEnabled();
  const labelNew = t('in-alerting:smartAlerts.applications.inventory.labelNew');
  if (multipleActionAvailable) {
    return `${label} ${labelNew}`;
  }
  return label;
}
