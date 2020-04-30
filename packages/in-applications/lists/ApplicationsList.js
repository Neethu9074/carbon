import { compose } from 'recompose';

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
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

const pathSegment = '/applications';
const matrixPrefix = 'app.';

export default compose(
  connectTo({
    timeConfig: timeConfig$
  }),
  withUrlState({
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
    reducerName: 'setFilter',
    reducer: (prev, next) => ({ ...prev, ...next })
  })
)(ApplicationsListPresenter);
