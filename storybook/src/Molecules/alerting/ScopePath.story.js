/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import ScopePath from 'in-new-components/Alerting/components/ScopePath';

export default {
  title: 'Molecules|alerting/ScopePath',
  component: ScopePath
};

export const scopePaths = () => (
  <div>
    <ScopePath applicationName="Application" />
    <ScopePath applicationName="Application" serviceName="Service" />
    <ScopePath applicationName="Application" serviceName="Service" endpointName="Endpoint" />
    <ScopePath applicationName="No" serviceName="Bottom" endpointName="Margin" noBottomMargin />
    <ScopePath applicationName="With" serviceName="Red" endpointName="Color" color="red" />
  </div>
);
