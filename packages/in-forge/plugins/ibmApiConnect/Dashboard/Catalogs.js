/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-forge:plugins.ibmApiConnect.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        const word = row.catalogList.get('name');
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.totalApiCalls'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.catalogList.get('totalApiCalls');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.totalErrors'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.catalogList.get('totalError');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.maxApiResponse'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.catalogList.get('maxResponseTime');
      },
      getContent: millis.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'catalog')
    };
  },
  function CatalogList({ data }) {
    if (!data) {
      return null;
    }
    const { snapshotId, timeConfig } = snapshotMap;
    const catalogs = data.get('raw_payload');
    const rows = catalogs
      .keySeq()
      .toArray()
      .map(key => {
        const catalogList = catalogs.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          catalogList
        };
      });
    if (rows.length === 0) {
      return null;
    }
    return <Table withoutPadding cardTitle={t('in-forge:plugins.ibmApiConnect.catalogs')} cols={cols} rows={rows} />;
  }
);
