/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function column(dataPoints) {
  dataPoints.time = getTime(dataPoints);
  return dataPoints;
}

export function getTime(dataColumn) {
  for (let i = 0; i < dataColumn.length; i++) {
    const dataPoint = dataColumn[i];
    if (dataPoint) {
      return dataPoint[0];
    }
  }

  throw new Error(`Received a data column without any data points. Column: ${JSON.stringify(dataColumn)}`);
}
