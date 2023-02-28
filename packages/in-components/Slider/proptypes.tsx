/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

interface Shape {
  value: number;
  label: string;
}

export interface RestrictedSliderProp {
  marks: Shape[];
  max: number;
  min: number;
  onChange: (...args: any[]) => any;
  valueLabelFormat?: (...args: any[]) => any;
  valueLabelDisplay?: 'on' | 'off' | 'auto';
  disabled?: boolean;
  style?: React.CSSProperties;
  value: number | number[];
}
