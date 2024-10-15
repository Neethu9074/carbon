/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export type TimePickerProps = {
  /**
   *  Specify whether the <input> should be disabled
   */
  disabled?: boolean;
  /**
   *  Custom id
   */
  id?: string;
  /**
   *  Specify whether the control is currently invalid
   */
  invalid?: boolean;
  /**
   *  Provide the text that is displayed when the control is in an invalid state
   */
  invalidText?: React.ReactNode;
  /**
   *
   */
  labelText?: React.ReactNode;
  /**
   *
   */
  maxLength?: number;
  /**
   *
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /**
   *
   */
  onChange?: (time: string) => void;
  /**
   *
   */
  placeholder?: string;
  /**
   *
   */
  readOnly?: boolean;
  /**
   *
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   *
   */
  value?: string;
  /**
   *
   */
  warning?: boolean;
  /**
   *
   */
  warningText?: boolean;
  /**
   *
   */
};
