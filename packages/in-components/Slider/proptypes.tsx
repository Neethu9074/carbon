/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export interface Shape {
  value: number;
  label: string;
  millis?: number;
}

export interface RestrictedSliderProp {
  marks: Shape[];
  max: number;
  min: number;
  onChange: (value: number) => void;
  valueLabelFormat?: (value: number) => string;
  valueLabelDisplay?: 'on' | 'off' | 'auto';
  disabled?: boolean;
  value: number;
}
