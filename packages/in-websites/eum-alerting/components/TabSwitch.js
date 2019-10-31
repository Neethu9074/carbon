import React, { useState } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './TabSwitch.mless';

export default function TabSwitch({ tabs, initialActiveTab = 0, activeTabTracker }) {
  validateInitialActiveTab(initialActiveTab, tabs);
  const [tabIndex, setTabIndex] = useState(() => {
    trackActiveTab(activeTabTracker, initialActiveTab);
    return initialActiveTab;
  });

  return (
    <div>
      <nav>
        <ul className={locals.list}>
          {tabs.map(({ label }, i) => (
            <li
              key={i}
              onClick={() => {
                setTabIndex(i);
                trackActiveTab(activeTabTracker, i);
              }}
              className={evaluateClassNames({
                [locals.item]: true,
                [locals.itemActive]: i === tabIndex
              })}
            >
              <span
                className={evaluateClassNames({
                  [locals.label]: true,
                  [locals.labelActive]: i === tabIndex
                })}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className={locals.content}>{tabs[tabIndex].element}</div>
    </div>
  );
}

function trackActiveTab(activeTabTracker, index) {
  if (typeof activeTabTracker === 'function') {
    activeTabTracker(index);
  }
}

function validateInitialActiveTab(initialActiveTab, tabs) {
  if (__DEV__) {
    const maxLen = tabs.length - 1;
    invariant(
      initialActiveTab >= 0 && initialActiveTab <= maxLen,
      `initialActiveTab with value "${initialActiveTab}" is out of range. I must be >=0 and <=${maxLen}`
    );
  }
}

TabSwitch.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      element: PropTypes.element.isRequired
    }).isRequired
  ),
  initialActiveTab: PropTypes.number,
  activeTabTracker: PropTypes.func
};
