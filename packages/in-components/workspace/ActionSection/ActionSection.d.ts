/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

interface ActionSectionProps {
  left?: ReactNode;
  right?: ReactNode;
}

interface ActionProps {
  disabledTooltip: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  [key: string]: unknown;
}

declare const ActionSection: (props: ActionSectionProps) => JSX.Element;
declare const Action: (props: ActionProps) => JSX.Element;
