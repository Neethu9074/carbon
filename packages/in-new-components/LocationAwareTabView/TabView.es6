import React from 'react';

import Switch from 'in-new-components/LocationAwareTabView/components/Switch';
import Header from 'in-new-components/LocationAwareTabView/components/Header';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: props.result$
  }),
  function TabView({
    result,
    tabs,
    filterTabByResult = () => () => true,
    HeaderComponent,
    location,
    props,
    withoutBreadcrumb = false,
    useFullAvailableWidth = false,
    withoutPadding = false
  }) {
    const filteredTabs = tabs.filter(filterTabByResult(result));
    return (
      <section>
        <Sticky
          header={
            <div>
              {!withoutBreadcrumb && <BreadcrumbHeader />}
              <Header
                location={location}
                tabs={filteredTabs}
                result={result}
                props={props}
                HeaderComponent={HeaderComponent}
                useFullAvailableWidth={useFullAvailableWidth}
              />
            </div>
          }
        >
          <Switch
            tabs={filteredTabs}
            result={result}
            location={location}
            props={props}
            withoutPadding={withoutPadding}
          />
        </Sticky>
      </section>
    );
  }
);
