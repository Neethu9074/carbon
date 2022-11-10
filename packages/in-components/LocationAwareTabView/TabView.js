/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import Switch from 'in-components/LocationAwareTabView/components/Switch';
import Header from 'in-components/LocationAwareTabView/components/Header';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { alwaysNull } from 'in-services/fixedStreams';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => ({
  result: props.result$ ? props.result$ : alwaysNull,
  isInternalVisible: isInternalVisible$,
  isTroubleshootingModeEnabled: isTroubleshootingModeEnabled$
}))(TabView);

function TabView({
  result,
  renderErrors,
  renderHeaderOnErrors = false,
  tabs,
  filterTabByResult = () => () => true,
  HeaderComponent,
  location,
  props,
  withoutBreadcrumb = false,
  tabChangeTracker,
  isInternalVisible,
  isTroubleshootingModeEnabled,
  WithProps
}) {
  if (WithProps && !result.progress.loading) {
    props = {
      ...props,
      ...WithProps({ result, ...props })
    };
  }
  const filteredTabs = tabs.filter(filterTabByResult(result)).filter(tab => {
    if (tab.isInternal) {
      return isInternalVisible || isTroubleshootingModeEnabled;
    }
    return true;
  });
  const hasErrors = result && result.errors.length > 0;

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
                props={props}
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
          props={props}
          renderErrors={renderErrors}
        />
      </Sticky>
    </section>
  );
}
