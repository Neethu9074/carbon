/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface Parameters {
  [key: string]: string;
}

export interface MatrixParameters {
  [pathSegment: string]: Parameters;
}

export interface Location {
  pathname: string;
  query: Parameters;
  matrix: MatrixParameters;
}
