/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon, Stack, Select } from '@instana/components';
import { just } from '@instana/observables';

import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './PermissionsList.mless';

const SHOW_ALL = t('in-settings:tabs.showAll');

const defaultColumnDefinitions = [
  {
    id: 'permission',
    label: t('in-settings:tabs.permission'),
    getContent({ label, description }) {
      return (
        <Stack gap="xsmall" direction="horizontal" align="center">
          <span>{label}</span>
          {description && (
            <Tooltip content={description} align="auto">
              <SvgIcon type="lib_help_error_info_outline" size="s" />
            </Tooltip>
          )}
        </Stack>
      );
    }
  },
  {
    id: 'category',
    width: 24,
    label: t('in-settings:tabs.category'),
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
      title={t('in-settings:tabs.permissions')}
      getHeader={() => t('in-settings:tabs.permissions')}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      loadEntities={() => just(permissions)}
      initialOrderBy="category"
      isSearchable
      searchAttributes={['label', 'category']}
      searchPlaceholder={t('in-settings:tabs.filterPermissions')}
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
  return t('in-settings:tabs.permissionEntityLabel', { entityLabel: entity.label });
}
