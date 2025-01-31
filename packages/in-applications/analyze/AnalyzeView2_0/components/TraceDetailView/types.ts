/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';

export type DashboardButtonProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  hasIconOnly?: boolean;
  href?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: Size;
  iconStyle?: string;
  ariaLabel?: string;
  /**
   * If specifying the `renderIcon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  iconDescription?: string;
  id?: string;
  kind?: 'primary' | 'secondary' | 'ghost' | 'tertiary' | 'danger';
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  target?: string;
  tooltipposition?: string;
};
