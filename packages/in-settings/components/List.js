/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find, get, isEqual, reverse, sortBy } from 'lodash';
import { compose, lifecycle, withState } from 'recompose';
import React, { Fragment, forwardRef } from 'react';
import { createLogger } from '@instana/logger';
import { create } from '@instana/observables';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { noop, stopPropagationAndPreventDefault } from 'in-services/util/function';
import { getModifiedUrlStream, goToPath } from 'in-stores/navigation';
import TemporaryMessage from 'in-components/TemporaryMessage';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Delete from 'in-settings/components/actions/Delete';
import { arrayToResult } from 'in-services/util/result';
import ListTitle from 'in-new-components/lists/Title';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './List.mless';

const logger = createLogger('SettingsList');

const reloadEntitiesSignal$ = create({
  emitLatestOnSubscribe: false
});
const emptyListOnError$ = create({
  emitLatestOnSubscribe: false
});
const perCellLoadingIndicator$ = create({
  emitLatestOnSubscribe: false
});
function clearPerCellLoadingIndicator() {
  // This is triggered as a side effect the loadEntities() subscription. In rare cases it might trigger a bit too early,
  // showing the old state for a split second. Like any problem, this is easily solved with a little setTimeout.
  setTimeout(() => perCellLoadingIndicator$.emit(null), 500);
}

export default compose(
  withState('errorMessage', 'setErrorMessage', null),
  connectTo(({ loadEntities, setErrorMessage }) => {
    // 1. The `merge(loadEntities())` makes sure loadEntities() is called right at the start, when the component is first
    // rendered
    // 2. The reloadEntitiesSignal$.flatMap(() => loadEntities()) part gives us a hook to trigger a refresh of the
    // entities (for example, if one has been deleted).
    // 3. The merge with emptyListOnError$ gives us a hook to set the list of entities to an empty array in case loading
    // the entities fails (HTTP error etc.)
    // 4. Finally, loadEntities().tap(clearPerCellLoadingIndicator) makes sure the per cell loading indicator
    // (triggered by table actions like toggleEnabled or delete) is cleared when the reload is done.
    const entityObservable = reloadEntitiesSignal$
      .flatMap(() => loadEntities().tap(clearPerCellLoadingIndicator))
      .merge(loadEntities(), emptyListOnError$);
    entityObservable.errors().subscribe(error => {
      const errorMessage = `Failed to load the requested data: ${error.message}`;
      logger.error(errorMessage, error);
      setErrorMessage(errorMessage);
      // emit an empty array of entities when loading the entities results in an error, this makes the table presenter
      // switch from its "loading" state into the "no data available" state.
      emptyListOnError$.emit([]);
    });
    return {
      entities: entityObservable,
      perCellLoadingIndicator: perCellLoadingIndicator$
    };
  }),
  withState('orderByState', 'setOrderBy', ({ initialOrderBy }) => (initialOrderBy ? initialOrderBy : 'name')),
  withState('orderDirectionState', 'setOrderDirection', 'ASC'),
  withState('queryState', 'setQuery', ''),
  withState('pageState', 'setPage', 1),
  lifecycle({
    componentDidUpdate({ extraFilterValues: nextExtraFilterValues }) {
      if (!isEqual(this.props.extraFilterValues, nextExtraFilterValues)) {
        this.props.setPage(1);
      }
    }
  })
)(List);

