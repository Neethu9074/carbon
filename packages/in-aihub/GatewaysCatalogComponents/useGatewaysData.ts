/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create, timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import { getEgressGateways } from 'in-aihub/api';

export interface Gateway {
  id: string;
  name: string;
  description: string;
  aiModel: string;
  watsonxKey?: string;
  watsonxProject?: string;
  watsonxUrl?: string;
  endpointUrl: string;
  endpointApiKey?: string;
  supports: {
    capabilities: string[];
  };
  metadata: {
    source: string;
    version: string;
  };
  configurations?: {
    tokenLimit: number;
    maxLatency: number;
    repetitionPenalty: number;
    temperature: number;
    topK: number;
    topP: number;
  };
  enabled: boolean;
}

// Signal to trigger data refresh
const refreshSignal = create().emit(true);

/**
 * Hook to fetch and manage gateways data
 * @returns FetchedState tuple containing [data, status, errors, progress]
 */
export default function useGatewaysData(): FetchedState<Gateway[]> {
  const result = useObservable(() => refreshSignal.flatMap(() => getEgressGateways()), []);

  return resultToFetchedStateResponse(result);
}

/**
 * Helper function to trigger a refresh of the gateways data
 */
export function refreshGatewaysData(): void {
  timeout(1000).once(() => refreshSignal.emit(true));
}
