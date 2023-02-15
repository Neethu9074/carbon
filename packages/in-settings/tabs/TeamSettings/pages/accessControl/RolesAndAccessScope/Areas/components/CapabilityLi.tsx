/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Typography } from '@instana/components';

import { CapabilityType, productPermissionsObject } from 'in-stores/permission';

interface CapabilityLiProps {
  capability: CapabilityType;
}

export const CapabilityLi = ({ capability }: CapabilityLiProps) => {
  return (
    <Li noAlternatingBg>
      <Typography variant="body-regular">{productPermissionsObject[capability].label}</Typography>
    </Li>
  );
};
