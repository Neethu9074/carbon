/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export default interface OnboardingProps {
  id: string;
  agentEndpoint?: string;
  agentKey: string;
  agentEndpointPort?: string;
  type?: string;
  instanaDomain?: string;
  downloadKey: string;
  azulDisabled?: boolean;
  tenant?: string;
  tenantUnit?: string;
  butlerDomain?: string;
  serverlessEndpoint?: string;
  fromOnboarding?: boolean;
  region?: string;
}
