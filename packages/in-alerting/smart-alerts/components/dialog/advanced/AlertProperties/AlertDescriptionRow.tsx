/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertTypography from 'in-alerting/components/AlertTypography';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertDescriptionRow.mless';

interface AlertDescriptionRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
  isTearSheet?: boolean;
}

export default function AlertDescriptionRow({
  form,
  onChange,
  getDescriptionPlaceholder,
  isTearSheet
}: AlertDescriptionRowProps) {
  return (
    <>
      {isTearSheet ? (
        <div className={locals.alertDescriptionContainer}>
          <label>
            <AlertTypography
              variant={'body-regular'}
              color={'color900'}
              content={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesDescription')}
              noMargin
            />
          </label>
          <AlertPropertiesTextarea
            name="description"
            id="description"
            rows={getIsMutithresholdConfigured(form) ? 10 : 3}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              onChange(['description'], (field: Item) => {
                return (field as Field<string>).setValue(e.target.value || '').setTouched(true);
              });
            }}
            placeholder={getDescriptionPlaceholder(form)}
            formField={form.get('description')}
          />
        </div>
      ) : (
        <AlertSection
          titleHtmlFor="description"
          title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesDescription')}
          icon="lib_help_error_error_outline"
        >
          <AlertPropertiesTextarea
            name="description"
            id="description"
            rows={3}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              onChange(['description'], (field: Item) => {
                return (field as Field<string>).setValue(e.target.value || '').setTouched(true);
              });
            }}
            placeholder={getDescriptionPlaceholder(form)}
            formField={form.get('description')}
          />
        </AlertSection>
      )}
    </>
  );
}

function getIsMutithresholdConfigured(form: MapForm<any>) {
  const warningThresholdField = form.get('threshold')?.get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold')?.get('criticalThreshold') as MapForm<any>;
  const warningThresholdValue = warningThresholdField?.get('value').value;
  const criticalThresholdValue = criticalThresholdField?.get('value').value;
  const isWarningThresholdDefined = !isEmpty(warningThresholdValue);
  const isCriticalThresholdDefined = !isEmpty(criticalThresholdValue);
  if (isWarningThresholdDefined && isCriticalThresholdDefined) {
    return true;
  }

  return false;
}
