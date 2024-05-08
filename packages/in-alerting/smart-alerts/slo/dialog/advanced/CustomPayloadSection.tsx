/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';

export default function CustomPayloadSection() {
  const { form, updateForm } = useSloAlertFormContext();

  return <AlertConfigCustomPayload form={form} setForm={updateForm} supportDynamicTypes={false} />;
}
