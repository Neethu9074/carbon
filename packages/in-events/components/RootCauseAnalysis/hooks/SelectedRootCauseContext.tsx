/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Dispatch, SetStateAction, createContext } from 'react';

const SelectedRootCauseContext = createContext<{
  selectedRootCause: number;
  setSelectedRootCause: Dispatch<SetStateAction<number>>;
}>({
  selectedRootCause: 0,
  setSelectedRootCause: () => {}
});

export default SelectedRootCauseContext;
