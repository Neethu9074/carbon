import React, { Fragment } from 'react';

import TabList from 'in-new-components/TabView/sharedComponents/TabList';
import Tab from 'in-new-components/TabView/sharedComponents/Tab';

import locals from './TabView.mless';

export default class extends React.Component {
  static displayName = 'TabView';

  constructor(props) {
    super(props);

    this.state = { selectedTab: props.tabs[0] };
  }

  render() {
    const { tabs } = this.props;
    const { selectedTab } = this.state;

    return (
      <Fragment>
        <TabList>
          {tabs.map(tab => (
            <Tab
              key={tab.label}
              isSelected={selectedTab === tab}
              onTabClicked={() => this.setState({ selectedTab: tab })}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <div className={locals.content}>{selectedTab && <selectedTab.component {...this.props} />}</div>
      </Fragment>
    );
  }
}
