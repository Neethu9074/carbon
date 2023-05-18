/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Error, Result } from '@instana/types';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import Switch from 'in-components/LocationAwareTabView/components/Switch';
import Header from 'in-components/LocationAwareTabView/components/Header';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { pendingResult } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';
import { Location } from 'in-stores/navigation/types';
import Sticky from 'in-components/Sticky';
import { Nullish } from 'in-types';

export type TabFilterPredicate<TabData, T extends Tab<TabData, any>> = (
  result: Result<TabData> | Nullish
) => (tab: T) => boolean;

interface TabViewProps<TabData, TabProps extends {}, ExtensionProps extends {}> {
  result$?: Observable<Result<TabData>>;
  tabs: Tab<TabData, TabProps & ExtensionProps>[];
  location: Location;
  props: TabProps;
  withProps?: (props: TabProps & { result: Result<TabData> | Nullish }) => ExtensionProps;
  filterTabByResult?: TabFilterPredicate<TabData, Tab<TabData, TabProps & ExtensionProps>>;
  withoutBreadcrumb?: boolean;
  HeaderComponent: React.ComponentType<TabProps & ExtensionProps & { result: Result<TabData> | Nullish }>;
  tabChangeTracker?: (props: { tab: string }) => void;
  renderHeaderOnErrors?: boolean;
  renderErrors?: (errors: Error[]) => JSX.Element;
}

export default function TabView<TabData, TabProps extends {} = {}, ExtensionProps extends {} = {}>({
  result$,
  renderErrors,
  renderHeaderOnErrors = false,
  tabs,
  filterTabByResult = () => () => true,
  HeaderComponent,
  location,
  props,
  withoutBreadcrumb = false,
  tabChangeTracker,
  withProps: customWithPropsExtension
}: TabViewProps<TabData, TabProps, ExtensionProps>) {
  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);
  const result = useObservable(() => result$?.startWith(pendingResult as Result<TabData>) ?? alwaysNull, [result$]);

  let tabProps = props as TabProps & ExtensionProps;
  if (customWithPropsExtension) {
    tabProps = {
      ...props,
      ...customWithPropsExtension({ result, ...props })
    };
  }
  const filteredTabs = tabs.filter(filterTabByResult(result)).filter(tab => {
    if (tab.isInternal) {
      return isInternalVisible || isTroubleshootingModeEnabled;
    }
    return true;
  });
  const hasErrors = result != undefined && result.errors.length > 0;

  return (
    <section>
      <Sticky
        header={
          <div>
            {!withoutBreadcrumb && <BreadcrumbHeader />}
            {(!hasErrors || renderHeaderOnErrors) && (
              <Header
                location={location}
                tabs={filteredTabs}
                result={result}
                props={tabProps}
                HeaderComponent={HeaderComponent}
                tabChangeTracker={tabChangeTracker}
              />
            )}
          </div>
        }
      >
        <Switch
          tabs={filteredTabs}
          result={result}
          hasErrors={hasErrors}
          location={location}
          props={tabProps}
          renderErrors={renderErrors}
        />
      </Sticky>
    </section>
  );
}
