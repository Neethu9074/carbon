/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

interface AlertConfigCustomPayloadProps {
  form: MapForm<any>;
  setForm?: (form: MapForm<any>) => void;
  supportDynamicTypes: boolean;
  TagBasedPayloadConfigurator?: React.ReactNode;
}

export default function AlertConfigCustomPayload(props: AlertConfigCustomPayloadProps);
