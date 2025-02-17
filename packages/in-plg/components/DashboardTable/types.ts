/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ReactNode } from 'react';

import { CarbonDataTableProps, LinkProps } from '@instana/components';

export interface DashboardTableProps {
  headers: Array<any>;
  rows: Array<any>;
  isSortable?: boolean;
  viewLabel: string;
  hasAddMore: boolean;
  hasAddPermission?: boolean;
  viewAll: boolean;
  iconColor?: string;
  href?: string;
  sortRow?: CarbonDataTableProps<any, any>['sortRow'];
  addMore?: () => void;
  addData?: () => void;
  onSearch?: (e: string) => void;
  header?: string;
  noDataHeader?: string;
  noDataDescription?: string | JSX.Element;
  hasNoDataTile: boolean;
  buttonName?: string;
  toggles?: ReactNode;
  searchPlaceHolder?: string;
  toggleCallback?: (e: number) => void;
}
export interface TableTabProps extends Pick<LinkProps, 'onClick'> {
  label: string;
  isDisabled?: boolean;
  icon?: string;
}
export interface TableTabsProps {
  children: ReactNode;
  activation?: 'automatic' | 'manual';
  selectedIndex?: number;
  className?: string;
  panels?: ReactNode;
}
