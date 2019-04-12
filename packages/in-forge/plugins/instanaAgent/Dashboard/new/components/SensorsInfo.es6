import React from 'react';

import DownloadView from 'in-components/DownloadButton/components/DownloadView';
import { listSensors } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { close } from 'in-components/DialogPresenter/store';
import Table from 'in-sdk/components/dashboard/Table';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import './SensorsInfo.less';

const block = 'in-agent-sensors-info-selector';

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

export default connectTo(
  props => ({ sensors: listSensors(props.snapshot) }),
  class extends React.Component {
    static displayName = 'Sensors';

    render() {
      if (!this.props.sensors) {
        return null;
      }
      let rows = getRows(this.props.sensors);
      return (
        <Dialog header="Sensors Info" onClose={close} contentClassName={block}>
          <Table withoutPadding cardTitle={`Sensors (${rows.length})`} cols={cols} rows={rows} />

          {this.props.sensors ? (
            <DownloadView
              data={this.props.sensors}
              fileName={`sensors`}
              getJsonData={() => getJsonData(this.props.sensors)}
            />
          ) : null}
        </Dialog>
      );
    }
  }
);

function getJsonData(data) {
  return JSON.stringify(data, null, 4);
}
