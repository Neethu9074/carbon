/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import Configurator from 'in-components/AnalyzeView/Charting/Configurator';
import Chart from 'in-components/AnalyzeView/Charting/Chart';

export default function Charting(props) {
  const { CustomChart } = props;
  return (
    <>
      <Configurator {...props} />
      {CustomChart ? <CustomChart {...props} /> : <Chart {...props} />}
    </>
  );
}

Charting.propTypes = {
  ...Configurator.propTypes,
  ...Chart.propTypes,
  ...childrenArgsAsPropTypes
};
