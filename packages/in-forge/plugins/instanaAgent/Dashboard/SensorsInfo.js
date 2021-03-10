/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { listSensors } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { close } from 'in-components/DialogPresenter/store';
import Table from 'in-sdk/components/dashboard/Table';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './SensorsInfo.mless';

const cols = [
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.version'),
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.version;
      }
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.state'),
    type: 'string',
    width: 100,
    typeArgs: {
      getValue(row) {
        return row.state;
      }
    }
  }
];

export function getRows(sensors = []) {
  return sensors.map(({ name, state, version }) => ({
    key: name,
    state,
    version
  }));
}

export default connectTo(
  props => ({ sensors: listSensors(props.snapshot) }),
  function SensorsInfo({ sensors }) {
    let rows = getRows(sensors);
    return (
      <Dialog
        title={t('in-forge:plugins.instanaAgent.dashboard.sensorsInfo')}
        onClose={close}
        className={locals.dialog}
      >
        {!sensors && <LoadingIndicator />}

        {sensors && (
          <Fragment>
            <Table
              withoutPadding
              cardTitle={t('in-forge:plugins.instanaAgent.dashboard.sensorsWithCount', { len: rows.length })}
              cols={cols}
              rows={rows}
            />
            <DownloadView data={sensors} fileName={`sensors`} getJsonData={() => getJsonData(sensors)} />
          </Fragment>
        )}
      </Dialog>
    );
  }
);

function getJsonData(data) {
  return JSON.stringify(data, null, 4);
}
