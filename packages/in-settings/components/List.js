/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, forwardRef, useState, useEffect, useRef } from 'react';
import { find, get, isEqual, reverse, sortBy } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { SvgIcon, IconButton, Checkbox, Button, PreviewPill } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { createLogger } from '@instana/logger';
import { create } from '@instana/observables';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { noop, stopPropagationAndPreventDefault } from 'in-services/util/function';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { listSuccess, loading } from 'in-services/util/result';
import Delete from 'in-settings/components/actions/Delete';
import { identity } from 'in-services/util/function';
import ListTitle from 'in-components/lists/Title';
import { isBlank } from 'in-services/util/string';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
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

export default function ListWithErrorState(props) {
  const [errorMessage, setErrorMessage] = useState(null);

  return <List {...props} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />;
}

const List = connectTo(({ loadEntities, setErrorMessage }) => {
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
})(InnerList);
function InnerList({
  errorMessage,
  setErrorMessage,
  title,
  getHeader,
  getCustomHeader,
  getEntityName,
  getDetailsHref,
  onRowClick,
  columnDefinitions,
  tableActions = {},
  onCreateNew,
  onSearch,
  onFilter,
  labelNew,
  pathNew,
  newButtonDisabledTooltipMessage = () => null,
  cardTitle,
  tableInCard,
  rightHeader,
  isSearchable = true,
  searchWidth,
  withBottomPadding = false,
  searchAttributes = [],
  extraFilters,
  extraFilterValues,
  searchPlaceholder,
  searchMaxWidth,
  toolBarContent,
  entities,
  noDataMessage,
  renderNoDataAvailable,
  pageSize = 20,
  hideWhenEmpty,
  perCellLoadingIndicator,
  trackEvent,
  customSortEntities,
  onPageChange,
  initialOrderBy,
  initalOrderDir,
  initialPageNumber,
  customDialogMessage,
  customDialogConfirmLabel,
  customDeleteTooltipMessage,
  boundedPath
}) {
  const [orderByState, setOrderBy] = useState(initialOrderBy ?? 'name');
  const [orderDirectionState, setOrderDirection] = useState(initalOrderDir ?? 'ASC');
  const [{ query, page }, setState] = useUrlState({
    bind: [
      {
        path: boundedPath ?? '/',
        name: 'query',
        initialState: ''
      },
      {
        path: boundedPath ?? '/',
        name: 'page',
        initialState: 1,
        parser: intParser
      }
    ]
  });
  const [queryState, setQuery] = useState(boundedPath && query ? query : '');
  const [pageState, setPage] = useState(boundedPath && page ? page : initialPageNumber ?? 1);
  const { goToPath } = useNavigation();
  const prevExtraFilterValues = useRef();
  useEffect(() => {
    const extraFilterValuesChanged = !isEqual(prevExtraFilterValues.current, extraFilterValues);
    if (extraFilterValuesChanged) {
      setPage(1);
      onPageChange?.(1);
    }

    prevExtraFilterValues.current = extraFilterValues;
    // ignoring onPageChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraFilterValues]);

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

    if (!isBlank(queryState)) {
      if (onFilter) {
        // Filter using custom filter logic function
        entities = onFilter(entities);
      } else if (searchAttributes.length > 0) {
        // Filter using default filter mechanism based on specified search attributes
        entities = entities.filter(entity =>
          searchAttributes.reduce(filterReducer.bind(null, queryState, entity), false)
        );
      }
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

  let cbRowClick;
  if (tableActions.selectCheckbox && onRowClick) {
    cbRowClick = (item, e) => {
      if (!e?.target?.control) onRowClick(item);
    };
  }

  return (
    <div className={classNames({ [locals.withBottomPadding]: withBottomPadding })}>
      {title && <Title title={title} />}
      {errorMessage && <TemporaryMessage type="error" message={errorMessage} duration={null} />}
      <ServerTablePresenter
        onChange={({ page, query, orderBy, orderDirection }) => {
          setPage(page);
          onPageChange?.(page);
          setOrderBy(orderBy);
          setOrderDirection(orderDirection);
          setQuery(query);
          if (boundedPath) {
            setState({ query, page: 1 });
            setState({ page });
          }
          if (onSearch) {
            // Call onSearch handler with selected search query
            onSearch(query);
          }
        }}
        columnDefinitions={addTableActions({
          title,
          columnDefinitions,
          tableActions,
          perCellLoadingIndicator,
          getEntityName,
          setErrorMessage,
          customDialogMessage,
          customDialogConfirmLabel,
          customDeleteTooltipMessage
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
        searchWidth={searchWidth}
        result={result}
        noDataMessage={noDataMessage}
        renderNoDataAvailable={renderNoDataAvailable}
        cardTitle={cardTitle}
        tableInCard={tableInCard}
        toolBarContent={toolBarContent}
        fixedLayout
        rightHeader={
          rightHeader ??
          ((pathNew || onCreateNew) && (
            <CreateNewEntityButton
              labelNew={labelNew}
              trackEvent={trackEvent}
              pathNew={pathNew}
              onCreateNew={onCreateNew}
              disabledMessage={newDisabledMessage}
            />
          ))
        }
        getRowProps={getRowProps(tableActions)}
        onRowClick={cbRowClick ? cbRowClick : onRowClick}
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
    ? getCustomHeader?.(totalHitsBeforeFilter, totalHitsAfterFilter, entitiesBeforePagination) ?? (
        <ListTitle>{getHeader(totalHitsBeforeFilter, totalHitsAfterFilter, entitiesBeforePagination)}</ListTitle>
      )
    : null;
}

export function filterReducer(query, entity, foundMatch, searchAttribute) {
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

export function CreateNewEntityButton({ labelNew, pathNew, onCreateNew, disabledMessage, trackEvent }) {
  const { createHrefToPath } = useNavigation();
  if (!pathNew && !onCreateNew) {
    return null;
  }
  const href = onCreateNew ? null : createHrefToPath(pathNew);
  if (disabledMessage) {
    return (
      <Tooltip content={disabledMessage} delay={500} align="bottomMiddle">
        <NewEntityButton label={labelNew} disabled trackEvent={trackEvent} />
      </Tooltip>
    );
  } else {
    return <NewEntityButton label={labelNew} href={href} onCreateNew={onCreateNew} trackEvent={trackEvent} />;
  }
}

const NewEntityButton = forwardRef(function NewEntityButton(
  { label = t('in-settings:components.createNew'), href, onCreateNew, disabled, trackEvent },
  ref
) {
  return (
    <Button
      className={locals.createNewButton}
      kind="action"
      disabled={disabled}
      href={href}
      onClick={() => handleClickCreateNewEntity(onCreateNew, trackEvent)}
      icon="lib_openclose_add_circle_outline"
      ref={ref}
    >
      {label}
    </Button>
  );
});

function addTableActions({
  title,
  columnDefinitions,
  tableActions,
  perCellLoadingIndicator,
  getEntityName,
  setErrorMessage,
  customDialogMessage,
  customDialogConfirmLabel,
  customDeleteTooltipMessage
}) {
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
      title,
      allColumns,
      tableActions.delete,
      perCellLoadingIndicator,
      getEntityName,
      setErrorMessage,
      customDialogMessage,
      customDialogConfirmLabel,
      customDeleteTooltipMessage
    );
  }
  if (tableActions.deselect) {
    allColumns = addDeselectAction(allColumns, tableActions.deselect);
  }
  if (tableActions.select) {
    allColumns = addSelectAction(allColumns, tableActions.select);
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
    getContent: function Content(entity) {
      if (isCellLoading(perCellLoadingIndicator, entity, 'toggleEnabledAction')) {
        return <TableActionLoadingIndicator />;
      }
      const entityEnabled = actionDefinition.get ? actionDefinition.get(entity) : entity[actionDefinition.key];
      const customDefinedDisableLabel = actionDefinition.disableLabel || t('in-settings:components.disable');
      const customDefinedEnableLabel = actionDefinition.enableLabel || t('in-settings:components.enable');
      return (
        <Tooltip content={entityEnabled ? customDefinedDisableLabel : customDefinedEnableLabel} delay={500}>
          <IconButton
            disabled={actionDefinition.disabled?.(entity)}
            kind="primaryv2"
            type={entityEnabled ? 'lib_actions_pause' : 'lib_actions_play'}
            color={themes.default.ids.color.option.blue['500']}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              doToggleEnabled(entity, entityEnabled, actionDefinition.toggle, setErrorMessage);
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

function addDeleteAction(
  title,
  columns,
  actionDefinition,
  perCellLoadingIndicator,
  getEntityName,
  setErrorMessage,
  customDialogMessage,
  customDialogConfirmLabel,
  customDeleteTooltipMessage
) {
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
      const disabled =
        (actionDefinition.deleteProtection && actionDefinition.deleteProtection(entity)) ||
        actionDefinition.disabled?.(entity);

      const tooltipContent = customDeleteTooltipMessage
        ? customDeleteTooltipMessage(entity)
        : t('in-settings:components.deleteEntity', { entity: getEntityName(entity) });

      if (disabled) {
        // Only show icon for disabled delete
        return (
          <Tooltip content={tooltipContent} delay={500}>
            <div className={locals.deleteIcon}>
              <SvgIcon
                className={classNames({
                  [locals.icon]: true,
                  [locals.disabled]: disabled
                })}
                type="lib_actions_delete"
                data-testid="deleteIcon"
              />
            </div>
          </Tooltip>
        );
      } else {
        return (
          <div className={locals.deleteWrapper}>
            <Tooltip content={tooltipContent} delay={500}>
              <Delete
                {...actionDefinition}
                disabled={disabled}
                entity={entity}
                getEntityName={getEntityName}
                doDelete={doDelete}
                setErrorMessage={setErrorMessage}
                dialogMessage={customDialogMessage}
                confirmLabel={customDialogConfirmLabel}
              />
            </Tooltip>
          </div>
        );
      }
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

function addSelectAction(columns, actionDefinition) {
  return columns.concat({
    id: 'selectAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent: function Content(entity) {
      return (
        <Tooltip content={actionDefinition.title?.(entity) ?? t('in-settings:components.select')} delay={500}>
          <IconButton
            disabled={actionDefinition.disabled?.(entity)}
            kind="primaryv2"
            type={'lib_openclose_add_circle_outline'}
            color={themes.default.ids.color.option.blue['500']}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              actionDefinition.select(entity);
            }}
          />
        </Tooltip>
      );
    }
  });
}

function addDeselectAction(columns, actionDefinition) {
  return columns.concat({
    id: 'deselectAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent: function Content(entity) {
      return (
        <Tooltip content={t('in-settings:components.deselect')} delay={500}>
          <IconButton
            disabled={actionDefinition.disabled?.(entity)}
            kind="primaryv2"
            type={'lib_openclose_remove_circle_outline'}
            color={themes.default.ids.color.option.blue['500']}
            // Added 'buttonType' to IconButton to fix the default submission when the enter key is pressed from other UI elements on the page. ...
            // gentle remainder : Remove this after carbon is enabled, if possible.
            buttonType="button"
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
        <Checkbox
          disabled={actionDefinition.disabled?.(entity)}
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

export function areAllRowsOnAllPagesSelected(entities, tableActions) {
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

export function leftHeaderWithSelectAll(entityName, inSelectListDialog, tableActions, isBeta = false) {
  return function LeftHeaderWithSelectAll(totalHits, filteredHits, entitiesBeforePagination) {
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
      return (
        <div>
          {entityName} {isBeta && <PreviewPill />}
        </div>
      );
    } else {
      const getHeaderFunction = defaultHeaderWithCount(entityName);
      return (
        <div>
          {getHeaderFunction(totalHits, filteredHits)} {isBeta && <PreviewPill />}
        </div>
      );
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
  return <SvgIcon type={'lib_actions_loading'} color={themes.default.ids.color.option.neutral['600']} spinning />;
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
  extraFilterValues: PropTypes.array,
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
  withBottomPadding: PropTypes.bool,
  newButtonDisabledTooltipMessage: PropTypes.func,
  noDataMessage: PropTypes.string,
  onCreateNew: PropTypes.func,
  onRowClick: PropTypes.func,
  onSearch: PropTypes.func,
  onFilter: PropTypes.func,
  initialOrderBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initalOrderDir: PropTypes.oneOf(['ASC', 'DESC']),
  orderByState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderDirectionState: PropTypes.oneOf(['ASC', 'DESC']),
  pageSize: PropTypes.number,
  pageState: PropTypes.number,
  pathNew: PropTypes.string,
  perCellLoadingIndicator: PropTypes.any,
  queryState: PropTypes.any,
  renderNoDataAvailable: PropTypes.func,
  rightHeader: PropTypes.node,
  searchAttributes: PropTypes.array,
  searchMaxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchPlaceholder: PropTypes.string,
  setErrorMessage: PropTypes.func,
  setOrderBy: PropTypes.func,
  setOrderDirection: PropTypes.func,
  setPage: PropTypes.func,
  setQuery: PropTypes.func,
  tableActions: PropTypes.object,
  tableInCard: PropTypes.bool,
  title: PropTypes.node,
  trackEvent: PropTypes.func,
  /**
   * Callback called on every page change
   */
  onPageChange: PropTypes.func,
  // Disabled this line because
  // eslint-disable-next-line react/no-unused-prop-types
  initialPageNumber: PropTypes.number,
  searchWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customDialogMessage: PropTypes.func,
  customDialogConfirmLabel: PropTypes.string,
  customDeleteTooltipMessage: PropTypes.func
};

export function reload() {
  reloadEntitiesSignal$.emit(true);
}

function arrayToResult(array, totalHits, pageSize, itemMapper = identity, time = Date.now()) {
  return array ? listSuccess(array.map(itemMapper), totalHits, pageSize, time) : loading;
}
