/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { setActiveKey } from 'in-automation/AutomationCard/OptimizationsButtonGroup';
import { actionHistoryPath, actionHistory } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export default function useNavigateToActionHistory() {
  const { location, navigate } = useNavigation();

  return (actionInstanceId: string, mode: string = 'setkey') => {
    const path = location;
    if (mode === 'setkey') {
      setActiveKey('history');
    } else if (mode === 'urltab') {
      const loc = location.pathname.lastIndexOf('/');
      if (loc != -1) {
        const relpath = location.pathname.substring(loc);
        setOrDeleteMatrixKey(path, relpath, 'resourceActionsTab', 'history');
      }
    } else {
      path.pathname = actionHistoryPath;
      setOrDeleteMatrixKey(path, actionHistory, 'query', actionInstanceId);
    }
    navigate(location);
  };
}
