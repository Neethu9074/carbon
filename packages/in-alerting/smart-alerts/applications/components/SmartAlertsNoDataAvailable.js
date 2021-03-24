/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

export default function SmartAlertsNoDataAvailable({ text }) {
  return <NoDataAvailable text={text} type="lib_alerts_alert" height={100} />;
}
