/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

import { getValueRoundedToDecimals } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton.mless';

export default function UseSuggestedValueButton({
  form,
  onChange,
  percentageMetric,
  metricUnitPostfix,
  isGlobalSmartAlert = false
}) {
  const suggestedThresholdValue = form.get('hiddenFields').get('suggestedThresholdValue').value;
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
  const thresholdValueItem = form.get('threshold').get('value');
  const thresholdValueManuallyChanged = thresholdValueItem.touched;
  const thresholdValue = thresholdValueItem.value;
  const showLoadingIndicator = !isGlobalSmartAlert && calculateThresholdOnBackend;

  const showButton = useShowButton(suggestedThresholdValue, thresholdValueManuallyChanged);

  return (
    <>
      {showLoadingIndicator ? (
        <>
          <LoadingIndicator size="regular" className={locals.loadingIndicator} />
          <div className={locals.loadingIndicatorText}>
            {t('in-alerting:smartAlerts.components.smartAlertDialog.loadingThresholdSuggestion')}
          </div>
        </>
      ) : (
        <>
          {showButton && (
            <div className={locals.buttonWrapper}>
              <Button
                kind="secondaryDarker"
                onClick={() =>
                  onChange(['threshold', 'value'], f => f.setValue(suggestedThresholdValue).setTouched(true))
                }
                disabled={suggestedThresholdValue === thresholdValue}
              >
                <span>
                  {t('in-alerting:smartAlerts.components.smartAlertDialog.useSuggestedvalue')} &nbsp;
                  <b>{getValueRoundedToDecimals(suggestedThresholdValue, !!percentageMetric)}</b>
                  &nbsp; {metricUnitPostfix}
                </span>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function useShowButton(suggestedThresholdValue, thresholdValueManuallyChanged) {
  const [isNewThresholdValue, setIsNewThresholdValue] = useState(false);
  const lastValue = useRef(null);

  useEffect(() => {
    if (lastValue.current !== suggestedThresholdValue) {
      lastValue.current = suggestedThresholdValue;
      setIsNewThresholdValue(true);
    }
  }, [suggestedThresholdValue]);

  const showButton =
    (thresholdValueManuallyChanged && suggestedThresholdValue != null) ||
    (suggestedThresholdValue != null && isNewThresholdValue);

  return showButton;
}

UseSuggestedValueButton.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  percentageMetric: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool,
  metricUnitPostfix: PropTypes.string
};
