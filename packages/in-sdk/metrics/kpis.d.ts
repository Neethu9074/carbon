/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

interface KpiDefinition {
  label: string;
  metric: string;
  formatter: (num: number) => string;
}

export function getKpiDefinitions(plugin: string): KpiDefinition[];
