/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';

import { Button } from '@instana/components';

import { getValueRoundedToDecimals } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton.mless';

interface UseSuggestedValueButtonProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric?: boolean;
  isGlobalSmartAlert?: boolean;
  metricUnitPostfix?: string;
  thresholdField?: Field<any>;
  isMultiThreshold?: boolean;
  getUpdatedForm?: (targetValue: number | null) => MapForm<any>;
  isTearSheet?: boolean;
}

export default function UseSuggestedValueButton({
  form,
  updateForm,
  percentageMetric = false,
  metricUnitPostfix,
  isGlobalSmartAlert = false,
  thresholdField = form.get('threshold').get('value'),
  isMultiThreshold = false,
  getUpdatedForm,
  isTearSheet = false
}: UseSuggestedValueButtonProps) {
  const suggestedThresholdValue = form.get('hiddenFields').get('suggestedThresholdValue').value;
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
  const thresholdValueManuallyChanged = thresholdField?.touched;
  const thresholdValue = thresholdField?.value;
  const showLoadingIndicator = !isGlobalSmartAlert && calculateThresholdOnBackend;

  const showButton = useShowButton(suggestedThresholdValue, thresholdValueManuallyChanged);

  return (
    <>
      {showLoadingIndicator ? (
        <>
          <LoadingIndicator
            size="regular"
            className={classNames({
              [locals.loadingIndicator]: true,
              [locals.multiThresholdLoadingIndicator]: isMultiThreshold
            })}
          />
          <div className={locals.loadingIndicatorText}>
            {t('in-alerting:smartAlerts.components.smartAlertDialog.loadingThresholdSuggestion')}
          </div>
        </>
      ) : (
        <>
          {showButton && (
            <div
              className={classNames({
                [locals.buttonWrapper]: !isTearSheet,
                [locals.multiThresholdButtonWrapper]: isMultiThreshold && !isTearSheet
              })}
            >
              <Button
                size="compact"
                kind="tertiary"
                onClick={() => {
                  const updatedForm = getUpdatedForm
                    ? getUpdatedForm(suggestedThresholdValue)
                    : form.updateIn(['threshold', 'value'], f =>
                        (f as Field<any>).setValue(suggestedThresholdValue).setTouched(true)
                      );

                  updateForm(updatedForm);
                }}
                disabled={suggestedThresholdValue === thresholdValue}
              >
                <span>
                  {t('in-alerting:smartAlerts.components.smartAlertDialog.useSuggestedvalue')} &nbsp;
                  <b>{getValueRoundedToDecimals(suggestedThresholdValue, percentageMetric)}</b>
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

function useShowButton(suggestedThresholdValue: number, thresholdValueManuallyChanged?: boolean): boolean {
  const [isNewThresholdValue, setIsNewThresholdValue] = useState(false);
  const lastValue = useRef<number | null>(null);

  useEffect(() => {
    if (lastValue.current !== suggestedThresholdValue) {
      lastValue.current = suggestedThresholdValue;
      setIsNewThresholdValue(true);
    }
  }, [suggestedThresholdValue]);

  return (
    (thresholdValueManuallyChanged && suggestedThresholdValue != null) ||
    (suggestedThresholdValue != null && isNewThresholdValue)
  );
}
