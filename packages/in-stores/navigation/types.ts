/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface Parameters {
  [key: string]: string;
}

export interface ParameterDefinition<T> {
  path?: string;
  name: string;
  as?: string;
  serializer?: (v: T) => string | undefined | null;
  parser?: (str?: string) => T | undefined | null;
  initialState?: T;
}

export interface MatrixParameters {
  [pathSegment: string]: Parameters;
}

export interface Location {
  pathname: string;
  query: Parameters;
  matrix: MatrixParameters;
}
