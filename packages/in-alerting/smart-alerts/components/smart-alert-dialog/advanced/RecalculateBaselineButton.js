/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton.mless';

export default function RecalculateBaselineButton({ onChange, editMode, form }) {
  const isRecalculated = useRef(false);

  if (!editMode) {
    return null;
  }

  return (
    <div className={locals.buttonWrapper}>
      <Button
        kind="secondaryDarker"
        onClick={() => {
          isRecalculated.current = true;
          onChange(['hiddenFields'], f => {
            return f.updateIn(['calculateThresholdOnBackend'], field => field.setValue(true));
          });
        }}
        disabled={isRecalculated.current || !form?.get('threshold').get('baseline')?.touched}
      >
        {t('in-alerting:smartAlerts.components.smartAlertDialog.buttonRecalculateBaseline')}
      </Button>
    </div>
  );
}

RecalculateBaselineButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  form: PropTypes.object
};
