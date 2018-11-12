import React, { Fragment } from 'react';

import { websiteId as matrixWebsiteId, pageId as matrixPageId } from 'in-websites/navigation/matrix';
import { websitePath, websitePathFullyQualified } from 'in-websites/navigation/paths';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import WebsitesBreadcrumb from 'in-websites/breadcrumbs/WebsitesBreadcrumb';
import WebsiteBreadcrumb from 'in-websites/breadcrumbs/WebsiteBreadcrumb';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import getWebsite from 'in-subscription/websiteMonitoring/getWebsite';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import PageBreadcrumb from 'in-websites/breadcrumbs/PageBreadcrumb';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-websites/WebsiteDashboard/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';

export default function WebsiteDashboard({ location }) {
  const props = {
    websiteId: getMatrixParameter(location, websitePath, matrixWebsiteId),
    pageId: getMatrixParameter(location, websitePath, matrixPageId),
    viewPath: websitePathFullyQualified,
    timeConfig: getTimeConfig(location)
  };

  const tagFilters = (props.tagFilters = []);
  tagFilters.push({
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: props.websiteId
  });
  if (props.pageId) {
    tagFilters.push({
      name: 'beacon.page.name',
      operator: 'EQUALS',
      stringValue: props.pageId
    });
  }

  return (
    <Fragment>
      <Breadcrumbs items={getBreadcrumbs(props)} />

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
  return (
    <BasicDashboardHeader title={props.pageId ? 'Page' : 'Website'} icon="lib_website" getLabel={getLabel} {...props} />
  );
}

function getLabel(result, { pageId }) {
  return pageId || result.data.label;
}

function getBreadcrumbs(props) {
  return [
    <WebsitesBreadcrumb />,
    <WebsiteBreadcrumb {...props} />,
    props.pageId && <PageBreadcrumb {...props} />
  ].filter(Boolean);
}
