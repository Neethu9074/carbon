/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import connectTo from 'in-hoc/connectTo';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Version',
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.version;
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.state;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'bundles')
    };
  },
  function BundleList({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const bundles = data.get('raw_payload');
    if (bundles.size === 0) {
      return null;
    }

    const rows = bundles.toJS().map(value => {
      return {
        key: value.name,
        state: value.state,
        version: value.version
      };
    });

    return (
      <Table
        cardTitle={<TimeOfLastUpdateCardTitle title="OSGi Bundle List" timestamp={data.get('timestamp')} />}
        withoutPadding
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="desc"
      />
    );
  }
);
