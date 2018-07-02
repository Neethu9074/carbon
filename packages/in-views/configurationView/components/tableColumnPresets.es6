import React from 'react';

import DeleteButton from 'in-views/configurationView/components/DeleteButton';
import { compareIgnoreCase } from 'in-services/util/string';
import Button from 'in-components/Button';
import Badge from 'in-components/Badge';
import Link from 'in-components/Link';

export function getLinkColumn(getLink, propertyName = 'name', linkParams) {
  return {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getLink(row.key, linkParams).map(href => {
          return {
            value: row.entity.get(propertyName),
            content: <Link href={href}>{row.entity.get(propertyName)}</Link>
          };
        });
      }
    }
  };
}

export function getLinkColumnWithBadge(getLink, badgeCheck, badgeContent, propertyName = 'name') {
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
              <Link href={href}>
                {row.entity.get(propertyName)} {badgeCheck(row.entity) && <Badge size="sm">{badgeContent}</Badge>}
              </Link>
            )
          };
        });
      }
    }
  };
}

export function getEnableToggleColumn(isEnabledCallback) {
  return {
    title: 'Enabled',
    type: 'boolean',
    width: 80,
    typeArgs: {
      getValue(row) {
        return isEnabledCallback ? isEnabledCallback(row.entity) : row.entity.get('enabled', false);
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
    width: 80,
    disableSorting: true,
    typeArgs: {
      get(row) {
        return {
          value: 0,
          content:
            row.hideDeleteButton == null || !row.hideDeleteButton ? (
              <DeleteButton itemName={row.entity.get(propertyName)} onDelete={() => row.onDelete(row.entity)} />
            ) : null
        };
      }
    }
  };
}

export function getCloneButtonColumn() {
  return {
    title: '',
    type: 'custom',
    width: 80,
    disableSorting: true,
    typeArgs: {
      get(row) {
        return {
          value: 0,
          content: (
            <Button size="sm" kind="info" onClick={() => row.onClone(row.entity)}>
              Clone
            </Button>
          )
        };
      }
    }
  };
}
