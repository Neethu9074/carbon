/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// Our history wrapper changes the return type of `useLocation`. We need to adjust
// the type definitions to account for this.
declare module 'react-router' {
  export function useLocation(): Location;
}

export interface Parameters {
  [key: string]: string | undefined | null;
}

export interface ParameterDefinition<T> {
  path?: string;
  name: string;
  as?: string;
  serializer?: (v: T) => string | undefined | null;
  parser?: (str?: string) => T | undefined | null;
  initialState?: T;
  getInitialState?: () => T;
}

export interface MatrixParameters {
  [pathSegment: string]: Parameters;
}

export interface Location {
  pathname: string;
  query: Parameters;
  matrix: MatrixParameters;
}
