/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { EntityId, TimeConfig } from 'in-types';
import http from 'in-services/http/http';

interface InvestigationProps {
  rcaEntityId: EntityId;
  triggeringEntityId: EntityId;
  eventId: string;
  timeConfig: TimeConfig;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
}

export interface InvestigationResponse {
  diagnosis: {
    diagnosis: string;
    reasoning: string;
  };
  event_summary: string;
  trace_log_summary: string;
  trace_error_log_summary: string;
  fact_check: {
    factuality_score: number;
    reasoning: string;
  };
  token_usage: number;
}

export const startInvestigation = (props: InvestigationProps) => {
  return http<InvestigationResponse>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: 'api/automated-investigation/rca/investigation',
    data: props
  });
};
