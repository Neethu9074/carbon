/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { smartAlertPath, applicationsList } from 'in-applications/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function useAlertingTearSheetAction() {
  const { location } = useNavigation();

  const cancelTearSheet = (): string => {
    return getMatrixParameter(location, smartAlertPath, cancelUrl) ?? applicationsList;
  };

  return { cancelTearSheet };
}
