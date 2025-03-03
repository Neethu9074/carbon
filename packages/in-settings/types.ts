/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MessageTypes } from '@instana/components';

import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

export interface ApiItemResult<RESULT> {
  result: Record<string, RESULT>;
}

export interface ApiItemMessage {
  message?: string;
  text?: string;
  type?: keyof typeof MessageTypes;
  isSaving?: boolean;
}

export interface EnrichFormProps<CONFIG_TYPE> extends ApiItemResult<CONFIG_TYPE> {
  setCanDeleteItem: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SaveItemProps {
  setMessage: React.Dispatch<React.SetStateAction<ApiItemMessage>>;
  unstable_trackEvent: ReturnType<typeof useSegmentTracking>['unstable_trackEvent'];
}

export type LoadingStatus = 'inactive' | 'active' | 'finished' | 'error' | undefined;
