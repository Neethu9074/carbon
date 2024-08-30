/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface AccountInfo {
  data: AccountInfoData;
}

interface AccountInfoData {
  activation: Activation;
}

/**
 * firstAgentInstalled = fa
 *
 * tracingReported = tr
 *
 * additionalUserInvited = au
 *
 * threeAgentsInstalled = ai
 *
 * twoApplicationPerspectivesCreated = ap
 *
 * oneAlertSetUpAndActivated = sas
 *
 * oneWebsiteMonitored = w
 *
 * fiveUsers = u
 */
export type Activation = {
  [key: string]: {
    c?: ActivationStatus;
    fs?: ActivationStatus;
    fa?: ActivationStatus;
    tr?: ActivationStatus;
    au?: ActivationStatus;
    ai?: ActivationStatus;
    ap?: ActivationStatus;
    as?: ActivationStatus;
    sas?: ActivationStatus;
    w?: ActivationStatus;
    u?: ActivationStatus;
    piq?: ActivationStatus;
    pia?: ActivationStatus;
    pii?: ActivationStatus;
  };
};

type ActivationStatus = {
  status: boolean;
  timestamp: number;
};
