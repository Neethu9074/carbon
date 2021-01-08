import { just } from '@instana/observables';
import React, { useState } from 'react';

import List from 'in-settings/components/List';
import Select from 'in-components/form/Select';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './PermissionsList.mless';

const SHOW_ALL = 'Show all';

const defaultColumnDefinitions = [
  {
    id: 'description',
    width: 3,
    getContent({ description }) {
      return (
        <Tooltip content={description} align="rightMiddle">
          <SvgIcon type="lib_help_error_info_outline" size="s" />
        </Tooltip>
      );
    }
  },
  {
    id: 'permission',
    label: 'Permission',
    width: 35,
    getContent({ label }) {
      return label;
    }
  },
  {
    id: 'category',
    label: 'Category',
    getContent({ category }) {
      return category;
    }
  }
];

export default function PermissionsList({ permissions, listActions }) {
  let columnDefinitions = defaultColumnDefinitions;
  if (listActions) {
    columnDefinitions = columnDefinitions.concat(listActions);
  }

  const [category, setCategory] = useState(null);

  return (
    <List
      title="Permissions"
      getHeader={() => 'Permissions'}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      loadEntities={() => just(permissions)}
      initialOrderBy="category"
      isSearchable
      searchAttributes={['label', 'category']}
      searchPlaceholder="Filter Permissions…"
      searchMaxWidth={210}
      pageSize={50}
      extraFilters={createFilters(category)}
      rightHeader={permissionListRightHeader(category, setCategory, permissions)}
    />
  );
}

function createFilters(category) {
  const filters = [];

  if (category && category != SHOW_ALL) {
    filters.push(entity => entity.category === category);
  }

  return filters;
}

function permissionListRightHeader(category, setCategory, productPermissions) {
  const options = [...new Set(productPermissions.map(permission => permission.category))].map(category => {
    return {
      value: category,
      label: category
    };
  });

  return (
    <Select
      id="filter-category"
      value={category ? category : ''}
      onChange={e => (e.target ? setCategory(e.target.value) : setCategory(null))}
      wrapperClassName={locals.categoryFilter}
    >
      <option key={null} value={null}>
        {SHOW_ALL}
      </option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}

function getEntityName(entity) {
  return `permission ${entity.label}`;
}
