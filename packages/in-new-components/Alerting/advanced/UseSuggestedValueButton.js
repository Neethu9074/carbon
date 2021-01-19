/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { getValueRoundedToDecimals } from 'in-new-components/Alerting/utils/formatUtils';
import Button from 'in-new-components/Button/Button';

import locals from './UseSuggestedValueButton.mless';

export default function UseSuggestedValueButton({ form, onChange, percentageMetric, metricUnitPostfix }) {
  const suggestedThresholdValue = form.get('hiddenFields').get('suggestedThresholdValue').value;
  const thresholdValueManuallyChanged = form.get('hiddenFields').get('thresholdValueManuallyChanged').value;
  const thresholdValue = form.get('threshold').get('value').value;

  const showButton = useShowButton(suggestedThresholdValue, thresholdValueManuallyChanged);

  return (
    showButton && (
      <div className={locals.buttonWrapper}>
        <Button
          kind="secondaryDarker"
          onClick={() => onChange(['threshold', 'value'], f => f.setValue(suggestedThresholdValue).setTouched(true))}
          disabled={suggestedThresholdValue === thresholdValue}
        >
          <span>
            Use suggested value &nbsp; <b>{getValueRoundedToDecimals(suggestedThresholdValue, !!percentageMetric)}</b>
            &nbsp; {metricUnitPostfix}
          </span>
        </Button>
      </div>
    )
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
  metricUnitPostfix: PropTypes.string
};
