/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Children, cloneElement, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';

export default function EntitySelectionFormUpdater({ children, form, updateForm }) {
  const [entitySelection, setEntitySelection] = useState(
    form.get('hiddenFields').get('chartViewEntitySelection').value
  );

  const thresholdType = form.get('threshold').get('type').value;
  const evaluationType = form.get('evaluationType').value;

  useEffect(() => {
    if (!adaptiveBaselineEnabled || thresholdType !== ADAPTIVE_BASELINE || isEmpty(entitySelection)) {
      return;
    }

    if (
      (evaluationType === PER_AP_SERVICE && entitySelection.serviceId) ||
      (evaluationType === PER_AP_ENDPOINT && entitySelection.serviceId && entitySelection.endpointId)
    ) {
      updateForm(
        form.updateIn(['hiddenFields', 'chartViewEntitySelection'], f => f.setValue(entitySelection).setTouched(true))
      );
    }

    return () => {
      if (isEmpty(entitySelection)) {
        updateForm(form.updateIn(['hiddenFields', 'chartViewEntitySelection'], f => f.setValue({}).setTouched(false)));
      }
    };

    // only track updates for entitySelection changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySelection]);

  return useMemo(
    () =>
      Children.map(children, child => {
        return cloneElement(child, {
          onEntityIdChange(_entitySelection) {
            setEntitySelection(esl => ({ ...esl, ..._entitySelection }));
          }
        });
      }),
    [children]
  );
}

EntitySelectionFormUpdater.propTypes = {
  children: PropTypes.node.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
