/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const PER_AP = 'PER_AP';
export const PER_AP_SERVICE = 'PER_AP_SERVICE';

const alertEvaluationTypes = {
  [PER_AP]: {
    selectionText: 'on the aggregation of all selected Services and Endpoints',
    columnText: 'aggregated',
    description: 'Alert on the aggregation of all selected Services and Endpoints'
  },
  [PER_AP_SERVICE]: {
    selectionText: 'on the aggregation per Service',
    columnText: 'per Service',
    description: 'Alert individually on the aggregation per Service'
  }
};

export default alertEvaluationTypes;
