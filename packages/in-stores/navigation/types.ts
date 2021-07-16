/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Location as HistoryLocation } from 'history';

export interface Parameters {
  [key: string]: string;
}

export interface Location extends HistoryLocation {
  query: Parameters;
  matrix: {
    [pathSegment: string]: Parameters;
  };
}