function List({
  title,
  getHeader,
  getCustomHeader,
  getEntityName,
  getDetailsHref,
  onRowClick,
  columnDefinitions,
  tableActions = {},
  onCreateNew,
  labelNew,
  pathNew,
  newButtonDisabledTooltipMessage = () => null,
  cardTitle,
  tableInCard,
  rightHeader,
  isSearchable = true,
  searchAttributes = [],
  extraFilters,
  searchPlaceholder,
  searchMaxWidth,
  entities,
  noDataMessage,
  renderNoDataAvailable,
  pageSize = 20,
  pageState,
  setPage,
  hideWhenEmpty,
  orderByState,
  setOrderBy,
  orderDirectionState,
  setOrderDirection,
  queryState,
  setQuery,
  errorMessage,
  setErrorMessage,
  perCellLoadingIndicator,
  trackEvent,
  customSortEntities
}) {
  if (hideWhenEmpty && (!entities || entities.length === 0)) {
    return null;
  }

  let totalHitsBeforeFilter = 0;
  let totalHitsAfterFilter = 0;
  const newDisabledMessage = entities && newButtonDisabledTooltipMessage(entities);
  let entitiesBeforePagination = entities;
  if (entities) {
    totalHitsBeforeFilter = entities.length;
    if (extraFilters && extraFilters.length > 0) {
      extraFilters.forEach(filter => {
        entities = entities.filter(filter);
      });
    }
    if (!isBlank(queryState) && searchAttributes.length > 0) {
      entities = entities.filter(entity =>
        searchAttributes.reduce(filterReducer.bind(null, queryState, entity), false)
      );
    }
    entities =
      customSortEntities?.({ entities, columnDefinitions, orderByState, orderDirectionState }) ??
      sortEntities(entities, columnDefinitions, orderByState, orderDirectionState);
    totalHitsAfterFilter = entities.length;
    entitiesBeforePagination = entities;
    const offset = (pageState - 1) * pageSize;
    const until = offset + pageSize;
    entities = entities.slice(offset, until);
  }
  const result = arrayToResult(entities, totalHitsAfterFilter, pageSize);

  // const leftHeader = cardTitle == null ? <ListTitle>{header}</ListTitle> : null;

  const leftHeader = selectLeftHeader(
    cardTitle,
    getCustomHeader,
    totalHitsBeforeFilter,
    totalHitsAfterFilter,
    entitiesBeforePagination,
    getHeader
  );

  if (__DEV__) {
    invariant(!(onRowClick && getDetailsHref), 'You cannot specify both, onRowClick and getDetailsHref.');
  }
  if (getDetailsHref) {
    onRowClick = entity => goToPath(getDetailsHref(entity));
  }

  return (
    <div>
      {title && <Title title={title} />}
      {errorMessage && <TemporaryMessage type="error" message={errorMessage} duration={null} />}
      <ServerTablePresenter
        onChange={({ page, query, orderBy, orderDirection }) => {
          setPage(page);
          setOrderBy(orderBy);
          setOrderDirection(orderDirection);
          setQuery(query);
        }}
        columnDefinitions={addTableActions({
          columnDefinitions,
          tableActions,
          perCellLoadingIndicator,
          getEntityName,
          setErrorMessage
        })}
        leftHeader={leftHeader}
        orderBy={orderByState}
        orderDirection={orderDirectionState}
        page={pageState}
        pageSize={pageSize}
        query={queryState}
        isSearchable={isSearchable}
        searchPlaceholder={searchPlaceholder}
        searchMaxWidth={searchMaxWidth}
        result={result}
        noDataMessage={noDataMessage}
        renderNoDataAvailable={renderNoDataAvailable}
        cardTitle={cardTitle}
        tableInCard={tableInCard}
        fixedLayout
        rightHeader={
          rightHeader
            ? rightHeader
            : createNewEntityButton({ labelNew, pathNew, onCreateNew, disabledMessage: newDisabledMessage, trackEvent })
        }
        getRowProps={getRowProps(tableActions)}
        onRowClick={onRowClick}
        allRowsAreSelected={areAllRowsOnCurrentPageSelected(
          entitiesBeforePagination,
          tableActions,
          pageState,
          pageSize
        )}
        setSelectedStateForRows={setSelectedStateForRowsOnCurrentPage(
          entitiesBeforePagination,
          tableActions,
          pageState,
          pageSize
        )}
      />
    </div>
  );
}

function selectLeftHeader(
  cardTitle,
  getCustomHeader,
  totalHitsBeforeFilter,
  totalHitsAfterFilter,
  entitiesBeforePagination,
  getHeader
) {
  return cardTitle == null
    ? getCustomHeader(totalHitsBeforeFilter, totalHitsAfterFilter, entitiesBeforePagination) ?? (
        <ListTitle>{getHeader(totalHitsBeforeFilter, totalHitsAfterFilter, entitiesBeforePagination)}</ListTitle>
      )
    : null;
}

function filterReducer(query, entity, foundMatch, searchAttribute) {
  if (foundMatch) {
    // we already know that this entity matches from another searchAttribute
    return true;
  }
  // searchAttribute can either be
  // 1) a simple string denoting the attribute, or
  // 2) the attribute path in a nested object structure ("attribute1.attribute2"), or
  // 3) an array of strings (also denoting the attribute path in a nested object structure), or
  // 4) a function that receives the entity and yields the value.
  // Cases (1) - (3) are covered by lodash's get function.
  const value = typeof searchAttribute === 'function' ? searchAttribute(entity) : get(entity, searchAttribute);
  return value && value.toUpperCase().indexOf(query.toUpperCase()) >= 0;
}

