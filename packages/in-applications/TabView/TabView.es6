import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BreadcrumbHeader from 'in-applications/TabView/components/BreadcrumbHeader';
import Switch from 'in-applications/TabView/components/Switch';
import Header from 'in-applications/TabView/components/Header';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: props.result$
  }),
  function TabView({ result, tabs, HeaderComponent, location, props }) {
    return (
      <Sticky
        header={
          <div>
            <BreadcrumbHeader />
            <Header location={location} tabs={tabs} result={result} props={props} HeaderComponent={HeaderComponent} />
          </div>
        }
      >
        <MaxWidthFullscreenContainer>
          <Switch tabs={tabs} result={result} location={location} props={props} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    );
  }
);
