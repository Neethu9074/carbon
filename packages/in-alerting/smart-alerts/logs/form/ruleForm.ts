/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, MapForm } from 'formalistic';

export default function createRuleForm(): MapForm<any> {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: 'logCount'
      })
    )
    .put(
      'metricName',
      createField({
        value: 'logCount'
      })
    );
}
