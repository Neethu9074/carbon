/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Message } from '@instana/components';

import {
  get,
  toggle,
  setAllOnCurrentPage,
  setAllOnAllPages
} from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import NoChannelSelected from 'in-alerting/components/NoChannelSelected';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelSelectListTearsheet.mless';

export default function AlertChannelSelectListTearsheet({
  listComponent,
  selectedChannels,
  listComponentRightHeader,
  onSelectionUpdate,
  hiddenIds = [],
  limit = Number.MAX_VALUE, // unlimited by default
  pageSize,
  entityResult
}) {
  const [selectedItems, setSelectedItems] = useState(selectedChannels.length > 0 ? selectedChannels : []);
  const [errorMessage, setErrorMessage] = useState();
  limit = limit - hiddenIds.length; // take the items that are already selected into account
  const ListComponent = listComponent;

  useEffect(() => {
    onSelectionUpdate(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  return (
    <div className={locals.channelListTable}>
      {errorMessage && (
        <Message type="warning" fullInlineWidth withIcon title={errorMessage} className={locals.errorMessage} />
      )}
      <ListComponent
        entityResult={entityResult}
        setTitle={false}
        numberOfChannels={selectedItems.length}
        preSelectedChannels={selectedChannels}
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
        renderNoDataAvailable={() => <NoChannelSelected text={t('in-alerting:components.noChannelAvailable')} />}
      />
    </div>
  );
}
