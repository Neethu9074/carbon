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
import { shorten, isNotBlank } from 'in-services/util/string';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import tabs from 'in-websites/analyze/PageLoadView/tabs';
import { dataSourceTitles } from 'in-websites/tags';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
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
  const { pageLoadId } = props;

  return (
    <Fragment>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
        <TabView
          // Discard all state when the page load ID changes
          key={pageLoadId}
          HeaderComponent={Header}
          location={location}
          tabs={tabs}
          result$={getWebsiteBeaconsForPageLoad({ pageLoadId })}
          withProps={({ result }) => ({
            beacons: result.data,
            pageLoadLabel: shorten(calculateLabel(result))
          })}
          props={props}
          withoutBreadcrumb
          useFullAvailableWidth
          withoutPadding
        />
      </Sticky>
    </Fragment>
  );
}

function Header(props) {
  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <Breadcrumb label={`Analyze ${dataSourceTitles[props.beaconType]}s`} href$={closePageLoadViewLink} />,
          props.pageLoadLabel && <Breadcrumb label="Page Load">{shorten(props.pageLoadLabel, 32)}</Breadcrumb>
        ].filter(Boolean)}
      />
      <BasicDashboardHeader
        title="Page Load"
        icon="lib_website"
        renderActions={Actions}
        getLabel={getLabelForHeader}
        {...props}
      />
      <div className={locals.tabViewPlaceholder} />
    </Fragment>
  );
}

function calculateLabel(result) {
  if (!result || !result.data || result.data.length === 0) {
    return null;
  }

  const page = get(result, ['data', 0, 'page']);
  if (isNotBlank(page)) {
    const origin = get(result, ['data', 0, 'locationOrigin']);
    if (isNotBlank(origin)) {
      return `${page} on ${origin}`;
    }
    return page;
  } else {
    return get(result, ['data', 0, 'locationUrl']);
  }
}

function getLabelForHeader(result, { pageLoadLabel }) {
  return pageLoadLabel;
}

function Actions({ pageLoadId, pageLoadLabel }) {
  return (
    <Fragment>
      {pageLoadLabel && (
        <Button
          icon="lib_actions_download"
          kind="secondary"
          target="_blank"
          href={`/api/website-monitoring/page-load;id=${encodeURIComponent(pageLoadId)}?pretty`}
        >
          Download
        </Button>
      )}

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
