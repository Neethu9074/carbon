/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonStack, FormLabel } from '@instana/components';

import local from 'in-automation/components/KeyValueCard/KeyValueCard.mless';

interface KeyValueCardProps {
  label: string;
  value: string | Element | React.ReactNode | undefined;
}

function KeyValueCard(props: KeyValueCardProps) {
  const { label, value } = props;
  return (
    <CarbonStack className={local.keyValueWrapper}>
      <FormLabel clas>{label}</FormLabel>
      <div>{value}</div>
    </CarbonStack>
  );
}

export default KeyValueCard;
