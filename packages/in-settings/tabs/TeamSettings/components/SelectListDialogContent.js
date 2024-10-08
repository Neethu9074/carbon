/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import NoChannelSelected from 'in-alerting/components/NoChannelSelected';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import { t } from 'in-i18n';

import locals from './SelectListDialog.mless';

const defaultRequiresAtLeastOneMessage = t('in-settings:tabs.pleaseSelectAtLeastOneItem');

export default function SelectListDialogContent({
  listComponent,
  listComponentRightHeader,
  onSubmit,
  createSubmitLabel = () => t('in-settings:tabs.add'),
  requiresAtLeastOneMessage = defaultRequiresAtLeastOneMessage,
  hiddenIds = [],
  limit = Number.MAX_VALUE, // unlimited by default
  pageSize = 5,
  preventCloseOnSubmit,
  renderCustomFormActions
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(
    requiresAtLeastOneMessage ? requiresAtLeastOneMessage : defaultRequiresAtLeastOneMessage
  );
  limit = limit - hiddenIds.length; // take the items that are already selected into account
  const ListComponent = listComponent;
  const numberOfItems = selectedItems.length;
  if (!errorMessage && numberOfItems === 0) {
    setErrorMessage(requiresAtLeastOneMessage);
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(selectedItems);
        setSelectedItems([]);
        if (!preventCloseOnSubmit) close();
      }}
      autoComplete="off"
    >
      <FormGroup>
        <ListComponent
          setTitle={false}
          pageSize={pageSize}
          hiddenIds={hiddenIds}
          hasRowNavigation={false}
          noDataMessage={t('in-settings:tabs.noItemsAvailable')}
          onRowClick={entity => toggle(selectedItems, setSelectedItems, entity, limit, setErrorMessage)}
          tableActions={{
            selectCheckbox: {
              get(entity) {
                return get(selectedItems, entity);
              },
              setAllOnCurrentPage(entities, selected, page, pageSize) {
                setAllOnCurrentPage(
                  selectedItems,
                  setSelectedItems,
                  entities,
                  selected,
                  limit,
                  setErrorMessage,
                  page,
                  pageSize
                );
              },
              setAllOnAllPages(entities, selected) {
                setAllOnAllPages(selectedItems, setSelectedItems, entities, selected, limit, setErrorMessage);
              },
              toggle(entity) {
                toggle(selectedItems, setSelectedItems, entity, limit, setErrorMessage);
              }
            }
          }}
          rightHeader={listComponentRightHeader}
          inSelectListDialog
          renderNoDataAvailable={() => <NoChannelSelected text={t('in-alerting:components.noChannelAvailable')} />}
        />
        {errorMessage && <ValidationBlock className={locals.errorMessage}>{errorMessage}</ValidationBlock>}
      </FormGroup>

      {renderCustomFormActions?.(numberOfItems) ?? (
        <div className={locals.actions}>
          <Button type="submit" kind={'secondary'} onClick={() => setSelectedItems([])} className={locals.actionButton}>
            {t('in-settings:tabs.cancel')}
          </Button>
          <Button
            type="submit"
            kind={'primary'}
            disabled={requiresAtLeastOneMessage && numberOfItems === 0}
            className={locals.actionButton}
          >
            {createSubmitLabel(numberOfItems)}
          </Button>
        </div>
      )}
    </form>
  );
}

export function get(selectedItems, entity) {
  return selectedItems.indexOf(entity.id) >= 0;
}

export function toggle(selectedItems, setSelectedItems, entity, limit, setErrorMessage) {
  if (get(selectedItems, entity)) {
    removeFromSelection(setSelectedItems, selectedItems, entity, setErrorMessage);
  } else {
    addToSelection(setSelectedItems, selectedItems, entity, limit, setErrorMessage);
  }
}

function addToSelection(setSelectedItems, selectedItems, entity, limit, setErrorMessage) {
  if (selectedItems.length >= limit) {
    if (limit === 0) {
      setErrorMessage(t('in-settings:tabs.youCannotAddMoreItems'));
    } else if (limit === 1) {
      setErrorMessage(t('in-settings:tabs.youCanOnlyAddOneItem'));
    } else {
      setErrorMessage(t('in-settings:tabs.youCanAddAtMostLimitItems', { limit: limit }));
    }
    return;
  }

  setSelectedItems(selectedItems.concat(entity.id));
  setErrorMessage(null);
}

function removeFromSelection(setSelectedItems, selectedItems, entity, setErrorMessage) {
  setSelectedItems(selectedItems.filter(id => id !== entity.id));
  setErrorMessage(null);
}

export function setAllOnCurrentPage(
  selectedItems,
  setSelectedItems,
  entities,
  selected,
  limit,
  setErrorMessage,
  page,
  pageSize
) {
  setAllInternal(
    selectedItems,
    setSelectedItems,
    entities,
    selected,
    limit,
    setErrorMessage,
    (page - 1) * pageSize,
    Math.min(page * pageSize, entities.length)
  );
}

export function setAllOnAllPages(selectedItems, setSelectedItems, entities, selected, limit, setErrorMessage) {
  setAllInternal(selectedItems, setSelectedItems, entities, selected, limit, setErrorMessage, 0, entities.length);
}

function setAllInternal(
  selectedItems,
  setSelectedItems,
  entities,
  selected,
  limit,
  setErrorMessage,
  startIndex,
  endIndex
) {
  let entity;

  if (selected) {
    let entitiesToBeAdded = 0;
    for (let i = startIndex; i < endIndex; i++) {
      entity = entities[i];
      if (!get(selectedItems, entity)) {
        entitiesToBeAdded++;
      }
    }
    if (selectedItems.length + entitiesToBeAdded > limit) {
      if (limit === 0) {
        setErrorMessage(t('in-settings:tabs.youCannotAddMoreItems'));
      } else if (limit === 1) {
        setErrorMessage(t('in-settings:tabs.youCanOnlyAddOneItem'));
      } else {
        setErrorMessage(t('in-settings:tabs.pleaseNarrowDownYourSelectionByUsingTheFilters', { limit: limit }));
      }
      return;
    }
  }
  setErrorMessage(null);

  for (let i = startIndex; i < endIndex; i++) {
    entity = entities[i];
    if (get(selectedItems, entity) && !selected) {
      selectedItems = selectedItems.filter(id => id !== entity.id);
    } else if (!get(selectedItems, entity) && selected) {
      selectedItems = selectedItems.concat(entity.id);
    }
  }
  setSelectedItems(selectedItems);
}
