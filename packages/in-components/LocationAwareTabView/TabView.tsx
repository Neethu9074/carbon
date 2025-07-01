/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ComponentType, ReactNode } from 'react';

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
import { Location } from 'in-stores/navigation/types';
import Sticky from 'in-components/Sticky';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

export type TabFilterPredicate<TabData, T extends Tab<TabData, any>> = (
  result: Result<TabData> | Nullish
) => (tab: T) => boolean;

export interface TabViewProps<TabData, TabProps extends {}, ExtensionProps extends {}> {
  result$?: Observable<Result<TabData>>;
  tabs: Tab<TabData, TabProps & ExtensionProps>[];
  location: Location;
  props: TabProps;
  withProps?: (props: TabProps & { result: Result<TabData> | Nullish }) => ExtensionProps;
  filterTabByResult?: TabFilterPredicate<TabData, Tab<TabData, TabProps & ExtensionProps>>;
  withoutBreadcrumb?: boolean;
  HeaderComponent: ComponentType<TabProps & ExtensionProps & { result: Result<TabData> | Nullish }>;
  tabChangeTracker?: (props: { tab: string }) => void;
  renderHeaderOnErrors?: boolean;
  renderErrors?: (errors: Error[]) => JSX.Element;
  renderLoading?: () => JSX.Element;
  /**
   * This prop can be used to render additional elements below the tab navigation.
   * Even if this can take any component, it is recommended to wrap your custom elements
   * with the AdditionalDashboardHeader component first.
   */
  additionalHeader?: ReactNode;
  warnMessage?: JSX.Element;
  shouldWrapContentWithSection?: boolean;
}

export default function TabView<TabData, TabProps extends {} = {}, ExtensionProps extends {} = {}>({
  result$,
  renderErrors,
  renderLoading,
  renderHeaderOnErrors = false,
  tabs,
  filterTabByResult = () => () => true,
  HeaderComponent,
  location,
  props,
  withoutBreadcrumb = false,
  tabChangeTracker,
  withProps: customWithPropsExtension,
  additionalHeader,
  warnMessage,
  shouldWrapContentWithSection = true
}: TabViewProps<TabData, TabProps, ExtensionProps>) {
  const isInternalVisible = useObservable(isInternalVisible$, []);
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);
  const result = useObservable(() => result$, [result$]) ?? (result$ ? pendingResult : null);

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
  const hasErrors = result != null && result.errors.length > 0;

  return (
    <section>
      <Sticky
        shouldWrapContentWithSection={shouldWrapContentWithSection}
        header={
          <section aria-label={t('in-components:pageStructure.headerAriaLabel')}>
            {!withoutBreadcrumb && <BreadcrumbHeader />}
            {(!hasErrors || renderHeaderOnErrors) && (
              <Header
                location={location}
                tabs={filteredTabs}
                result={result}
                props={tabProps}
                HeaderComponent={HeaderComponent}
                tabChangeTracker={tabChangeTracker}
                additionalHeader={additionalHeader}
              />
            )}
          </section>
        }
      >
        <div>{warnMessage}</div>

        <Switch
          tabs={filteredTabs}
          result={result}
          hasErrors={hasErrors}
          location={location}
          props={tabProps}
          renderErrors={renderErrors}
          renderLoading={renderLoading}
        />
      </Sticky>
    </section>
  );
}