function sortEntities(entities, columnDefinitions, orderByState, orderDirectionState) {
  let sortIteratee = orderByState;
  const columnDefinition = find(columnDefinitions, definition => definition.id === orderByState);
  if (columnDefinition && columnDefinition.getValue) {
    sortIteratee = columnDefinition.getValue;
  }

  // make sorting case insensitive
  const caseInsensitiveSortIteratee = entity => {
    let value = null;

    if (typeof sortIteratee === 'string') {
      value = entity[sortIteratee];
    } else if (typeof sortIteratee === 'function') {
      value = sortIteratee(entity);
    }
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  };

  const sorted = sortBy(entities, caseInsensitiveSortIteratee);
  if (orderDirectionState === 'DESC') {
    reverse(sorted);
  }
  return sorted;
}

function handleClickCreateNewEntity(onCreateNew, trackEvent) {
  if (onCreateNew) {
    onCreateNew();
  }

  if (trackEvent) {
    trackEvent();
  }
}

export function createNewEntityButton({ labelNew, pathNew, onCreateNew, disabledMessage, trackEvent }) {
  if (!pathNew && !onCreateNew) {
    return null;
  }
  const href$ = onCreateNew ? null : getModifiedUrlStream(p => (p.pathname = pathNew));
  if (disabledMessage) {
    return (
      <Tooltip content={disabledMessage} align="bottomMiddle">
        <NewEntityButton label={labelNew} disabled trackEvent={trackEvent} />
      </Tooltip>
    );
  } else {
    return <NewEntityButton label={labelNew} href$={href$} onCreateNew={onCreateNew} trackEvent={trackEvent} />;
  }
}

const NewEntityButton = forwardRef(function NewEntityButton(
  { label = t('in-settings:components.createNew'), href$, onCreateNew, disabled, trackEvent },
  ref
) {
  return (
    <Button
      className={locals.createNewButton}
      kind="action"
      disabled={disabled}
      href$={href$}
      onClick={() => handleClickCreateNewEntity(onCreateNew, trackEvent)}
      icon="lib_openclose_add_circle_outline"
      ref={ref}
    >
      {label}
    </Button>
  );
});

function addTableActions({ columnDefinitions, tableActions, perCellLoadingIndicator, getEntityName, setErrorMessage }) {
  let allColumns = columnDefinitions;
  if (tableActions.toggleEnabled) {
    allColumns = addToggleEnabledAction(
      allColumns,
      tableActions.toggleEnabled,
      perCellLoadingIndicator,
      setErrorMessage
    );
  }
  if (tableActions.delete) {
    allColumns = addDeleteAction(
      allColumns,
      tableActions.delete,
      perCellLoadingIndicator,
      getEntityName,
      setErrorMessage
    );
  }
  if (tableActions.deselect) {
    allColumns = addDeselectAction(allColumns, tableActions.deselect);
  }
  if (tableActions.selectCheckbox) {
    allColumns = addSelectCheckboxAction(allColumns, tableActions.selectCheckbox);
  }
  return allColumns;
}

function addToggleEnabledAction(columns, actionDefinition, perCellLoadingIndicator, setErrorMessage) {
  return columns.concat({
    id: 'toggleEnabledAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent(entity) {
      if (isCellLoading(perCellLoadingIndicator, entity, 'toggleEnabledAction')) {
        return <TableActionLoadingIndicator />;
      }
      const enabled = actionDefinition.get ? actionDefinition.get(entity) : entity[actionDefinition.key];
      return (
        <Tooltip
          content={enabled ? t('in-settings:components.clickToDisable') : t('in-settings:components.clickToEnable')}
        >
          <SvgIcon
            type={enabled ? 'lib_actions_pause' : 'lib_actions_play'}
            color={theme.lib.colors.primary2}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              doToggleEnabled(entity, enabled, actionDefinition.toggle, setErrorMessage);
            }}
          />
        </Tooltip>
      );
    }
  });
}

