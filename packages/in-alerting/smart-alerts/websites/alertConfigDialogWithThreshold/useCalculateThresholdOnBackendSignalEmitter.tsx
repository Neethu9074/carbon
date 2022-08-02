/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import { useEffect } from 'react';

// @ts-expect-error file is not yet migrated to typescript
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';

export default function useCalculateThresholdOnBackendSignalEmitter(form: MapForm) {
  const calculateThresholdOnBackend = ((form.get('hiddenFields') as MapForm)!.get(
    'calculateThresholdOnBackend'
  ) as Field<boolean>).value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}
