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
    HeaderComponent,
    location,
    props,
    withoutBreadcrumb = false,
    useFullAvailableWidth = false,
    withoutPadding = false
  }) {
    return (
      <section>
        <Sticky
          header={
            <div>
              {!withoutBreadcrumb && <BreadcrumbHeader />}
              <Header
                location={location}
                tabs={tabs}
                result={result}
                props={props}
                HeaderComponent={HeaderComponent}
                useFullAvailableWidth={useFullAvailableWidth}
              />
            </div>
          }
        >
          <Switch tabs={tabs} result={result} location={location} props={props} withoutPadding={withoutPadding} />
        </Sticky>
      </section>
    );
  }
);
