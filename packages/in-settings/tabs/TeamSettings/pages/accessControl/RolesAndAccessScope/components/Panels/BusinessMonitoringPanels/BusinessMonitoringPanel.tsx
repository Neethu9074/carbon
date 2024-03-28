/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { StackItem, Typography } from '@instana/components';

interface BusinessMonitoringPanelProps {
  description: string;
  title: string;
}

export default function BusinessMonitoringPanel({ title, description }: BusinessMonitoringPanelProps) {
  return (
    <StackItem>
      <Typography variant="heading-200" component="div">
        {title}
      </Typography>
      <Typography variant="body-regular" component="div">
        {description}
      </Typography>
    </StackItem>
  );
}
