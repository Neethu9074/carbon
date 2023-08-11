/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import StateManagement from 'in-components/AnalyzeView/StateManagement';

declare interface HiddenCalls {
  includeInternal: boolean;
  includeSynthetic: boolean;
}

declare interface ApplicationsQueryBuilderWorkspaceProps extends StateManagement.StateManagementChildProps {
  children: React.ReactNode;
  hiddenCalls: HiddenCalls;
  useLastValidStateWhenErroneous: boolean;
  CustomAction: () => JSX.Element;
}

export default function ApplicationsQueryBuilderWorkspace(props: ApplicationsQueryBuilderWorkspaceProps): JSX.Element;
