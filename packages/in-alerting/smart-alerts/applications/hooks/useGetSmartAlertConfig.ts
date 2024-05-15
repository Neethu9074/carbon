/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ApplicationAlertConfigWithMetadata, GlobalApplicationsAlertConfigWithMetadata, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { getGlobalAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { getAlertConfigByIdAndTimestamp } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';

export default function useGetSmartAlertConfig(
  alertConfigId: string,
  alertConfigCreated: number,
  isGlobalSmartAlert: boolean,
  editMode: boolean
) {
  const alertConfigInEditMode:
    | Observable<Result<GlobalApplicationsAlertConfigWithMetadata | ApplicationAlertConfigWithMetadata>>
    | undefined =
    alertConfigId && alertConfigCreated && editMode
      ? isGlobalSmartAlert
        ? getGlobalAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated, { asObservable: true })
        : getAlertConfigByIdAndTimestamp(alertConfigId, alertConfigCreated, { asObservable: true })
      : undefined;

  const result = useObservable(() => {
    return alertConfigInEditMode;
  }, []);
  return { alertConfig: result?.data, alertConfigErrors: result?.errors };
}
