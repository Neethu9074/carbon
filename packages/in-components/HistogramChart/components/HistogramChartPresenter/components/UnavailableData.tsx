/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

import locals from 'in-components/HistogramChart/components/HistogramChartPresenter/HistogramChartPresenter.mless';

interface Props {
  width: number;
  height: number;
  text: string;
}

export default function UnavailableData(props: Props) {
  return (
    <div className={locals.container}>
      <NoDataAvailable {...props} />
    </div>
  );
}
