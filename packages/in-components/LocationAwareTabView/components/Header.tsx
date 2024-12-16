/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ComponentType, ReactNode } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { HorizontalIndicator } from '@instana/components';
import { Result } from '@instana/types';

import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { Location } from 'in-stores/navigation/types';
import { Nullish } from 'in-types';

import locals from './Header.mless';

interface HeaderProps<TabData, TabProps extends {}> {
  tabs: Tab<TabData, TabProps>[];
  result: Result<TabData> | Nullish;
  props: TabProps | undefined;
  HeaderComponent: ComponentType<TabProps & { result: Result<TabData> | Nullish }>;
  location: Location;
  /**
   * This prop can be used to render additional elements below the header.
   * Even if this can take any component, it is recommended to wrap your custom elements
   * with the AdditionalDashboardHeader component first.
   */
  additionalHeader?: ReactNode;
  tabChangeTracker?: (props: { tab: string }) => void;
}

export default function Header<TabData, TabProps extends {} = {}>({
  tabs,
  result,
  HeaderComponent,
  location,
  props,
  additionalHeader,
  tabChangeTracker
}: HeaderProps<TabData, TabProps>) {
  // Workaround for finding out selectedIndex using the same logic as below. This is for carbonVariant of SecondLevelNavigation
  const selectedIndex =
    tabs?.findIndex(tab => {
      return location && location.pathname.indexOf(tab.path) === 0;
    }) || 0;

  const { createHrefToPath } = useNavigation();

  const visibleTabs = tabs.filter(tab => {
    if (tab.isVisible && !tab.isVisible(result)) {
      return false;
    }
    return true;
  });

  return (
    <div className={locals.header}>
      <HeaderComponent result={result} {...(props as TabProps)} />

      <DashboardHeaderModule theme={themes.light}>
        {tabs.length === 1 && tabs[0].hideTabLabelWhenAlone ? null : (
          <SecondLevelNavigation selectedIndex={selectedIndex}>
            {visibleTabs.map(tab => {
              const isActive = location && location.pathname.indexOf(tab.path) === 0;
              const isDisabled = !!(tab.isDisabled && tab.isDisabled(result));

              const tabProp = {
                label: tab.label,
                tab,
                result,
                location
              };

              return (
                <SecondLevelNavigationItem
                  key={tab.label}
                  label={tab.header ? tab.header(tabProp) : tab.label}
                  icon={tab.icon}
                  postIcon={tab.postIcon}
                  isActive={isActive}
                  isDisabled={isDisabled}
                  href={!isDisabled ? createHrefToPath(tab.path) : undefined}
                  onClick={() => {
                    if (tabChangeTracker) {
                      tabChangeTracker({
                        tab: tab.label
                      });
                    }
                  }}
                />
              );
            })}
          </SecondLevelNavigation>
        )}
      </DashboardHeaderModule>
      {additionalHeader}
      <DashboardHeaderModule className={locals.loadingModule} withTopBorder={false} theme={themes.light}>
        {result && <HorizontalIndicator className={locals.loadingIndicator} progress={result.progress} />}
      </DashboardHeaderModule>
    </div>
  );
}
