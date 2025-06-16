/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CreateSmartAlertButtonForCarbonTable } from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { t } from 'in-i18n';

export default function CreateGlobalSmartAlertButton({ renderAsSimpleButton }) {
  const location = useLocation();
  return (
    <CreateSmartAlertButtonForCarbonTable
      isGlobal
      isFloatingButton
      renderAsSimpleButton={renderAsSimpleButton}
      buttonName={t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert')}
      location={location}
    />
  );
}

export function generateAlertConfig() {
  return {
    rules: [
      {
        rule: defaultAlertRule,
        thresholdOperator: '>=',
        thresholds: {
          WARNING: {
            type: STATIC_THRESHOLD,
            isCheckboxSelected: false
          },
          CRITICAL: {
            type: STATIC_THRESHOLD,
            isCheckboxSelected: false
          }
        }
      }
    ]
  };
}
