/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  type as typeInternal,
  validate as validateInternal,
  initialize as initializeInternal
} from 'in-infrastructure/tableView/components/Table/renderers/sparkChart/sparkChart';

export const type = typeInternal;
export const validate = col => validateInternal(col);
export const initialize = (row, columnDefinition, columnIndex, emitRawDataChange) =>
  initializeInternal(row, columnDefinition, columnIndex, emitRawDataChange);
