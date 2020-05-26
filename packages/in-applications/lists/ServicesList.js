import { compose } from 'recompose';

import {
  serviceListPrefix,
  applicationId as applicationIdMatrixParam,
  serviceId as serviceIdMatrixParam,
  endpointId as endpointIdMatrixParam,
  contextScope as contextScopeMatrixParam,
  tagFilters as tagFiltersMatrixParam,
  snapshotId as snapshotIdMatrixParam,
  plugin as pluginMatrixParam
} from 'in-applications/navigation/matrix';
import {
  createEndpointTypesUrlParameter,
  createEndpointTechnologiesUrlParameter
} from 'in-applications/navigation/urlParameters';
import { serializeTagFilters, deserializeTagFilters } from 'in-mobile-apps/navigation/matrix';
import ServicesListPresenter from 'in-applications/lists/ServicesListPresenter';
import { servicesList } from 'in-applications/navigation/paths';
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import connect from 'in-hoc/connectTo';

const matrixPrefix = serviceListPrefix;
const pathSegment = servicesList;

const endpointTypesUrlParameter = createEndpointTypesUrlParameter(pathSegment, matrixPrefix);
const technologiesUrlParameter = createEndpointTechnologiesUrlParameter(pathSegment, matrixPrefix);

export default compose(
  connect({
    timeConfig: timeConfig$
  }),
  withUrlState({
    bind: [
      endpointTypesUrlParameter,
      technologiesUrlParameter,
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
)(ServicesListPresenter);
