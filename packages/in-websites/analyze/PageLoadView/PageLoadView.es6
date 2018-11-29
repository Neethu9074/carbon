import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import {
  pageLoadId as pageLoadIdMatrixParameter,
  beaconId as beaconIdMatrixParameter
} from 'in-websites/navigation/matrix';
import getWebsiteBeaconsForPageLoad from 'in-subscription/websiteMonitoring/getWebsiteBeaconsForPageLoad';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { closePageLoadViewLink } from 'in-websites/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { pageLoadViewPath } from 'in-websites/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import tabs from 'in-websites/analyze/PageLoadView/tabs';
import { emptyObject } from 'in-services/fixedObjects';
import { dataSourceTitles } from 'in-websites/tags';
import { shorten } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './PageLoadView.mless';

export default compose(
  withUrlDependingState({
    getPathSegment: () => pageLoadViewPath,
    getMatrixPrefix: () => '',
    boundKeys: [pageLoadIdMatrixParameter, beaconIdMatrixParameter],
    getInitialState: () => ({}),
    reducerName: 'onChange',
    reduceAndGetAsUrlName: 'getChangeAsUrl'
  })
)(PageLoadView);

function PageLoadView(props) {
  const { pageLoadId, beaconType } = props;

  return (
    <Fragment>
      <Breadcrumbs
        items={[<Breadcrumb label={`Analyze ${dataSourceTitles[beaconType]}s`} href$={closePageLoadViewLink} />]}
      />
      <BreadcrumbHeader useFullAvailableWidth />

      <TabView
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        result$={getWebsiteBeaconsForPageLoad({ pageLoadId })}
        withProps={({ result }) => {
          if (result && result.data) {
            return {
              beacons: result.data,
              pageLoadLabel: shorten(
                get(result, ['data', 0, 'page']) || get(result, ['data', 0, 'locationUrl']) || 'Page load not found'
              )
            };
          }
          return emptyObject;
        }}
        props={props}
        withoutBreadcrumb
        useFullAvailableWidth
        withoutPadding
      />
    </Fragment>
  );
}

function Header(props) {
  return (
    <div>
      <BasicDashboardHeader
        title="Page Load"
        icon="lib_website"
        renderActions={Actions}
        getLabel={getLabel}
        {...props}
      />
      <div className={locals.tabViewPlaceholder} />
    </div>
  );
}

function getLabel(result, { pageLoadLabel }) {
  return pageLoadLabel;
}

function Actions({ pageLoadId }) {
  return (
    <Fragment>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={`/api/website-monitoring/page-load;id=${encodeURIComponent(pageLoadId)}?pretty`}
      >
        Download
      </Button>

      <Link href$={closePageLoadViewLink}>
        <Tooltip content="Close page load details">
          <SvgIcon
            className={locals.closeIcon}
            aria-label="Close page load details"
            type="lib_openclose_cancel"
            width={24}
            height={24}
          />
        </Tooltip>
      </Link>
    </Fragment>
  );
}
