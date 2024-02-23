/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

interface SmartAlertsNoDataAvailableProps {
  text: string;
  type?: string;
}

export default function SmartAlertsNoDataAvailable({
  text,
  type = 'lib_alerts_create'
}: SmartAlertsNoDataAvailableProps) {
  return <NoDataAvailable text={text} type={type} height={100} />;
}
