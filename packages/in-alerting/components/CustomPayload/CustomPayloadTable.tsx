/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item, ListForm, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition, TrProps } from 'in-components/tables/ServerTable/types';
import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Nullish, PaginatedResult, Result } from 'in-types';
import Section from 'in-settings/components/Section';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/CustomPayload/CustomPayloadTable.mless';

const maximumNumberOfRows = 20;

//TODO refine, use correct type here
interface ListItem extends Object {
  id?: string;
}
//TODO refine, use correct type here
type CustomPayloadItem = ListItem;

export interface AdditionalContentPropsType {
  deleteRow: (payloadField: MapForm<any>) => void;
  getRowIndex: (field: Item) => number;
  updateIn: (path: (string | number)[], updater: (item: Item) => Item) => void;
  TagBasedPayloadConfigurator: React.ReactNode;
  suggestionsAlignedLeft?: boolean;
  enabled?: boolean;
}

interface ServerTableCustomPayloadConfig
  extends AdditionalContentPropsType,
    ServerTablePresenterProps<CustomPayloadItem> {}

interface CustomPayloadTableProps extends ServerTableCustomPayloadConfig {
  columnDefinitions: ColumnDefinition<CustomPayloadItem, ServerTableCustomPayloadConfig>[];
  addRow: () => void;
  customPayloadForm: ListForm<any>;
  result?: Result<PaginatedResult<CustomPayloadItem>> | Nullish;
  canConfigureAlertPayload?: boolean;
  isTearSheet?: boolean;
}

export default function CustomPayloadTable(props: CustomPayloadTableProps) {
  const {
    columnDefinitions,
    result,
    getRowIndex,
    addRow,
    deleteRow,
    updateIn,
    TagBasedPayloadConfigurator,
    suggestionsAlignedLeft,
    customPayloadForm,
    canConfigureAlertPayload = true,
    enabled = true,
    leftHeader,
    isTearSheet
  } = props;
  return (
    <div
      className={classNames({
        [locals.customPayloadTearsheet]: isTearSheet,
        [locals.tableContent]: true
      })}
    >
      <ServerTablePresenter<CustomPayloadItem, ServerTableCustomPayloadConfig>
        isScrollableTable={false}
        columnDefinitions={columnDefinitions}
        getRowProps={getRowProps}
        result={result}
        isSearchable={false}
        leftHeader={leftHeader}
        rightHeader={
          <RightHeader
            canConfigureAlertPayload={canConfigureAlertPayload}
            formSize={customPayloadForm.size}
            addRow={addRow}
            enabled={enabled}
          />
        }
        noDataMessage={t('in-alerting:components.customPayload.noCustomPayloadConfigured')}
        getRowIndex={getRowIndex}
        deleteRow={deleteRow}
        updateIn={updateIn}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        suggestionsAlignedLeft={suggestionsAlignedLeft}
        enabled={enabled}
        orderBy={''}
        orderDirection={'ASC'}
        page={0}
        pageSize={5}
        renderNoDataAvailable={noDataMessage => <NoItemSelected text={noDataMessage} />}
      />
      <Section>
        <TouchedMessages field={customPayloadForm} />
      </Section>
    </div>
  );
}

function RightHeader({
  canConfigureAlertPayload,
  formSize,
  addRow,
  enabled
}: {
  canConfigureAlertPayload: boolean;
  formSize: number;
  addRow: () => void;
  enabled: boolean;
}): JSX.Element {
  return canConfigureAlertPayload ? (
    formSize >= maximumNumberOfRows ? (
      <Tooltip
        content={t('in-alerting:components.customPayload.theNumberOfRowsIsRestrictedToMaximumNumberOfRows', {
          maximumNumberOfRows: maximumNumberOfRows
        })}
        align="bottomMiddle"
      >
        <Button kind="action" icon="lib_openclose_add_circle_outline" disabled>
          {t('in-alerting:components.customPayload.addRow')}
        </Button>
      </Tooltip>
    ) : (
      <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline" disabled={!enabled}>
        {t('in-alerting:components.customPayload.addRow')}
      </Button>
    )
  ) : (
    <span />
  );
}

function getRowProps(): TrProps {
  return {
    className: locals.row,
    size: 'compact'
  };
}
