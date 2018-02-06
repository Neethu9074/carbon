import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BreadcrumbHeader from 'in-applications/TabView/components/BreadcrumbHeader';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import Switch from 'in-applications/TabView/components/Switch';
import Header from 'in-applications/TabView/components/Header';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: props.result$
  }),
  function TabView({ result, breadcrumbs, tabs, HeaderComponent, location }) {
    return (
      <Sticky
        header={
          <div>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            <BreadcrumbHeader />
          </div>
        }
      >
        <MaxWidthFullscreenContainer>
          <Sticky header={<Header location={location} tabs={tabs} result={result} HeaderComponent={HeaderComponent} />}>
            <Switch tabs={tabs} result={result} location={location} />
          </Sticky>
        </MaxWidthFullscreenContainer>
      </Sticky>
    );
  }
);
