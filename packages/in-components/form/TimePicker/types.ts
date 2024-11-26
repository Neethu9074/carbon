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
   *  Hide label - should not be false for accessibility
   */
  hideLabel?: boolean;
  /**
   *  Specify whether the control is currently invalid
   *  other than format error
   */
  invalid?: boolean;
  /**
   *  Provide the text that is displayed when the control is in an invalid state
   *  other than format error
   */
  invalidText?: React.ReactNode;
  /**
   *  Label text -- required for accessibility
   */
  labelText?: React.ReactNode;
  /**
   *  Provide an onblur handler (optional)
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /**
   *  Required onChange handler
   */
  onChange: (time: string) => void;
  /**
   *  Optional placeholder text
   */
  placeholder?: string;
  /**
   * Specify whether <input> should be read-only
   */
  readOnly?: boolean;
  /**
   * Specify the size of the TimePicker, md (medium) is the default
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Specify the value of the input
   */
  value?: string;
  /**
   * Specify a warning message
   */
  warning?: boolean;
  /**
   * Specify the warning text
   */
  warningText?: boolean;
  /**
   * Allow seconds entry - default no seconds
   */
  seconds?: boolean;
};
