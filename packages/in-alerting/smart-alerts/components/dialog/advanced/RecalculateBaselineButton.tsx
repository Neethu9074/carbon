/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React, { useRef } from 'react';

import { Button } from '@instana/components';

import { carbonButtonEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton.mless';

interface RecalculateBaselineButtonProps {
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  form: MapForm<any>;
}
export default function RecalculateBaselineButton({ updateForm, editMode, form }: RecalculateBaselineButtonProps) {
  const isRecalculated = useRef(false);

  if (!editMode) {
    return null;
  }

  return (
    <div className={locals.buttonWrapper}>
      <Button
        size={carbonButtonEnabled ? 'compact' : 'normal'}
        kind={carbonButtonEnabled ? 'tertiary' : 'secondaryDarker'}
        onClick={() => {
          isRecalculated.current = true;
          updateForm(
            form
              .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], field =>
                (field as Field<boolean>).setValue(true)
              )
              .updateIn(['threshold', 'baseline'], field => {
                return (field as Field<any>).setValue(null).setTouched(false);
              })
          );
        }}
        disabled={isRecalculated.current || !form?.get('threshold').get('baseline')?.touched}
      >
        {t('in-alerting:smartAlerts.components.smartAlertDialog.buttonRecalculateBaseline')}
      </Button>
    </div>
  );
}
