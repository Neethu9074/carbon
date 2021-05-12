/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';

const logHealthMappings = new Map([
  ['error', 10],
  ['warn', 5]
]);

export default function LogHealthColumn({ tags, children }) {
  const logLevel = getLogLevel(tags);
  const severity = getSeverityByLogLevel(logLevel);
  return children({ severity });
}

function getSeverityByLogLevel(level) {
  return level ? logHealthMappings.get(level.toLowerCase()) ?? 0 : 0;
}
