import React from 'react';

import DeleteButton from 'in-views/configurationView/components/DeleteButton';
import SavingToggle from 'in-views/configurationView/components/SavingToggle';
import { compareIgnoreCase } from 'in-services/util/string';
import { always } from 'in-services/fixedStreams';

export function getLinkColumn(getLink, propertyName = 'name') {
  return {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        return getLink(row.key).map(href => {
          return {
            value: row.entity.get(propertyName),
            content: (
              <a href={href}>
                {row.entity.get(propertyName)}
              </a>
            )
          };
        });
      }
    }
  };
}

export function getEnableToggleColumn() {
  return {
    title: 'Enabled',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      comparator: (a, b) => (a === b ? -1 : 1),
      get(row) {
        return always({
          value: row.entity.get('enabled', false),
          content: (
            <SavingToggle
              checked={row.entity.get('enabled', false)}
              onChange={value => row.setEnabled(row.entity, value)}
              status={row.status}
            />
          )
        });
      }
    }
  };
}

export function getDeleteButtonColumn(propertyName = 'name') {
  return {
    title: '',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      comparator: () => 0,
      get(row) {
        return always({
          value: 0,
          content: <DeleteButton itemName={row.entity.get(propertyName)} onDelete={() => row.onDelete(row.entity)} />
        });
      }
    }
  };
}
