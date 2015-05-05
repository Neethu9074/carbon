'use strict';

import './Sidebar.less';

import React from 'react';
import {Tabs, Tab} from './Tabs';

const Sidebar = React.createClass({

  render() {
    return (
      <section className="in-sidebar">
        <div className="in-sidebar__content">
          <h1 className="in-sidebar__header">
            Overview
          </h1>

          <Tabs>
            <Tab title="Servers">
              Servers content
            </Tab>
            <Tab title="Services">
              Services content
            </Tab>
          </Tabs>

        </div>
        <ul className="in-sidebar__tabs">
          <li className="in-sidebar__tab in-sidebar__tab--active">Overview</li>
          <li className="in-sidebar__tab">Performance</li>
          <li className="in-sidebar__tab">Tags</li>
        </ul>
      </section>
    );
  }
});

export default Sidebar;
