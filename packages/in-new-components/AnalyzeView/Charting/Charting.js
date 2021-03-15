/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import Configurator from 'in-new-components/AnalyzeView/Charting/Configurator';
import Chart from 'in-new-components/AnalyzeView/Charting/Chart';

export default function Charting(props) {
  return (
    <>
      <Configurator {...props} />
      <Chart {...props} />
    </>
  );
}

Charting.propTypes = {
  ...Configurator.propTypes,
  ...Chart.propTypes,
  ...childrenArgsAsPropTypes
};
