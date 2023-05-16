/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardHeader from 'in-components/DashboardHeader';

export default function SloDashboardHeader(props: any) {
  return <DashboardHeader {...props} title={'foo title'} label={'fooo label'} icon="lib_service_level" />;
}
