/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TraceActivityTreeNode } from '@instana/types/index';

import { LazyCallTree } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';

interface CallTimeAxisProps {
  call: TraceActivityTreeNode | LazyCallTree;
  showStartLabel?: boolean;
}

declare const CallTimeAxis: (props: CallTimeAxisProps) => JSX.Element;

export default CallTimeAxis;
