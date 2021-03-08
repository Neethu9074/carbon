/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton.mless';

export default function RecalculateBaselineButton({ onChange, editMode }) {
  const isRecalculated = useRef(false);

  if (!editMode) {
    return null;
  }

  return (
    <Button
      className={locals.buttonWrapper}
      kind="secondaryDarker"
      onClick={() => {
        isRecalculated.current = true;
        onChange(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true));
      }}
      disabled={isRecalculated.current}
    >
      {t('in-new-components:alerting.advanced.buttonRecalculateBaseline')}
    </Button>
  );
}

RecalculateBaselineButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
