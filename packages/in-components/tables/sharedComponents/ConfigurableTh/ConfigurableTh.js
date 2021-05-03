/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import { Th, SortableTh } from 'in-components/tables/sharedComponents';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { compareIgnoreCase } from 'in-services/util/string';
import Overlay from 'in-new-components/overlays/Overlay';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import { t } from 'in-i18n';

import locals from './ConfigurableTh.mless';

export default function ConfigurableTh(props) {
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

  const wrapContent = content => <ConfigureButton {...props}>{content}</ConfigureButton>;

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
      isSortedByThisColumn={isSortedByThisColumn}
      sortDirection={sortDirection}
      onClick={onClick}
      wrapContent={wrapContent}
    >
      {children}
    </SortableTh>
  );
}

function ConfigureButton({ availableColumnDefinitions, columnDefinitions, children, onColumnChecked }) {
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
        {Component}
      </Overlay>
    </div>
  );
}
function Component({ toggle, refSetter }) {
  return (
    <Button className={locals.button} kind="secondary" onClick={toggle} refSetter={refSetter}>
      <SvgIcon type="lib_actions_settings" />
    </Button>
  );
}

function Content({ availableColumnDefinitions, columnDefinitions, onColumnChecked }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  useDisabledBodyScroll();
  const currentIds = columnDefinitions.map(def => def.id);
  const pageSize = availableColumnDefinitions.length < 15 ? availableColumnDefinitions.length : 10;

  const filteredDefinitions = availableColumnDefinitions
    .filter(def => def.label.toLowerCase().includes(query.toLowerCase()))
    .sort(compareCheckedAndLabel(currentIds));

  const numPages = Math.ceil(filteredDefinitions.length / pageSize);
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
              <CheckboxFancy
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
        <Pagination currentPage={page} numPages={numPages} onChange={setPage} />
      )}
    </div>
  );
}

function SearchBar({ query, placeholder, onChange }) {
  return (
    <div className={locals.search}>
      <SearchInput query={query} placeholder={placeholder} onChange={query => onChange(query)} />
    </div>
  );
}

function compareCheckedAndLabel(selectedIds) {
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

function isDisabled(def) {
  return !def.optional;
}

function isEnabled(selectedIds, def) {
  return selectedIds.indexOf(def.id) >= 0;
}

function isChecked(selectedIds, def) {
  return isDisabled(def) || isEnabled(selectedIds, def);
}
