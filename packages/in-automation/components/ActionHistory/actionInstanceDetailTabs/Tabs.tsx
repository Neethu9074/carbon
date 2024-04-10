/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';

import TabTitle from 'in-automation/components/ActionHistory/actionInstanceDetailTabs/TabTitle';

import locals from './tabs.mless';

type Props = {
  children: ReactNode[];
  preSelectedTabIndex?: number;
  onTabChange?: (fromTab: number, toTab: number) => void;
};

const Tabs = (props: Props): JSX.Element => {
  const { children, preSelectedTabIndex, onTabChange } = props;

  // Filter out null or false elements
  const validChildren = children.filter(child => !!child);
  // First tab is shown by default
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(preSelectedTabIndex || 0);

  return (
    <div className={locals.tabs}>
      <ul>
        {validChildren.map((item, index) => {
          // Type guard to ensure item is a valid React element
          if (React.isValidElement(item)) {
            return (
              <TabTitle
                key={index}
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
            );
          }
          return null; // or some fallback
        })}
      </ul>

      {/* show selcted tab by index*/}
      {validChildren[selectedTabIndex]}
    </div>
  );
};

export default Tabs;
