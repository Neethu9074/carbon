/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const PER_AP = 'PER_AP';
export const PER_AP_SERVICE = 'PER_AP_SERVICE';

const alertEvaluationTypes = {
  [PER_AP]: {
    columnText: 'aggregated',
    text: 'the aggregation of all selected Services and Endpoints'
  },
  [PER_AP_SERVICE]: {
    columnText: 'per Service',
    text: 'the aggregation per Service'
  }
  /* later:
  [PER_AP]: {
    columnText: 'per Endpoints'
    text: 'Alert individually on the aggregation per Endpoints per Service'
  }
  */
};

export default alertEvaluationTypes;
