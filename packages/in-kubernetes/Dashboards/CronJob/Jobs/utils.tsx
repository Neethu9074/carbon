/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { cronJobDashboard as pathSegment } from 'in-kubernetes/navigation/paths';
import { intParser } from 'in-stores/navigation/urlParameterUtils';

export const sortOptions = [
  { label: 'name', value: 'name' },
  { label: 'age', value: 'age' },
  { label: 'status', value: 'status' }
];

export const urlStateDefinition = {
  bind: [
    {
      path: pathSegment,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: pathSegment,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: pathSegment,
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: intParser
    },
    {
      path: pathSegment,
      name: 'query',
      as: 'query',
      initialState: ''
    }
  ],
  resets: [
    {
      bind: [
        {
          path: pathSegment,
          name: 'orderBy'
        },
        {
          path: pathSegment,
          name: 'orderDirection'
        }
      ],
      reset: { page: 1 }
    }
  ]
};
