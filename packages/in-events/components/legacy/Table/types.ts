/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export enum TrSizes {
  compact,
  minimal,
  regular
}

export type TrProps = {
  className?: string;
  depth?: 1 | 2;
  size?: keyof typeof TrSizes;
  active?: boolean;
  dull?: boolean;
  selected?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

export type TdProps = {
  style?: Record<string, any>;
  children?: React.ReactNode;
  ellipsis?: string | boolean;
  noWrap?: boolean;
  active?: boolean;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  useMinimumAmountOfHorizontalSpace?: boolean;
};
