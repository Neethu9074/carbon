/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceOrEndpointSelection from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ServiceOrEndpointSelection';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import APSelection from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/APSelection';

export default function ChartSubEntitySelection(props) {
  const isSelectApLevel = props?.alertConfigWithFormModel?.evaluationType === PER_AP;

  if (isSelectApLevel) {
    return <APSelection {...props} />;
  }

  return <ServiceOrEndpointSelection {...props} />;
}
