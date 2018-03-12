import React from 'react';

import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import Switch from 'in-new-components/TabView/components/Switch';
import Header from 'in-new-components/TabView/components/Header';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: props.result$
  }),
  function TabView({ result, tabs, HeaderComponent, location, props }) {
    return (
      <section>
        <Sticky
          header={
            <div>
              <BreadcrumbHeader />
              <Header location={location} tabs={tabs} result={result} props={props} HeaderComponent={HeaderComponent} />
            </div>
          }
        >
          <Switch tabs={tabs} result={result} location={location} props={props} />
        </Sticky>
      </section>
    );
  }
);