function doToggleEnabled(entity, enabled, toggle, setErrorMessage) {
  const toggle$ = toggle(entity);
  perCellLoadingIndicator$.emit({ id: entity.id, column: 'toggleEnabledAction' });

  toggle$.once(() => {
    reloadEntitiesSignal$.emit(true);
  });
  toggle$.errors().once(error => {
    const errorMessage = `Failed to ${enabled ? 'disable' : 'enable'} entity with ID ${entity.id}: ${error.message}`;
    logger.error(errorMessage, error);
    reloadEntitiesSignal$.emit(true);
    setErrorMessage(errorMessage);
  });
}

function addDeleteAction(columns, actionDefinition, perCellLoadingIndicator, getEntityName, setErrorMessage) {
  return columns.concat({
    id: 'deleteAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent(entity) {
      if (isCellLoading(perCellLoadingIndicator, entity, 'deleteAction')) {
        return <TableActionLoadingIndicator />;
      }
      // some entities are protected and must not be deleted
      const disabled = actionDefinition.deleteProtection && actionDefinition.deleteProtection(entity);

      let element = (
        <Delete
          {...actionDefinition}
          disabled={disabled}
          entity={entity}
          getEntityName={getEntityName}
          doDelete={doDelete}
          setErrorMessage={setErrorMessage}
        />
      );

      if (!disabled) {
        element = (
          <Tooltip content={t('in-settings:components.deleteEntity', { entity: getEntityName(entity) })}>
            {element}
          </Tooltip>
        );
      }

      return <div className={locals.deleteWrapper}>{element}</div>;
    }
  });
}

function doDelete(entity, deleteEntity, setErrorMessage) {
  const deletion$ = deleteEntity(entity);
  perCellLoadingIndicator$.emit({ id: entity.id, column: 'deleteAction' });

  deletion$.once(() => {
    reloadEntitiesSignal$.emit(true);
  });
  deletion$.errors().once(error => {
    const errorMessage = `Failed to remove entity with ID ${entity.id}: ${error.message}`;
    logger.error(errorMessage, error);
    reloadEntitiesSignal$.emit(true);
    setErrorMessage(errorMessage);
  });
}

function addDeselectAction(columns, actionDefinition) {
  return columns.concat({
    id: 'deselectAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent(entity) {
      return (
        <Tooltip content={t('in-settings:components.clickToDeselect')}>
          <SvgIcon
            type={'lib_openclose_remove_circle_outline'}
            color={theme.lib.colors.primary2}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              actionDefinition.deselect(entity);
            }}
          />
        </Tooltip>
      );
    }
  });
}

function addSelectCheckboxAction(columns, actionDefinition) {
  // clone the column definitions array, then insert the checkbox as first column
  columns = columns.slice();
  columns.unshift({
    id: 'selectCheckbox',
    sortable: false,
    headCellProps: {
      className: locals.selectCheckboxHead
    },
    width: '4rem',
    widthInAbsoluteUnit: true,
    selectAllCheckbox: true,
    cellClassName: locals.selectCheckbox,
    getContent(entity) {
      return (
        <CheckboxFancy
          checked={actionDefinition.get(entity)}
          onChange={() => actionDefinition.toggle(entity)}
          size="large"
        />
      );
    }
  });
  return columns;
}

function areAllRowsOnCurrentPageSelected(entities, tableActions, page, pageSize) {
  return areAllRowsSelected(
    entities,
    tableActions,
    (page - 1) * pageSize,
    Math.min(page * pageSize, entities ? entities.length : 0)
  );
}

function areAllRowsOnAllPagesSelected(entities, tableActions) {
  return areAllRowsSelected(entities, tableActions, 0, entities ? entities.length : 0);
}

function areAllRowsSelected(entities, tableActions, startIndex, endIndex) {
  if (!tableActions.selectCheckbox || !entities || entities.length === 0) {
    return false;
  }
  for (let i = startIndex; i < endIndex; i++) {
    if (!tableActions.selectCheckbox.get(entities[i])) {
      return false;
    }
  }
  return true;
}

