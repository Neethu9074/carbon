import React, { Fragment } from 'react';

import { websitePath, websitePathFullyQualified } from 'in-websites/navigation/paths';
import { websiteId as matrixWebsiteId } from 'in-websites/navigation/matrix';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import getWebsite from 'in-subscription/websiteMonitoring/getWebsite';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';

export default function WebsiteDashboard({ location }) {
  const props = {
    websiteId: getMatrixParameter(location, websitePath, matrixWebsiteId),
    viewPath: websitePathFullyQualified,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <TabView
        result$={getWebsite({
          id: props.websiteId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
}

function Header(props) {
  return <BasicDashboardHeader title="Website" icon="lib_kubernetes_service" {...props} />;
}
