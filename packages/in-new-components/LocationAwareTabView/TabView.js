/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withProps } from 'recompose';
import React from 'react';

import Switch from 'in-new-components/LocationAwareTabView/components/Switch';
import Header from 'in-new-components/LocationAwareTabView/components/Header';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { emptyObject } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default compose(
  connectTo(props => ({
    result: props.result$ ? props.result$ : alwaysNull
  })),
  withProps(({ result, withProps: customWithPropsExtension, props }) => {
    if (customWithPropsExtension) {
      return {
        props: {
          ...props,
          ...customWithPropsExtension({ result, ...props })
        }
      };
    }
    return emptyObject;
  })
)(TabView);

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
  tabChangeTracker
}) {
  const filteredTabs = tabs.filter(filterTabByResult(result));
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
