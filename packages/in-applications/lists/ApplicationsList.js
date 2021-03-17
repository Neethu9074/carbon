/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  applicationId as applicationIdMatrixParam,
  serviceId as serviceIdMatrixParam,
  endpointId as endpointIdMatrixParam,
  contextScope as contextScopeMatrixParam,
  tagFilters as tagFiltersMatrixParam,
  snapshotId as snapshotIdMatrixParam,
  plugin as pluginMatrixParam
} from 'in-applications/navigation/matrix';
import { serializeTagFilters, deserializeTagFilters } from 'in-mobile-apps/navigation/matrix';
import ApplicationsListPresenter from 'in-applications/lists/ApplicationsListPresenter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';

const pathSegment = '/applications';
const matrixPrefix = 'app.';

const urlStateDefinition = {
  bind: [
    {
      path: pathSegment,
      name: `${matrixPrefix}${applicationIdMatrixParam}`,
      as: 'applicationId',
      initialState: ''
    },
    {
      path: pathSegment,
      name: `${matrixPrefix}${serviceIdMatrixParam}`,
      as: 'serviceId',
      initialState: ''
    },
    {
      path: pathSegment,
      name: `${matrixPrefix}${endpointIdMatrixParam}`,
      as: 'endpointId',
      initialState: ''
    },
    {
      path: pathSegment,
      name: `${matrixPrefix}${contextScopeMatrixParam}`,
      as: 'contextScope',
      initialState: ''
    },
    {
      path: pathSegment,
      name: `${matrixPrefix}${snapshotIdMatrixParam}`,
      as: 'snapshotId',
      initialState: ''
    },
    {
      path: pathSegment,
      name: `${matrixPrefix}${pluginMatrixParam}`,
      as: 'plugin',
      initialState: ''
    },
    {
      path: pathSegment,
      name: `${matrixPrefix}${tagFiltersMatrixParam}`,
      as: 'tagFilters',
      initialState: [],
      parser: deserializeTagFilters,
      serializer: serializeTagFilters
    }
  ],
  reducer: (prev, next) => ({ ...prev, ...next })
};

export default function ApplicationsList(props) {
  const timeConfig = useTimeConfig();
  const [urlState, setFilter] = useUrlState(urlStateDefinition);

  return <ApplicationsListPresenter {...props} timeConfig={timeConfig} {...urlState} setFilter={setFilter} />;
}
