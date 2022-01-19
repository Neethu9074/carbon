/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

export interface ColumnDefinition<ColumnProps extends Object> {
  id: string;
  width: string;
  sortable?: boolean;
  optional?: boolean;
  getContent(props: ColumnProps): React.ReactNode;
  label: string;
  renderLabel?: (definition: ColumnDefinition<ColumnProps>) => React.ReactNode;
}
