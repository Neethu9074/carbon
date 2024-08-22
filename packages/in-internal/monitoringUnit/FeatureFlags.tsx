/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable no-console */
import React, { Fragment } from 'react';

import { Toggle } from '@instana/components';
import { TimeConfig } from '@instana/types';

// @ts-expect-error not yet ts migrated:
// eslint-disable-next-line no-restricted-imports
import serverResolverFlags from '../../in-server/src/services/resolvers/featureFlags';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import Table from 'in-sdk/components/dashboard/Table';
import { compare } from 'in-services/util/boolean';
import * as Grid from 'in-components/layout/Grid';
import config from 'in-services/config';

/* This is a rather dirty implementation without i18n etc. */
/* The idea is to migrate this to a carbon tables, soon. */

interface InstanaCtlFlag {
  uiClientKey: string;
  instanaCtlKey: string;
  defaultValue: boolean;
}

const uiToInstanaCtl = new Map<string, InstanaCtlFlag>();

console.log('the existing list of feature-flags');

(serverResolverFlags as InstanaCtlFlag[]).forEach(flag => {
  console.log('serverInstanaCtlFlags', ...Object.entries(flag));
  uiToInstanaCtl.set(flag.uiClientKey, flag);
});

interface Row {
  value?: boolean | undefined | null;
  key: string;
  name: string;
  type: string;
  color: string;
  tableMetric: number;
  discrete: boolean;
  snapshotId: string;
  timeConfig: TimeConfig;
  rollup?: number;
  metrics: Metric[];
  pinnedMetrics: string[];
  setPinnedMetrics: (p: string[]) => void;
}

const cols = [
  {
    title: 'name',
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.key;
      }
    }
  },
  {
    title: 'instanaCtl name',
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return uiToInstanaCtl.get(row.key)?.instanaCtlKey;
      }
    }
  },
  {
    title: 'production default',
    width: 10,
    type: 'custom',
    typeArgs: {
      comparator: compare,
      onChange(_row: Row, _newValue: boolean) {
        /*ignored*/
      },
      getValue(row: Row) {
        return row.value;
      },
      get(row: Row) {
        const prodDefault = uiToInstanaCtl.get(row.key)?.defaultValue;

        return {
          value: prodDefault,
          content: <Toggle checked={Boolean(prodDefault)} disabled labelA={`${prodDefault}`} />
        };
      }
    }
  },
  {
    title: 'current',
    width: 10,
    type: 'custom',
    typeArgs: {
      comparator: compare,
      onChange(_row: Row, _newValue: boolean) {
        /*ignored*/
      },
      getValue(row: Row) {
        return row.value;
      },
      get(row: Row) {
        return { value: row.value, content: <Toggle checked={Boolean(row.value)} disabled labelA={`${row.value}`} /> };
      }
    }
  }
  /* LATER: add a column to easily manipulate values via Jenkins+instanaCtl
  {
    title: 'Jenkins clear',
    width: 10,
    type: 'link',
    disableSorting: true,
    typeArgs: {
      get(row: Row) {
        return { value: row.value, href: '#', label: 'Clear' };
      }
    }
  }
   */
];

/* these flags are available in the browser-console via
 *   windows.instana.config.featureFlags
 */
export default function FeatureFlags() {
  // clone, so that we don't change the original values:
  const windowClientFlags = {
    ...config.featureFlags
  };
  const rows = Object.entries(windowClientFlags).map(([key, value]) => {
    return { key, value };
  });

  return (
    <Fragment>
      <DashboardSection title="Internal">
        This is reflecting the existing list shown in the browser. It is generated and filled by the server from values
        stored in the config database.
      </DashboardSection>

      <Grid.Row>
        <Grid.Col lg={12} preserveVerticalGutter={false}>
          <Table
            cols={cols}
            rows={rows}
            cardTitle="Current feature flags"
            maxItemsPerPage={20}
            withoutPadding
            showExpandAll
          />
        </Grid.Col>
      </Grid.Row>
    </Fragment>
  );
}
