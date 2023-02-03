/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Children, cloneElement, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { isValidChartViewEntitySelection } from 'in-alerting/smart-alerts/applications/form/formUtils';

export default function EntitySelectionFormUpdater({ children, form, updateForm }) {
  const [entitySelection, setEntitySelection] = useState(
    form.get('hiddenFields').get('chartViewEntitySelection').value
  );

  const evaluationType = form.get('evaluationType').value;

  useEffect(() => {
    if (isEmpty(entitySelection)) {
      return;
    }

    if (isValidChartViewEntitySelection(evaluationType, entitySelection)) {
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
