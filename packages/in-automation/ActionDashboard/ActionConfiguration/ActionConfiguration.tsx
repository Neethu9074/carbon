/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Action } from '@instana/types';

import ActionConfigurationCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfigurationCard';
import ParameterDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ParameterDetailsCard';
import ActionDetailsCard from 'in-automation/ActionDashboard/ActionConfiguration/ActionDetailsCard';
import { Nullish } from 'in-types';

interface ActionConfigurationProps {
  data: Action | Nullish;
}

export default function ActionConfiguration({ data }: ActionConfigurationProps) {
  if (!data) return null;
  return (
    <>
      <ActionDetailsCard data={data} />
      <ActionConfigurationCard data={data} />
      <ParameterDetailsCard data={data} />
    </>
  );
}
