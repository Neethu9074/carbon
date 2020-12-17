import React from 'react';

import { Ul, Li, ColumnizedContent } from 'in-new-components/lists/List';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Tooltip from 'in-components/Tooltip';

const iconType = {
  APPLICATION: 'lib_application',
  SERVICE: 'lib_application_service',
  ENDPOINT: 'lib_application_endpoint'
};

const columnDefinitions = [
  {
    width: '3rem',
    getContent({ checked, indeterminate, onChange }) {
      return <CheckboxFancy onChange={onChange} checked={checked} indeterminate={indeterminate} size="large" />;
    }
  },
  {
    getContent({ label, type, itemState = {} }) {
      const { isStaleItem, typeName } = itemState;
      return (
        <Tooltip content={isStaleItem ? `Selected ${typeName} is not available anymore` : null}>
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
  initialApplicationSelection
}) {
  const { state, dispatch } = stateManagement;

  return (
    <Ul>
      {listData.map(({ item: { id, label } }) => {
        const itemTreeIds = enhanceWithIdForType[type](id, parentIds);
        const itemState = getStaleItemState[type](id, initialApplicationSelection, itemTreeIds);
        const _isChecked = isChecked[type](state, itemTreeIds);
        const _hasChildren = hasChildren[type](id, state, itemTreeIds);

        return (
          <Li key={id} renderNestedContent={renderSubList?.(itemTreeIds)} toggleContentOnRowClick>
            <ColumnizedContent
              itemState={itemState}
              columnDefinitions={columnDefinitions}
              label={label}
              type={type}
              checked={_hasChildren ? null : _isChecked}
              indeterminate={_hasChildren}
              onChange={() => {
                if (_isChecked) {
                  dispatch({ type: `REMOVE_${type}`, ...itemTreeIds });
                } else {
                  dispatch({ type: `ADD_${type}`, ...itemTreeIds });
                }
              }}
            />
          </Li>
        );
      })}
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
