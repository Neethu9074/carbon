/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { BluePrint } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import { t } from 'in-i18n';

export const blueprintConfig: readonly BluePrint[] = Object.freeze([
  {
    type: 'Action Associations',
    name: t('in-events:actionAssociations'),
    headline: t('in-events:actionAssociations'),
    description: [
      {
        headline: t('in-events:whatAreActions'),
        htmlContent: t('in-events:whatAreActionsText')
      },
      {
        headline: t('in-events:whatAreActionAssociations'),
        htmlContent: t('in-events:whatAreActionAssociationsText')
      }
    ]
  }
]);
