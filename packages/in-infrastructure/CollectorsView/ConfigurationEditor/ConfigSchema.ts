/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

interface Pipeline {
  receivers: string[];
  procesors: string[];
  exporters: string[];
}

interface Pipelines {
  [name: string]: Pipeline;
}

interface Service {
  extensions: string[];
  pipelines: Pipelines;
}

interface OTelConfig {
  receivers: object;
  processors: object;
  exporters: object;
  extensions: object;
  service: Service;
}
