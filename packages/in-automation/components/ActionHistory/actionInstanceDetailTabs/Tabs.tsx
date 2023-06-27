/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactElement, useState } from 'react';

import TabTitle, { TabTitleProps } from 'in-automation/components/ActionHistory/actionInstanceDetailTabs/TabTitle';

import locals from './tabs.mless';

type Props = {
  children: ReactElement<TabTitleProps>[];
  preSelectedTabIndex?: number;
  onTabChange?: (fromTab: number, toTab: number) => void;
};

const Tabs = (props: Props): JSX.Element => {
  const { children, preSelectedTabIndex, onTabChange } = props;

  // First tab is shown by default
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(preSelectedTabIndex || 0);

  return (
    <div className={locals.tabs}>
      <ul>
        {children.map((item, index) => (
          <TabTitle
            key={item.props.title}
            title={item.props.title}
            index={index}
            isActive={index === selectedTabIndex}
            setSelectedTab={() => {
              if (onTabChange) {
                onTabChange(selectedTabIndex, index);
              }
              setSelectedTabIndex(index);
            }}
          />
        ))}
      </ul>

      {/* show selcted tab by index*/}
      {children[selectedTabIndex]}
    </div>
  );
};

export default Tabs;
