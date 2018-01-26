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
    result: props.get()
  }),
  function TabView({ result, breadcrumbs, tabs, baseDashboardUrl }) {
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
          <Sticky header={<Header tabs={tabs} result={result} baseDashboardUrl={baseDashboardUrl} />}>
            <Switch tabs={tabs} result={result} baseDashboardUrl={baseDashboardUrl} />
          </Sticky>
        </MaxWidthFullscreenContainer>
      </Sticky>
    );
  }
);
