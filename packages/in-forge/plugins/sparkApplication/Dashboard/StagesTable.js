/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesTwoDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.id'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('id');
      },
      getContent: function(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.stage.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.submissionTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('submissionTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.duration'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('duration');
      },
      getContent: timeByMillisTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.tasks'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('tasks');
      },
      getContent: function(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.gcTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('gcTime');
      },
      getContent: timeByMillisTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.inputBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('inputBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.outputBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('outputBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.shuffleRead'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('shuffleRead');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkApplication.dashboard.shuffleWrite'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('shuffleWrite');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    return {
      stages: getRawPayload(props.snapshot.get('id'), 'stages')
    };
  },
  function StagesTable({ snapshot, stages }) {
    if (!stages || stages.size === 0) {
      return null;
    }

    const rows = stages
      .map(stage => {
        return {
          key: String(stage.get('id')),
          stage,
          snapshotId: snapshot.get('id')
        };
      })
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.sparkApplication.dashboard.topLongestCompletedStages')}
        cols={cols}
        rows={rows}
        initialSortColumn={3}
        initialSortDirection={'desc'}
      />
    );
  }
);
