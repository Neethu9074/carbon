'use strict';

import './index.less';

import React from 'react';
import {Tabs, Tab} from '../components/Tabs';
import Overview from './Overview';
import Performance from './Performance';

const Sidebar = React.createClass({

  render() {
    return (
      <Tabs blockIdentifier="in-sidebar" collapsible={true}>

        <Tab title="Overview">
          <h1 className="in-sidebar__header">Overview</h1>
          <Overview />
        </Tab>

        <Tab title="Performance">
          <h1 className="in-sidebar__header">Performance</h1>
          <Performance />
        </Tab>

        <Tab title="Tags">
          <h1 className="in-sidebar__header">Tags</h1>
        </Tab>
      </Tabs>
    );
  }
});

export default Sidebar;
