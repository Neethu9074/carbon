import React from 'react';

import DeleteButton from 'in-views/configurationView/components/DeleteButton';
import { compareIgnoreCase } from 'in-services/util/string';

export function getLinkColumn(getLink, propertyName = 'name') {
  return {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
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
    type: 'boolean',
    typeArgs: {
      getValue(row) {
        return row.entity.get('enabled', false);
      },
      onChange(row, newValue) {
        row.setEnabled(row.entity, newValue);
      },
      getStatus(row) {
        return row.status;
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
        return {
          value: 0,
          content: <DeleteButton itemName={row.entity.get(propertyName)} onDelete={() => row.onDelete(row.entity)} />
        };
      }
    }
  };
}
