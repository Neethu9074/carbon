/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SearchInput, Checkbox, CarbonIconButton, SvgIcon, Pagination } from '@instana/components';
import { Th, SortableTh } from '@instana/legacy';

import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { compareIgnoreCase } from 'in-services/util/string';
import { OrderDirection, SortComparator } from 'in-types';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './ConfigurableTh.mless';

interface ConfigurableThProps<ItemType extends Object> extends Omit<ConfigurableButtonProps<ItemType>, 'children'> {
  sortDirection: OrderDirection;
  onClick: React.EventHandler<React.MouseEvent<Element, MouseEvent>>;
  children: React.ReactNode;
  width?: number | string;
  widthInAbsoluteUnit?: boolean;
  className?: string;
  sortable?: boolean;
  isSortedByThisColumn?: boolean;
  noWrap?: boolean;
}

export default function ConfigurableTh<ItemType extends Object>(props: ConfigurableThProps<ItemType>) {
  const {
    isSortedByThisColumn,
    sortDirection,
    onClick,
    children,
    sortable,
    className,
    noWrap,
    width,
    widthInAbsoluteUnit
  } = props;

  const wrapContent = (content: React.ReactNode) => <ConfigureButton {...props}>{content}</ConfigureButton>;

  if (sortable === false) {
    return (
      <Th
        className={className}
        noWrap={noWrap}
        width={width}
        widthInAbsoluteUnit={widthInAbsoluteUnit}
        wrapContent={wrapContent}
      >
        {children}
      </Th>
    );
  }

  return (
    <SortableTh
      {...props}
      isSortedByThisColumn={isSortedByThisColumn ?? false}
      sortDirection={sortDirection}
      onClick={onClick}
      wrapContent={wrapContent}
    >
      {children}
    </SortableTh>
  );
}

interface ConfigurableButtonProps<ItemType extends Object> extends ContentProps<ItemType> {
  children?: React.ReactNode;
}

export function ConfigureButton<ItemType extends Object>({
  availableColumnDefinitions,
  columnDefinitions,
  children,
  onColumnChecked
}: ConfigurableButtonProps<ItemType>) {
  return (
    <div className={locals.wrapper}>
      {children}
      <Overlay
        withoutWrapper
        align="bottomRight"
        forceConfiguredAlignment
        content={Content}
        props={{ availableColumnDefinitions, columnDefinitions, onColumnChecked }}
      >
        {({ toggle, refSetter, isOpen }) => (
          <CarbonIconButton
            aria-label={t('in-components:tables.sharedComponents.settings')}
            aria-haspopup="true"
            aria-expanded={isOpen}
            label={t('in-components:tables.sharedComponents.settings')}
            kind="ghost"
            onClick={toggle}
            ref={refSetter}
          >
            <SvgIcon type="lib_actions_settings" size="xs" />
          </CarbonIconButton>
        )}
      </Overlay>
    </div>
  );
}

interface ContentProps<ItemType extends Object> {
  availableColumnDefinitions: ColumnDefinition<ItemType>[];
  columnDefinitions: ColumnDefinition<ItemType>[];
  onColumnChecked: (id: string, isEnabled: boolean) => void;
}

function Content<ItemType extends Object>({
  availableColumnDefinitions,
  columnDefinitions,
  onColumnChecked
}: ContentProps<ItemType>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  useDisabledBodyScroll();
  const currentIds = columnDefinitions.map(def => def.id);
  const pageSize = availableColumnDefinitions.length < 15 ? availableColumnDefinitions.length : 10;

  const filteredDefinitions = availableColumnDefinitions
    .filter(def => def.label.toLowerCase().includes(query.toLowerCase()))
    .sort(compareCheckedAndLabel(currentIds));

  const paginatedDefinitions = filteredDefinitions.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className={locals.overlay}>
      {availableColumnDefinitions.length > pageSize && (
        <SearchBar
          query={query}
          placeholder={t('in-components:tables.sharedComponents.configurableThSearchItemPlaceholder', {
            len: availableColumnDefinitions.length
          })}
          onChange={q => {
            setQuery(q);
            setPage(1);
          }}
        />
      )}
      <ul className={locals.list}>
        {paginatedDefinitions.map(columnDefinition => {
          const { id, optional, label, renderLabel } = columnDefinition;
          const isDisabled = !optional;
          const isEnabled = currentIds.indexOf(id) >= 0;
          return (
            <li key={id} className={locals.item}>
              <Checkbox
                labelClassName={locals.label}
                checked={isDisabled || isEnabled}
                disabled={isDisabled}
                onChange={() => onColumnChecked(id, !isEnabled)}
                label={renderLabel ? renderLabel(columnDefinition) : label}
                size="large"
              />
            </li>
          );
        })}
      </ul>
      {filteredDefinitions.length == 0 && (
        <NoDataAvailable
          className={locals.empty}
          text={t('in-components:tables.sharedComponents.configurableThNoMatchesTxt')}
        />
      )}
      {filteredDefinitions.length > pageSize && (
        <Pagination
          className={locals.pagination}
          currentPage={page}
          totalItems={filteredDefinitions.length}
          pageSize={pageSize}
          pageSizes={[pageSize]}
          onChange={p => setPage(p.page)}
          size="sm"
          itemsPerPageText=""
        />
      )}
    </div>
  );
}

interface SearchBarProps {
  query?: string;
  placeholder?: string;
  onChange: (query: string) => void;
}

function SearchBar({ query, placeholder, onChange }: SearchBarProps) {
  return (
    <div className={locals.search}>
      <SearchInput query={query} placeholder={placeholder} onChange={query => onChange(query)} />
    </div>
  );
}

function compareCheckedAndLabel(selectedIds: string[]): SortComparator<ColumnDefinition<never>> {
  return (defA, defB) => {
    const aIsChecked = isChecked(selectedIds, defA);
    const bIsChecked = isChecked(selectedIds, defB);
    if (aIsChecked === bIsChecked) {
      return compareIgnoreCase(defA.label, defB.label);
    } else if (aIsChecked) {
      return -1;
    } else {
      return 1;
    }
  };
}

function isDisabled(def: ColumnDefinition<never>): boolean {
  return !def.optional;
}

function isEnabled(selectedIds: string[], def: ColumnDefinition<never>): boolean {
  return selectedIds.indexOf(def.id) >= 0;
}

function isChecked(selectedIds: string[], def: ColumnDefinition<never>): boolean {
  return isDisabled(def) || isEnabled(selectedIds, def);
}
