/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export type TableStates = 'loading' | 'idle' | 'empty' | 'error';

type Variant = 'success' | 'error' | 'warning';
export interface NotificationState {
  show: boolean;
  variant?: Variant;
}

export interface ModalNotificationProps {
  variant?: Variant;
  onClick?: () => void;
}
