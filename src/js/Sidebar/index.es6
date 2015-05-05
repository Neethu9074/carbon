'use strict';

import './index.less';

import React from 'react';
import {Tabs, Tab} from '../components/Tabs';

const Sidebar = React.createClass({

  render() {
    return (
      <Tabs blockIdentifier="in-sidebar">

        <Tab title="Overview">
          <h1 className="in-sidebar__header">Overview</h1>
          <Tabs>
            <Tab title="Servers">Servers...</Tab>
            <Tab title="Services">Services...</Tab>
          </Tabs>
        </Tab>

        <Tab title="Performance">
          <h1 className="in-sidebar__header">Performance</h1>
          <Tabs>
            <Tab title="CPU">CPU...</Tab>
            <Tab title="Memory">Memory...</Tab>
          </Tabs>
        </Tab>

        <Tab title="Tags">
          <h1 className="in-sidebar__header">Tags</h1>
        </Tab>
      </Tabs>
    );
  }
});

export default Sidebar;
