/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo, useRef } from 'react';
import { isEmpty } from 'lodash';
import { t } from 'in-i18n';

import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { Ul, Li, ColumnizedContent } from 'in-new-components/lists/List';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { compareIgnoreCase } from 'in-services/util/string';
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
    getContent({ label, type, itemState = {} }) {
      const { isStaleItem, typeName } = itemState;

      return (
        <Tooltip
          content={
            isStaleItem ? t('in-new-components:alerting.components.sharedListTooltip', { typeName: typeName }) : null
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
  parentIds,
  stateManagement,
  initialApplicationSelection,
  canLoadMore,
  loadMore,
  isLoading
}) {
  const { state, dispatch } = stateManagement;
  const checkedObjectIdRef = useRef(null);

  // TODO: double check performance of this function. I couldn't test it on a bigger data set now (Fr.Jan 8, 2021)
  const list = useMemo(() => {
    const listDataWithCheckedState = listData.map(element => {
      const { item } = element;
      return { ...element, isChecked: isChecked[type](state, enhanceWithIdForType[type](item.id, parentIds)) };
    });

    const checkedElements = listDataWithCheckedState
      .filter(({ isChecked }) => isChecked)
      .sort((a, b) => compareIgnoreCase(a.item.label, b.item.label));

    const uncheckedElements = listDataWithCheckedState
      .filter(({ isChecked }) => !isChecked)
      .sort((a, b) => compareIgnoreCase(a.item.label, b.item.label));

    return listDataWithCheckedState.length > 0 ? [...checkedElements, ...uncheckedElements] : listData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, listData]);

  return (
    <Ul>
      {!isLoading &&
        list.map(({ item: { id, label }, isChecked }, i) => {
          const itemTreeIds = enhanceWithIdForType[type](id, parentIds);
          const itemState = getStaleItemState[type](id, initialApplicationSelection, itemTreeIds);
          const _hasChildren = hasChildren[type](id, state, itemTreeIds);
          const _isVirtuallyChecked = isVirtuallyChecked(state, itemTreeIds, type);

          return (
            <Li
              key={`${id}${i}`}
              renderNestedContent={renderSubList?.(itemTreeIds)}
              toggleContentOnRowClick={Boolean(renderSubList)}
              className={id === checkedObjectIdRef.current ? locals.last : undefined}
            >
              <ColumnizedContent
                itemState={itemState}
                columnDefinitions={columnDefinitions}
                label={label}
                type={type}
                checked={_hasChildren ? null : _isVirtuallyChecked || isChecked}
                indeterminate={_hasChildren}
                virtuallyChecked={_isVirtuallyChecked}
                onChange={() => {
                  if (isChecked) {
                    dispatch({ type: `REMOVE_${type}`, ...itemTreeIds });
                  } else {
                    checkedObjectIdRef.current = id;
                    dispatch({ type: `ADD_${type}`, ...itemTreeIds });
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

const enhanceWithIdForType = {
  [types.APPLICATION]: applicationId => ({ applicationId }),
  [types.SERVICE]: (serviceId, parentIds) => ({ ...parentIds, serviceId }),
  [types.ENDPOINT]: (endpointId, parentIds) => ({ ...parentIds, endpointId })
};

const isChecked = {
  [types.APPLICATION]: (state, parentIds) => {
    return Boolean(state[parentIds.applicationId]);
  },
  [types.SERVICE]: (state, parentIds) => {
    return Boolean(state[parentIds.applicationId]?.services[parentIds.serviceId]);
  },
  [types.ENDPOINT]: (state, parentIds) => {
    return Boolean(state[parentIds.applicationId]?.services[parentIds.serviceId]?.endpoints[parentIds.endpointId]);
  }
};

const hasChildren = {
  [types.APPLICATION]: (id, state) => {
    return Object.keys(state[id]?.services ?? {}).length > 0;
  },
  [types.SERVICE]: (id, state, parentIds) => {
    return Object.keys(state[parentIds.applicationId]?.services[id]?.endpoints ?? {}).length > 0;
  },
  [types.ENDPOINT]: () => false
};

const getStaleItemState = {
  [types.APPLICATION]: (id, initialApplicationSelection) => {
    const isStaleItem = (initialApplicationSelection ?? {}).hasOwnProperty(id);
    return { isStaleItem, typeName: 'Application' };
  },
  [types.SERVICE]: (id, initialApplicationSelection, parentIds) => {
    const isStaleItem = (initialApplicationSelection[parentIds.applicationId]?.services ?? {}).hasOwnProperty(id);
    return { isStaleItem, typeName: 'Service' };
  },
  [types.ENDPOINT]: (id, initialApplicationSelection, parentIds) => {
    const isStaleItem = (
      initialApplicationSelection[parentIds.applicationId]?.services[parentIds.serviceId]?.endpoints ?? {}
    ).hasOwnProperty(id);
    return { isStaleItem, typeName: 'Endpoint' };
  }
};

function isVirtuallyChecked(state, itemTreeIds, type) {
  const services = state[itemTreeIds?.applicationId]?.services;
  if (type === types.SERVICE) {
    return isEmpty(services);
  }
  if (type === types.ENDPOINT) {
    const endpoints = services?.[itemTreeIds?.serviceId]?.endpoints;
    return (isEmpty(services) && isEmpty(endpoints)) || (!!services?.[itemTreeIds?.serviceId] && isEmpty(endpoints));
  }
  return false;
}
