/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import { useEffect } from 'react';

import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';

export default function useCalculateThresholdOnBackendSignalEmitter(form: MapForm<any>) {
  const calculateThresholdOnBackend = (
    (form.get('hiddenFields') as MapForm<any>)!.get('calculateThresholdOnBackend') as Field<boolean>
  ).value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}
