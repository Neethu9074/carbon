/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import lineWithBaselineAndPotentialProblem from 'in-alerting/components/Chart/renderer/lineWithBaselineAndPotentialProblem';
import lineWithHistoricBaseline from 'in-alerting/components/Chart/renderer/lineWithHistoricBaseline';
import lineWithAdaptiveBaseline from 'in-alerting/components/Chart/renderer/lineWithAdaptiveBaseline';
import lineWithThreshold from 'in-alerting/components/Chart/renderer/lineWithThreshold';

export default {
  lineWithHistoricBaseline,
  lineWithThreshold,
  lineWithAdaptiveBaseline,
  lineWithBaselineAndPotentialProblem
};
