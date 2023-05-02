/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ReactNode } from 'react';

interface EventsProps {
  setTitle: boolean;
  pageSize?: number;
  rightHeader?: ReactNode;
  loadEntities: () => Observable<any[]>;
  tableActions?: TableActions<any>;
  noDataMessage?: string;
  hiddenIds?: string[];

  isSearchable?: boolean;
  onRowClick?: () => void;
  hasRowNavigation?: boolean;
  inSelectListDialog?: boolean;
  getHeader?: () => void;
  /**
   * 1. Removes filter items for deprecated/migrated events
   * 2. Filters out deprecated/migrated events
   */
  withoutAppDataLegacyEvents?: boolean;
}

declare function Events(props: EventsProps): JSX.Element;

export default Events;
