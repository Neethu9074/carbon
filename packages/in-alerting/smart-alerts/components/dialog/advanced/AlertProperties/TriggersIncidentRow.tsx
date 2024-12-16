/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Item, MapForm, Field } from 'formalistic';
import PropTypes from 'prop-types';
import React from 'react';

import { Toggle } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/TriggersIncidentRow.mless';
import toogleLocals from 'in-alerting/smart-alerts/components/dialog/advanced/Toogle.mless';

interface TriggersIncidentRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  isTearSheet?: boolean;
}
export default function TriggersIncidentRow({ form, onChange, isTearSheet }: TriggersIncidentRowProps) {
  if (form.get('triggering')) {
    return (
      <>
        {isTearSheet ? (
          <div className={locals.triggerIncidentContainer}>
            <label>
              <AlertTypography
                variant={'body-regular'}
                color={'color900'}
                content={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTriggersIncident')}
                noMargin
              />
            </label>
            <Toggle
              className={toogleLocals.toggleDialogUsage}
              checked={Boolean(form.get('triggering')?.value)}
              onToggle={e => {
                onChange(['triggering'], field => (field as Field<boolean>).setValue(e || false).setTouched(true));
              }}
            />
          </div>
        ) : (
          <AlertSection
            title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTriggersIncident')}
            icon="lib_events_incident"
          >
            <Toggle
              className={toogleLocals.toggleDialogUsage}
              checked={Boolean(form.get('triggering')?.value)}
              onToggle={e => {
                onChange(['triggering'], field => (field as Field<boolean>).setValue(e || false).setTouched(true));
              }}
            />
          </AlertSection>
        )}
      </>
    );
  }
  return null;
}

TriggersIncidentRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
