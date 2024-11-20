/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useRef } from 'react';

import { IconButton } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton.mless';

interface RecalculateMultiThresholdBaselineButtonProps {
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  form: MapForm<any>;
}
export default function RecalculateBaselineButton({
  updateForm,
  editMode,
  form
}: RecalculateMultiThresholdBaselineButtonProps) {
  const isRecalculated = useRef(false);

  if (!editMode) {
    return null;
  }

  const isDisabled = isRecalculated.current || !form?.get('threshold').get('warningThreshold').get('baseline')?.touched;
  const toolTipText =
    (!isDisabled && t('in-alerting:smartAlerts.components.smartAlertDialog.buttonRecalculateBaseline')) ||
    t('in-alerting:smartAlerts.components.smartAlertDialog.buttonRecalculateBaselineDisabled');

  return (
    <Tooltip align="topRight" content={toolTipText}>
      <div className={locals.buttonWrapper}>
        <IconButton
          type="lib_actions_refresh"
          size={'compact'}
          kind={'primary'}
          onClick={() => {
            isRecalculated.current = true;
            updateForm(
              form
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], field =>
                  (field as Field<boolean>).setValue(true)
                )
                .updateIn(['threshold', 'warningThreshold'], thresholdMapForm =>
                  (thresholdMapForm as unknown as MapForm<any>).updateIn(['baseline'], item =>
                    (item as Field<any>).setValue(null).setTouched(false)
                  )
                )
                .updateIn(['threshold', 'criticalThreshold'], thresholdMapForm =>
                  (thresholdMapForm as unknown as MapForm<any>).updateIn(['baseline'], item =>
                    (item as Field<any>).setValue(null).setTouched(false)
                  )
                )
            );
          }}
          disabled={isDisabled}
          iconDescription={t('in-alerting:smartAlerts.components.smartAlertDialog.buttonRecalculateBaseline')}
        />
      </div>
    </Tooltip>
  );
}
