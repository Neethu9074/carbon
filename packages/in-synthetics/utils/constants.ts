/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Progress, Result, SyntheticLocation, SyntheticTest } from 'in-types';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { syntheticsPath } from 'in-synthetics/navigation/paths';
import { Options } from 'in-hooks/useUrlState';

export const dummyLocations = {
  data: [],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyTests: Result<SyntheticTest[]> = {
  data: [] as SyntheticTest[],
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyTest: Result<SyntheticTest> = {
  data: {} as SyntheticTest,
  errors: [],
  progress: {
    loading: true
  }
};

export const dummyLocationn: Result<SyntheticLocation> = {
  data: {} as SyntheticLocation,
  errors: [],
  progress: {
    loading: true
  }
};

export interface UrlState {
  orderBy: string;
  orderDirection: string;
  page: number;
  query: string;
}

export const defaultUrlState: UrlState = {
  orderBy: 'name',
  orderDirection: 'ASC',
  page: 1,
  query: ''
};

export interface TestResponse {
  data?: SyntheticTest;
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export const urlStateDefinition = {
  bind: [
    {
      path: syntheticsPath,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: syntheticsPath,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: syntheticsPath,
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: intParser
    },
    {
      path: syntheticsPath,
      name: 'query',
      as: 'query',
      initialState: ''
    }
  ],
  resets: [
    {
      bind: [],
      reset: defaultUrlState
    }
  ]
} as Options<UrlState>;
