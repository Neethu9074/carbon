import { find, get, reverse, sortBy } from 'lodash';
import { withState, compose } from 'recompose';
import { createLogger } from 'instalog';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { arrayToResult } from 'in-services/util/result';
import ListTitle from 'in-new-components/lists/Title';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import { create } from 'reactive-observables';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import theme from 'in-themes';

import locals from './List.mless';

const logger = createLogger('SettingsList');

const reloadEntitiesSignal$ = create({
  emitLatestOnSubscribe: false
});
const emptyListOnError$ = create({
  emitLatestOnSubscribe: false
});

export default compose(
  withState('orderByState', 'setOrderBy', ({ initialOrderBy }) => (initialOrderBy ? initialOrderBy : 'name')),
  withState('orderDirectionState', 'setOrderDirection', 'ASC'),
  withState('queryState', 'setQuery', ''),
  withState('pageState', 'setPage', 1),
  withState('errorMessage', 'setErrorMessage', null),
  connectTo(({ loadEntities, setErrorMessage }) => {
    // 1. The `merge(loadEntities())` makes sure loadEntities() is called right at the start, when the component is first
    // rendered
    // 2. The reloadSignal.flatMap(() => loadEntities()) part gives us a hook to trigger a refresh of the entities (for
    // example, if one has been deleted).
    // 3. The merge with emptyListOnError$ gives us a hook to set the list of entities to an empty array in case loading
    // the entities fails (HTTP error etc.)
    const entityObservable = reloadEntitiesSignal$
      .flatMap(() => loadEntities())
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
      entities: entityObservable
    };
  })
)(List);

function List({
  title,
  getHeader,
  getEntityName,
  getDetailsHref,
  columnDefinitions,
  tableActions = {},
  onCreateNew,
  labelNew,
  pathNew,
  newButtonDisabledTooltipMessage = () => null,
  rightHeader,
  searchAttributes = [],
  entities,
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
  setErrorMessage
}) {
  if (hideWhenEmpty && (!entities || entities.length === 0)) {
    return null;
  }

  let totalHits = 0;
  const newDisabledMessage = entities && newButtonDisabledTooltipMessage(entities);
  if (entities) {
    if (!isBlank(queryState) && searchAttributes.length > 0) {
      entities = entities.filter(entity =>
        searchAttributes.reduce(filterReducer.bind(null, queryState, entity), false)
      );
    }
    entities = sortEntities(entities, columnDefinitions, orderByState, orderDirectionState);
    totalHits = entities.length;
    const offset = (pageState - 1) * pageSize;
    const until = offset + pageSize;
    entities = entities.slice(offset, until);
  }
  const header = getHeader(entities);
  const result = arrayToResult(entities, totalHits, pageSize);

  return (
    <MaxWidthFullscreenContainer>
      <Title title={title} />
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
          getEntityName,
          setErrorMessage
        })}
        leftHeader={<ListTitle>{header}</ListTitle>}
        orderBy={orderByState}
        orderDirection={orderDirectionState}
        page={pageState}
        pageSize={pageSize}
        query={queryState}
        result={result}
        rightHeader={
          rightHeader ? rightHeader : createNewEntityButton(labelNew, pathNew, onCreateNew, newDisabledMessage)
        }
        getRowLink={getDetailsHref ? entity => getDetailsHref(entity) : null}
      />
    </MaxWidthFullscreenContainer>
  );
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
  const sorted = sortBy(entities, sortIteratee);
  if (orderDirectionState === 'DESC') {
    reverse(sorted);
  }
  return sorted;
}

function createNewEntityButton(labelNew, pathNew, onCreateNew, disabledMessage) {
  if (!pathNew && !onCreateNew) {
    return null;
  }
  const href$ = onCreateNew ? null : getModifiedUrlStream(p => (p.pathname = pathNew));
  if (disabledMessage) {
    return (
      <Tooltip content={disabledMessage} align="bottomMiddle">
        <NewEntityButton label={labelNew} disabled />
      </Tooltip>
    );
  } else {
    return <NewEntityButton label={labelNew} href$={href$} onCreateNew={onCreateNew} />;
  }
}

function NewEntityButton({ label = 'Create New', href$, onCreateNew, disabled }) {
  return (
    <Button
      className={locals.createNewButton}
      kind="action"
      disabled={disabled}
      href$={href$}
      onClick={onCreateNew ? () => onCreateNew() : null}
      icon="lib_openclose_add_circle_outline"
    >
      {label}
    </Button>
  );
}

function addTableActions({ columnDefinitions, tableActions, getEntityName, setErrorMessage }) {
  let allColumns = columnDefinitions;
  if (tableActions.toggleEnabled) {
    allColumns = addToggleEnabledAction(allColumns, tableActions.toggleEnabled, setErrorMessage);
  }
  if (tableActions.delete) {
    allColumns = addDeleteActionAction(allColumns, tableActions.delete, getEntityName, setErrorMessage);
  }
  return allColumns;
}

function addDeleteActionAction(columns, actionDefinition, getEntityName, setErrorMessage) {
  return columns.concat({
    id: 'deleteAction',
    sortable: false,
    headCellProps: {
      className: locals.tableActionHead
    },
    cellClassName: locals.tableActionCell,
    getContent(entity) {
      if (actionDefinition.deleteProtection && actionDefinition.deleteProtection(entity)) {
        // some entities are protected and must not be deleted
        return null;
      }
      return (
        <Tooltip content={`Delete ${getEntityName(entity)}.`}>
          <SvgIcon
            type="lib_actions_delete"
            width={24}
            height={24}
            color={theme.lib.colors.primary2}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              setActiveDialog(
                <ConfirmationDialog
                  header="Please Confirm"
                  description={
                    actionDefinition.dialogMessage ? (
                      actionDefinition.dialogMessage(entity)
                    ) : (
                      <span>
                        Are you sure you want to remove the <strong>{getEntityName(entity)}</strong>?
                      </span>
                    )
                  }
                  bButtonLabel={actionDefinition.confirmLabel || 'Remove'}
                  onB={() => {
                    close();
                    doDelete(entity, actionDefinition.deleteEntity, setErrorMessage);
                  }}
                  bButtonIcon="lib_actions_delete"
                />
              );
            }}
          />
        </Tooltip>
      );
    }
  });
}

function doDelete(entity, deleteEntity, setErrorMessage) {
  const deletion$ = deleteEntity(entity);
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

function addToggleEnabledAction(columns, actionDefinition, setErrorMessage) {
  return columns.concat({
    id: 'toggleEnabledAction',
    sortable: false,
    headCellProps: {
      className: locals.tableActionHead
    },
    cellClassName: locals.tableActionCell,
    getContent(entity) {
      const enabled = actionDefinition.get ? actionDefinition.get(entity) : entity[actionDefinition.key];
      return (
        <Tooltip content={`Click to ${enabled ? 'disable.' : 'enable.'}`}>
          <SvgIcon
            type={enabled ? 'lib_actions_pause' : 'lib_actions_play'}
            width={24}
            height={24}
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
