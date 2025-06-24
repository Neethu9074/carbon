/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Layer
} from '@instana/carbon';
import { PaginatedResult, Result } from '@instana/types';
import { Stack } from '@instana/components';

import { AdditionalContentPropsType, CustomPayloadItem } from 'in-alerting/components/CustomPayload/CustomPayloadTable';
import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { Nullish } from 'in-types';

import locals from 'in-alerting/components/CustomPayload/CustomPayloadList.mless';

interface CustomPayloadListProps extends AdditionalContentPropsType {
  columnDefinitions: ColumnDefinition<CustomPayloadItem>[];
  rightHeader: JSX.Element;
  result?: Result<PaginatedResult<CustomPayloadItem>> | Nullish;
  deleteRow: (itemForm: MapForm<any>) => void;
  enabled: boolean;
  leftHeader?: JSX.Element;
  isTearSheet?: boolean;
}

export default function CustomPayloadList(props: CustomPayloadListProps) {
  const { columnDefinitions, result, rightHeader, leftHeader, isTearSheet } = props;

  const carbonHeaders = columnDefinitions.map((item: ColumnDefinition<CustomPayloadItem>, i: number) => ({
    key: item?.id || String(i),
    isSortable: item.sortable ?? true,
    getContent: item.getContent
  }));

  const rows = result?.data?.items.map((item: CustomPayloadItem, index: number) => {
    const idObj = { id: item.id ?? String(index) };

    const newRow = carbonHeaders.map(({ key, getContent }) => {
      //@ts-expect-error type-Missmatch in common component
      return { [key]: getContent(item, props, key) };
    });
    const carbonRow = Object.assign({}, ...newRow, idObj);
    return carbonRow;
  });
  return (
    <>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <span>{leftHeader}</span>
        <span className={locals.alignRight}>{rightHeader}</span>
      </Stack>
      <Layer>
        <StructuredListWrapper isCondensed selection className={classNames({ [locals.layerBackground]: !isTearSheet })}>
          <StructuredListHead className={locals.greyBg}>
            <StructuredListRow head>
              {columnDefinitions.map((item: ColumnDefinition<CustomPayloadItem>) => (
                <StructuredListCell key={item.id} head>
                  {item.label}
                </StructuredListCell>
              ))}
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody className={classNames({ [locals.whiteBackground]: isTearSheet })}>
            {rows?.map((row: any) => {
              return (
                <StructuredListRow key={row.id}>
                  <StructuredListCell
                    className={classNames({
                      [locals.cellAllign]: true,
                      [locals.textBoxWidth]: true
                    })}
                    noWrap
                  >
                    {row.key}
                  </StructuredListCell>
                  <StructuredListCell
                    className={classNames({
                      [locals.cellAllign]: true,
                      [locals.valueBoxWidth]: true
                    })}
                    noWrap
                  >
                    {row.type}
                  </StructuredListCell>
                  <StructuredListCell
                    className={classNames({
                      [locals.cellAllign]: true,
                      [locals.valueBoxWidth]: true
                    })}
                    noWrap
                  >
                    {row.value}
                  </StructuredListCell>
                  <StructuredListCell className={locals.cellAllign} noWrap>
                    {row.deleteRow}
                  </StructuredListCell>
                </StructuredListRow>
              );
            })}
          </StructuredListBody>
        </StructuredListWrapper>
      </Layer>
      <> {rows?.length === 0 && <NoItemSelected />}</>
    </>
  );
}
