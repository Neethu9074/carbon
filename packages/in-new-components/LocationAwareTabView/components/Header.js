import React from 'react';

import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import TabList from 'in-new-components/LocationAwareTabView/components/TabList';
import Tab from 'in-new-components/LocationAwareTabView/components/Tab';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ tabs, result, HeaderComponent, location, props, tabChangeTracker }) {
  return (
    <div className={locals.header}>
      <HeaderComponent result={result} {...props} />

      <DashboardHeaderModule theme={themes.light}>
        {tabs.length === 1 && tabs[0].hideTabLabelWhenAlone ? null : (
          <TabList>
            {tabs.map(tab => (
              <TabComponent
                key={tab.label}
                tab={tab}
                location={location}
                props={props}
                result={result}
                tabChangeTracker={tabChangeTracker}
              />
            ))}
          </TabList>
        )}
        {result && <HorizontalIndicator progress={result.progress} />}
      </DashboardHeaderModule>
    </div>
  );
}

function TabComponent({ tab, result, location, props, tabChangeTracker }) {
  const isActive = location && location.pathname.indexOf(tab.path) === 0;
  const Header = tab.header || DefaultHeader;
  const isTabDisabled = !!(tab.isTabDisabled && tab.isTabDisabled(result));

  const tabContent = (
    <Tab key={tab.label} isSelected={isActive} isDisabled={isTabDisabled}>
      <div className={locals.flexWrapper}>
        {tab.icon && <SvgIcon className={locals.icon} type={tab.icon} />}
        <Header tab={tab} {...props} />
      </div>
    </Tab>
  );

  if (isTabDisabled) {
    return tabContent;
  }

  return (
    <Link
      className={evaluateClassNames({
        [locals.link]: true,
        [locals.selectedLink]: isActive
      })}
      href$={getModifiedUrlStream(params => {
        params.pathname = tab.path;
      })}
      onClick={() => {
        if (tabChangeTracker) {
          tabChangeTracker({
            tab: tab.label
          });
        }
      }}
    >
      {tabContent}
    </Link>
  );
}

function DefaultHeader({ tab }) {
  return tab.label;
}
