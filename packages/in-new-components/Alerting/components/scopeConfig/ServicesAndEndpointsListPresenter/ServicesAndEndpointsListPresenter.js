import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import SharedList, {
  types
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import { listReducer } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';
import useObservable from 'in-hooks/useObservable';

export default function ServicesAndEndpointsListPresenter({
  applicationId,
  apiSubscriptions,
  applicationsSelection = {}
}) {
  const [state, dispatch] = useReducer(listReducer, applicationsSelection);

  return (
    <ApplicationsList
      {...apiSubscriptions}
      applicationId={applicationId}
      initialApplicationSelection={applicationsSelection}
      stateManagement={{ state, dispatch }}
    />
  );
}

function ApplicationsList({ getApplications, applicationId, getApplication, ...props }) {
  const applications =
    useObservable(
      applicationId
        ? getApplication({ id: applicationId }).map(({ data }) => [{ application: data }] ?? [])
        : getApplications().map(({ data }) => data?.items ?? []),
      []
    ) ?? [];

  const listData = applications.map(_application => {
    const newApplication = { ..._application, item: _application.application };
    delete newApplication.application;
    return newApplication;
  });

  enrichListWithStaleSelectionData(Object.entries(props.stateManagement.state), listData);

  return (
    <SharedList
      {...props}
      listData={listData}
      renderSubList={({ applicationId }) => () => <ServicesList {...props} parentIds={{ applicationId }} />}
      type={types.APPLICATION}
    />
  );
}

function ServicesList({ getServices, parentIds, ...props }) {
  const services =
    useObservable(
      getServices().map?.(({ data }) => data?.items ?? []),
      []
    ) ?? [];

  const listData = services.map(_service => {
    const newService = { ..._service, item: _service.service };
    delete newService.service;
    return newService;
  });

  enrichListWithStaleSelectionData(
    Object.entries(props.stateManagement.state[parentIds.applicationId]?.services ?? {}),
    listData
  );

  return (
    <SharedList
      {...props}
      listData={listData}
      renderSubList={({ applicationId, serviceId }) => () => (
        <EndpointsList {...props} parentIds={{ applicationId, serviceId }} />
      )}
      type={types.SERVICE}
      parentIds={parentIds}
    />
  );
}

function EndpointsList({ getEndpoints, parentIds, ...props }) {
  const endpoints =
    useObservable(
      getEndpoints().map?.(({ data }) => data?.items ?? []),
      []
    ) ?? [];

  const listData = endpoints.map(_endpoint => {
    const newEndpoint = { ..._endpoint, item: _endpoint.endpoint };
    delete newEndpoint.endpoint;
    return newEndpoint;
  });

  enrichListWithStaleSelectionData(
    Object.entries(
      props.stateManagement.state[parentIds.applicationId]?.services[parentIds.serviceId]?.endpoints ?? {}
    ),
    listData
  );

  return <SharedList {...props} listData={listData} type={types.ENDPOINT} parentIds={parentIds} />;
}

function enrichListWithStaleSelectionData(entries, listData) {
  entries.forEach(([key, value]) => {
    if (!listData.some(it => it.item.id == key)) {
      listData.push({ item: { ...value, label: key } });
    }
  });
}

export const applicationsItemTreePropType = PropTypes.shape({
  applicationId: PropTypes.string,
  services: PropTypes.shape({
    servicesId: PropTypes.shape({
      servicesId: PropTypes.string,
      endpoints: PropTypes.shape({
        endpointId: PropTypes.shape({
          endpointId: PropTypes.string
        })
      })
    })
  })
});

ServicesAndEndpointsListPresenter.propTypes = {
  apiSubscriptions: PropTypes.shape({
    getApplications: PropTypes.func.isRequired,
    getApplication: PropTypes.func.isRequired,
    getServices: PropTypes.func.isRequired,
    getEndpoints: PropTypes.func.isRequired
  }).isRequired,
  applicationId: PropTypes.string,
  applicationsSelection: applicationsItemTreePropType
};
