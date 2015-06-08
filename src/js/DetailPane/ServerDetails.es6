'use strict';

import React from 'react/addons';

import Panel from './Panel';

const block = 'in-detail-panel-server-details';

const ServerDetails = React.createClass({
  render() {
    const data = this.props.snapshot.get('data');

    return (
      <div className={block}>
        <h1 className={block + '__heading'}>
          Server Details
        </h1>
        <h2 className={block + '__hostname'}>
          {data.get('hostname')}
        </h2>

        <Panel title='System'>
          <dl>
            <dt>OS</dt>
            <dd>
              {data.get('os.name')}
              {data.get('os.arch')}
              {data.get('os.version')}
            </dd>

            <dt>CPU</dt>
            <dd>...</dd>

            <dt>Memory</dt>
            <dd>...</dd>

            <dt>Network Interfaces</dt>
            <dd>...</dd>
          </dl>
        </Panel>
      </div>
    );
  }
});

export default ServerDetails;
