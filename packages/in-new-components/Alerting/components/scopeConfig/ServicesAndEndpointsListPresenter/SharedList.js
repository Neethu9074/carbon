/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo, useRef } from 'react';
import { isEmpty } from 'lodash';
import { t } from 'in-i18n';

import {
  getApplication,
  getEndpoint,
  getService
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { Ul, Li, ColumnizedContent } from 'in-new-components/lists/List';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Tooltip from 'in-components/Tooltip';

import locals from './SharedList.mless';

const iconType = {
  APPLICATION: 'lib_application',
  SERVICE: 'lib_application_service',
  ENDPOINT: 'lib_application_endpoint'
};

const columnDefinitions = [
  {
    width: '3rem',
    getContent({ checked, indeterminate, onChange, virtuallyChecked }) {
      return (
        <CheckboxFancy
          onChange={onChange}
          checked={checked}
          indeterminate={indeterminate}
          size="large"
          className={virtuallyChecked ? locals.greyCheckbox : null}
        />
      );
    }
  },
  {
    getContent({ label, type, isStaleItem }) {
      return (
        <Tooltip
          content={
            isStaleItem ? (
              <span>
                {t('in-new-components:alerting.components.sharedListTooltip', { typeName: type.toLowerCase() })}
              </span>
            ) : null
          }
        >
          <IconLabel text={label} type={iconType[type]} noBottomMargin />
        </Tooltip>
      );
    }
  }
];

export const types = {
  APPLICATION: 'APPLICATION',
  SERVICE: 'SERVICE',
  ENDPOINT: 'ENDPOINT'
};

export default function SharedList({
  listData,
  renderSubList,
  type,
  parentIds = {},
  stateManagement = {},
  canLoadMore,
  loadMore,
  isLoading
}) {
  const { state, dispatch } = stateManagement;
  const checkedObjectIdRef = useRef(null);
  const list = useSortList(type, state, listData, parentIds);

  return (
    <Ul>
      {!isLoading &&
        list.map(({ item: { id, label, isStaleItem } }) => {
          const itemTreeIds = enhanceWithIdForType(type, id, parentIds);
          const _hasChildren = hasChildren(type, state, itemTreeIds);
          const _isChecked = isChecked(type, state, itemTreeIds);
          const _isImplicitlyChecked = isImplicitlyChecked(type, state, itemTreeIds);

          return (
            <Li
              key={id}
              renderNestedContent={renderSubList?.(itemTreeIds)}
              toggleContentOnRowClick={Boolean(renderSubList)}
              className={id === checkedObjectIdRef.current ? locals.last : undefined}
            >
              <ColumnizedContent
                isStaleItem={Boolean(isStaleItem)}
                columnDefinitions={columnDefinitions}
                label={label}
                type={type}
                checked={_hasChildren ? null : _isImplicitlyChecked || _isChecked}
                indeterminate={_hasChildren}
                virtuallyChecked={!_isChecked && _isImplicitlyChecked}
                onChange={() => {
                  checkedObjectIdRef.current = id;
                  if (shouldAddItem(type, state, _isChecked, _isImplicitlyChecked, itemTreeIds)) {
                    dispatch({
                      type: `ADD_${type}`,
                      ...itemTreeIds,
                      inclusive: !_isImplicitlyChecked,
                      explicitSelectionOnly: getApplication(state, itemTreeIds.applicationId) === undefined
                    });
                  } else {
                    dispatch({ type: `REMOVE_${type}`, ...itemTreeIds });
                  }
                }}
              />
            </Li>
          );
        })}
      {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      {isLoading && <LoadingList numSkeletonRows={3} />}
      {!isLoading && (!listData || listData.length === 0) && <NoDataAvailable height={240} />}
    </Ul>
  );
}

function useSortList(type, state, listData, parentIds) {
  const enhancedList = useMemo(() => {
    const { applicationId, serviceId } = parentIds;

    const itemsUserInteractedWith = listData.filter(({ item: { id } }) => {
      if (type === types.APPLICATION) {
        const application = getApplication(state, id);
        return Boolean(application);
      }

      if (type === types.SERVICE) {
        const service = getService(getApplication(state, applicationId), id);
        return Boolean(service);
      }

      if (type === types.ENDPOINT) {
        const endpoint = getEndpoint(getService(getApplication(state, applicationId), serviceId), id);
        return Boolean(endpoint);
      }
    });
    const itemsInDefaultState = listData.filter(listItem => !itemsUserInteractedWith.includes(listItem));
    return [...itemsUserInteractedWith, ...itemsInDefaultState];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, listData]);

  return enhancedList ?? listData;
}

function enhanceWithIdForType(type, id, parentIds) {
  if (type === types.APPLICATION) {
    return { applicationId: id };
  }
  if (type === types.SERVICE) {
    return { ...parentIds, serviceId: id };
  }
  if (type === types.ENDPOINT) {
    return { ...parentIds, endpointId: id };
  }
}

function hasChildren(type, state, itemTreeIds) {
  const { applicationId, serviceId } = itemTreeIds;

  const application = getApplication(state, applicationId);
  if (type === types.APPLICATION) {
    return !isEmpty(application?.services);
  }

  const service = getService(application, serviceId);
  if (type === types.SERVICE) {
    return !isEmpty(service?.endpoints);
  }

  if (type === types.ENDPOINT) {
    return false;
  }
}

function isImplicitlyChecked(type, state, itemTreeIds) {
  const { applicationId, serviceId, endpointId } = itemTreeIds;

  const application = getApplication(state, applicationId);
  const isApplicationDeselected = !application || application?.inclusive === false;
  if (isApplicationDeselected) {
    return false;
  }

  const service = getService(application, serviceId);
  const isServiceDeselected = service && service?.inclusive === false;
  if (isServiceDeselected) {
    return false;
  }

  const endpoint = getEndpoint(service, endpointId);
  const isEndpointDeselected = endpoint && endpoint?.inclusive === false;
  if (isEndpointDeselected) {
    return false;
  }

  if (type === types.APPLICATION) {
    return false;
  }

  if (type === types.SERVICE) {
    const explicitSelectionOnly = application.explicitSelectionOnly;

    const applicationContainsExplictlySelectedServices = Object.values(application?.services ?? {}).some(
      ({ inclusive }) => inclusive === true
    );

    if (explicitSelectionOnly && applicationContainsExplictlySelectedServices) {
      return false;
    }
  }

  if (type === types.ENDPOINT) {
    const explicitSelectionOnly = application.explicitSelectionOnly;

    if (explicitSelectionOnly) {
      const parentServiceExplictlySelected = service?.inclusive === true;
      if (!parentServiceExplictlySelected) return false;
    }

    if (endpoint?.inclusive) {
      return false;
    }

    const serviceContainsExplictlySelectedEndpoints = Object.values(service?.endpoints ?? {}).some(
      ({ inclusive }) => inclusive === true
    );

    if (serviceContainsExplictlySelectedEndpoints) {
      return false;
    }
  }

  return true;
}

function isChecked(type, state, itemTreeIds) {
  const { applicationId, serviceId, endpointId } = itemTreeIds;

  const application = getApplication(state, applicationId);
  if (type === types.APPLICATION) {
    return Boolean(application?.inclusive);
  }

  const service = getService(application, serviceId);
  if (type === types.SERVICE) {
    return Boolean(service?.inclusive);
  }

  const endpoint = getEndpoint(service, endpointId);
  if (type === types.ENDPOINT) {
    return Boolean(endpoint?.inclusive);
  }
}

function shouldAddItem(type, state, isChecked, isImplicitlyChecked, itemTreeIds) {
  const { applicationId, serviceId, endpointId } = itemTreeIds;
  const implicit = !isChecked && isImplicitlyChecked;
  const unchecked = !isChecked && !isImplicitlyChecked;
  let isExplicitlyExcluded = true;

  const application = getApplication(state, applicationId);
  if (type === types.APPLICATION) {
    isExplicitlyExcluded = application?.inclusive === false;
  }

  const service = getService(application, serviceId);
  if (type === types.SERVICE) {
    isExplicitlyExcluded = service?.inclusive === false;
  }

  const endpoint = getEndpoint(service, endpointId);
  if (type === types.ENDPOINT) {
    isExplicitlyExcluded = endpoint?.inclusive === false;
  }

  return (implicit || unchecked) && !isExplicitlyExcluded;
}
