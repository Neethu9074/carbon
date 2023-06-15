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
import { Tab, TabHeaderProps } from 'in-components/LocationAwareTabView/types';
import { Result } from '@instana/types';
import { Location } from 'in-stores/navigation/types';
import { Nullish } from 'in-types';

interface HeaderProps<TabData, TabProps extends {}> {
  tabs: Tab<TabData, TabProps>[];
  result: Result<TabData> | Nullish;
  props: TabProps | undefined;
  HeaderComponent: React.ComponentType<TabProps & { result: Result<TabData> | Nullish }>;
  location: Location;
  tabChangeTracker?: (props: { tab: string }) => void;
}

export default function Header<TabData, TabProps extends {} = {}>({
  tabs,
  result,
  HeaderComponent,
  location,
  props,
  tabChangeTracker
}: HeaderProps<TabData, TabProps>) {
  return (
    <div className={locals.header}>
      <HeaderComponent result={result} {...(props as TabProps)} />

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

interface TapComponentProps<TabData, TabProps extends {}> extends TabHeaderProps<TabData, TabProps> {
  tabChangeTracker?: (props: { tab: string }) => void;
}

function TabComponent<TabData, TabProps extends {}>(props: TapComponentProps<TabData, TabProps>) {
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
      icon={tab.icon}
      postIcon={tab.postIcon}
      isActive={isActive}
      isDisabled={isDisabled}
      href$={
        !isDisabled
          ? getModifiedUrlStream(params => {
              params.pathname = tab.path;
            })
          : undefined
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
