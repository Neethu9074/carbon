import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { listSensors } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { close } from 'in-components/DialogPresenter/store';
import Table from 'in-sdk/components/dashboard/Table';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

import locals from './SensorsInfo.mless';

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
    typeArgs: {
      getValue(row) {
        return row.version;
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.state;
      }
    }
  }
];

export function getRows(sensors) {
  return sensors.map(value => {
    return {
      key: value.name,
      state: value.state,
      version: value.version
    };
  });
}

export default connectTo(props => ({ sensors: listSensors(props.snapshot) }), function SensorsInfo({ sensors }) {
  if (!sensors) {
    return null;
  }
  let rows = getRows(sensors);
  return (
    <Dialog header="Sensors Info" onClose={close} contentClassName={locals.dialog}>
      <Table withoutPadding cardTitle={`Sensors (${rows.length})`} cols={cols} rows={rows} />

      {sensors ? <DownloadView data={sensors} fileName={`sensors`} getJsonData={() => getJsonData(sensors)} /> : null}
    </Dialog>
  );
});

function getJsonData(data) {
  return JSON.stringify(data, null, 4);
}