export function leftHeaderWithSelectAll(entityName, inSelectListDialog, tableActions) {
  return function(totalHits, filteredHits, entitiesBeforePagination) {
    const allSelected = areAllRowsOnAllPagesSelected(entitiesBeforePagination, tableActions);
    if (
      inSelectListDialog &&
      entitiesBeforePagination &&
      entitiesBeforePagination.length > 0 &&
      tableActions.selectCheckbox &&
      tableActions.selectCheckbox.setAllOnAllPages
    ) {
      return (
        <Fragment>
          <span className={locals.headerWithSelectAllButton}>{entityName}</span>
          <Button
            kind="action"
            onClick={() => tableActions.selectCheckbox.setAllOnAllPages(entitiesBeforePagination, !allSelected)}
          >
            {allSelected
              ? t('in-settings:components.deselectAll', { len: entitiesBeforePagination.length })
              : t('in-settings:components.selectAll', { len: entitiesBeforePagination.length })}
          </Button>
        </Fragment>
      );
    } else if (inSelectListDialog || !totalHits) {
      return entityName;
    } else {
      const getHeaderFunction = defaultHeaderWithCount(entityName);
      return getHeaderFunction(totalHits, filteredHits);
    }
  };
}

export function defaultHeaderWithCount(title) {
  return (totalHits, filteredHits) => {
    if (totalHits === 0) {
      return title;
    } else if (totalHits === filteredHits) {
      return `${title} (${totalHits})`;
    } else {
      return `${title} (${filteredHits}/${totalHits})`;
    }
  };
}

function setSelectedStateForRowsOnCurrentPage(entities, tableActions, page, pageSize) {
  if (!tableActions.selectCheckbox || !entities || entities.length === 0) {
    return noop;
  }
  return selected => tableActions.selectCheckbox.setAllOnCurrentPage(entities, selected, page, pageSize);
}

function getRowProps(tableActions) {
  if (tableActions.selectCheckbox) {
    return entity => ({ size: 'compact', selected: tableActions.selectCheckbox.get(entity) });
  }
  return () => ({ size: 'compact' });
}

function isCellLoading(perCellLoadingIndicator, entity, columnName) {
  return (
    perCellLoadingIndicator && entity.id === perCellLoadingIndicator.id && perCellLoadingIndicator.column === columnName
  );
}

function TableActionLoadingIndicator() {
  return <SvgIcon type={'lib_actions_loading'} color={theme.lib.colors.N600Light} spinning />;
}

List.propTypes = {
  cardTitle: PropTypes.string,
  columnDefinitions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      getContent: PropTypes.func.isRequired
    })
  ).isRequired,
  customSortEntities: PropTypes.func,
  entities: PropTypes.array,
  errorMessage: PropTypes.node,
  extraFilters: PropTypes.array,
  /**
   * The 'getHeader' function renders content inside of an H1 tag.
   * For custom content like buttos etc. this leads to invalid HTML
   * (yes it still works in th ebrowser but we shouldn't do that).
   * This function doesnt wrap content in a H1 tag and therefore should
   * be used to inject non string contents to the left side of the header.
   */
  getCustomHeader: PropTypes.func,
  getDetailsHref: PropTypes.func,
  getEntityName: PropTypes.func,
  /**
   * Wraps injected content in an H1 tag at the left side of a header.
   * There it should only be used for allowed content for H-tags like strings etc.
   * For reference, see here: https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2
   * and here:  https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements
   */
  getHeader: PropTypes.func,
  hideWhenEmpty: PropTypes.bool,
  isSearchable: PropTypes.bool,
  labelNew: PropTypes.string,
  newButtonDisabledTooltipMessage: PropTypes.func,
  noDataMessage: PropTypes.string,
  onCreateNew: PropTypes.func,
  onRowClick: PropTypes.func,
  orderByState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderDirectionState: PropTypes.oneOf(['ASC', 'DSC']),
  pageSize: PropTypes.number,
  pageState: PropTypes.number,
  pathNew: PropTypes.string,
  perCellLoadingIndicator: PropTypes.any,
  queryState: PropTypes.any,
  renderNoDataAvailable: PropTypes.func,
  rightHeader: PropTypes.node,
  searchAttributes: PropTypes.array,
  searchMaxWidth: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  setErrorMessage: PropTypes.func,
  setOrderBy: PropTypes.func,
  setOrderDirection: PropTypes.func,
  setPage: PropTypes.func,
  setQuery: PropTypes.func,
  tableActions: PropTypes.object,
  tableInCard: PropTypes.bool,
  title: PropTypes.node,
  trackEvent: PropTypes.func
};

export function reload() {
  reloadEntitiesSignal$.emit(true);
}
