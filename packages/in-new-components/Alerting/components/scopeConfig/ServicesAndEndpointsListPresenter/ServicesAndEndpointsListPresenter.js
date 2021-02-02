/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  getNewStateWithApplication,
  listReducer
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/listReducer';
import SharedList, {
  types
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';

const DEFAULT_PAGE_SIZE = 5;

export default function ServicesAndEndpointsListPresenter({
  apiSubscriptions,
  applicationsSelection = {},
  onChange,
  alertApplicationId,
  isGlobalSmartAlert,
  ...props
}) {
  const [state, dispatch] = useReducer(listReducer, {}, () => {
    if (isEmpty(applicationsSelection) && alertApplicationId && !isGlobalSmartAlert) {
      return getNewStateWithApplication(applicationsSelection, alertApplicationId, {
        inclusive: true,
        services: {}
      });
    }

    const newState = {};
    for (const [applicationId, application] of Object.entries(applicationsSelection)) {
      newState[applicationId] = {
        ...application,
        explicitSelectionOnly: true
      };
    }
    return newState;
  });

  useEffect(() => {
    onChange?.(state);
    // since onChange func can be re-created when parent rerenders we only want to trigger the effect if  state changes
    // otherwise it could happen that we get an infinite rendering loop if parent forgets to use useCallback hook.
    // Since this can happen very likely it is better to disable the linter rule here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const timeConfig = useTimeConfig();

  return (
    <ApplicationsList
      {...props}
      {...apiSubscriptions}
      isGlobalSmartAlert={isGlobalSmartAlert}
      alertApplicationId={alertApplicationId}
      initialApplicationSelection={applicationsSelection}
      stateManagement={{ state, dispatch }}
      timeConfig={timeConfig}
    />
  );
}

function ApplicationsList({
  getApplicationsCursorPaginated,
  getApplication,
  isGlobalSmartAlert,
  alertApplicationId,
  ...props
}) {
  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      isGlobalSmartAlert
        ? getApplicationsCursorPaginated({
            pagination: {
              cursor,
              retrievalSize: DEFAULT_PAGE_SIZE
            },
            order: {
              by: 'applicationLabel',
              direction: 'ASC'
            },
            metrics: {},
            filter: {
              timeConfig: props.timeConfig,
              includeSyntheticCalls: true
            }
          })
        : getApplication({ id: alertApplicationId }).map(({ data }) => ({
            items: data ? [{ application: data }] : []
          })),
    []
  );

  const { state } = props.stateManagement;

  const listData = useMemo(() => {
    const enrichedApplications = items.map(({ application, ...rest }) => ({ ...rest, item: application }));
    enrichListWithStaleSelectionData(Object.entries(state), enrichedApplications);
    return enrichedApplications;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <SharedList
      {...props}
      {...tableProps}
      listData={listData}
      renderSubList={({ applicationId }) => () => {
        return <ServicesList {...props} parentIds={{ applicationId }} />;
      }}
      type={types.APPLICATION}
      isLoading={items.length === 0}
    />
  );
}

function ServicesList({ getServicesCursorPaginated, parentIds, ...props }) {
  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getServicesCursorPaginated({
        pagination: {
          cursor,
          retrievalSize: DEFAULT_PAGE_SIZE
        },
        order: {
          by: 'serviceLabel',
          direction: 'ASC'
        },
        metrics: {},
        filter: {
          application: parentIds.applicationId,
          applicationBoundaryScope: props.boundaryScope,
          timeConfig: props.timeConfig
        }
      }),
    []
  );

  const listData = useMemo(() => {
    const enrichedServices = items.map(({ service, ...rest }) => ({ ...rest, item: service }));
    enrichListWithStaleSelectionData(
      Object.entries(props.stateManagement.state[parentIds.applicationId]?.services ?? {}),
      enrichedServices
    );
    return enrichedServices;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <SharedList
      {...props}
      {...tableProps}
      parentIds={parentIds}
      listData={listData}
      renderSubList={({ applicationId, serviceId }) => () => (
        <EndpointsList {...props} parentIds={{ applicationId, serviceId }} />
      )}
      type={types.SERVICE}
      isLoading={items.length === 0}
    />
  );
}

function EndpointsList({ getEndpointsCursorPaginated, parentIds, ...props }) {
  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getEndpointsCursorPaginated({
        pagination: {
          cursor,
          retrievalSize: DEFAULT_PAGE_SIZE
        },
        order: {
          by: 'endpointLabel',
          direction: 'ASC'
        },
        filter: {
          application: parentIds.applicationId,
          service: parentIds.serviceId,
          applicationBoundaryScope: props.boundaryScope,
          timeConfig: props.timeConfig,
          includeSyntheticCalls: true
        },
        metrics: {}
      }),
    []
  );

  const listData = useMemo(() => {
    const enrichedEndpoints = items.map(({ endpoint, ...rest }) => ({ ...rest, item: endpoint }));
    enrichListWithStaleSelectionData(
      Object.entries(
        props.stateManagement.state[parentIds.applicationId]?.services[parentIds.serviceId]?.endpoints ?? {}
      ),
      enrichedEndpoints
    );
    return enrichedEndpoints;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <SharedList
      {...props}
      {...tableProps}
      listData={listData}
      type={types.ENDPOINT}
      parentIds={parentIds}
      isLoading={items.length === 0}
    />
  );
}

function enrichListWithStaleSelectionData(userSelectedItemsEntries, listData) {
  userSelectedItemsEntries.forEach(([key, value]) => {
    if (!listData.some(it => it.item.id == key)) {
      listData.push({ item: { ...value, label: key, isStaleItem: true } });
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
    getApplicationsCursorPaginated: PropTypes.func.isRequired,
    getApplication: PropTypes.func.isRequired,
    getServicesCursorPaginated: PropTypes.func.isRequired,
    getEndpointsCursorPaginated: PropTypes.func.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  applicationsSelection: applicationsItemTreePropType,
  alertApplicationId: PropTypes.string,
  isGlobalSmartAlert: PropTypes.bool
};
