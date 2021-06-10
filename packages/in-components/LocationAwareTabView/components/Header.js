/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { getModifiedUrlStream } from 'in-stores/navigation';

import locals from './Header.mless';

export default function Header({ tabs, result, HeaderComponent, location, props, tabChangeTracker }) {
  return (
    <div className={locals.header}>
      <HeaderComponent result={result} {...props} />

      <DashboardHeaderModule theme={themes.light}>
        {tabs.length === 1 && tabs[0].hideTabLabelWhenAlone ? null : (
          <SecondLevelNavigation>
            {tabs.map(tab => (
              <TabComponent
                key={tab.label}
                {...props}
                tab={tab}
                location={location}
                result={result}
                tabChangeTracker={tabChangeTracker}
              />
            ))}
          </SecondLevelNavigation>
        )}
      </DashboardHeaderModule>
      <DashboardHeaderModule className={locals.loadingModule} withTopBorder={false} theme={themes.light}>
        {result && <HorizontalIndicator className={locals.loadingIndicator} progress={result.progress} />}
      </DashboardHeaderModule>
    </div>
  );
}

function TabComponent(props) {
  const { tab, result, location, tabChangeTracker } = props;
  if (tab.isVisible && !tab.isVisible(result)) {
    return null;
  }

  const isActive = location && location.pathname.indexOf(tab.path) === 0;
  const isDisabled = !!(tab.isDisabled && tab.isDisabled(result));

  return (
    <SecondLevelNavigationItem
      key={tab.label}
      label={tab.header ? tab.header(props) : tab.label}
      isActive={isActive}
      isDisabled={isDisabled}
      href$={
        !isDisabled &&
        getModifiedUrlStream(params => {
          params.pathname = tab.path;
        })
      }
      onClick={() => {
        if (tabChangeTracker) {
          tabChangeTracker({
            tab: tab.label
          });
        }
      }}
    />
  );
}
