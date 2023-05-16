/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { Link, SvgIcon } from '@instana/components';

import { useLinkToEndpointDashboard, useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { useLinkToWebsite } from 'in-websites/navigation/paths';
import PluginIcon from 'in-components/PluginIcon';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './LocationComponents.mless';

export const SourceLocation = ({ location, service, snapshotId, entity, span }) => {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  return (
    <div
      className={classNames({
        [locals.serviceLine]: true,
        [locals.unmonitored]: service.id === 'ROOT',
        [locals.hasError]: span && span.errorCount > 0
      })}
    >
      <div className={locals.serviceLineInfo}>
        <span className={locals.locationText}>{location}</span>
        {service.id === 'ROOT' ? (
          <span className={locals.unmonitoredText}>
            <PluginIcon className={locals.simplePluginIcon} />
            {t('in-analyze:traceDetail.callDetails.serviceComponent.notMonitored')}
          </span>
        ) : (
          <Link className={locals.link} href={getLinkToServiceDashboard({ serviceId: service.id })}>
            <SvgIcon className={locals.entityIcon} type="lib_application_service" />
            {service.label}
          </Link>
        )}
      </div>
      <div className={locals.serviceLineAction}>{correctTooltip(location, entity, snapshotId)}</div>
    </div>
  );
};

export const DestinationLocation = ({ location, endpoint, service, snapshotId, entity, span, inProcessCall }) => {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

  return (
    <div
      className={classNames({
        [locals.serviceLine]: true,
        [locals.unmonitored]: snapshotId === null,
        [locals.hasError]: span && span.errorCount > 0
      })}
    >
      <div className={locals.serviceLineInfo}>
        <span className={locals.locationText}>{inProcessCall ? 'IN' : location}</span>
        <Link
          className={locals.link}
          href={getLinkToEndpointDashboard({ serviceId: service.id, endpointId: endpoint.id })}
        >
          <SvgIcon className={locals.entityIcon} type="lib_application_endpoint" />
          {shortenedLabel(endpoint.label)}
        </Link>
        <span className={locals.text}>{t('in-analyze:traceDetail.components.callDetails.of')}</span>
        <Link className={locals.link} href={getLinkToServiceDashboard({ serviceId: service.id })}>
          <SvgIcon className={locals.entityIcon} type="lib_application_service" />
          {shortenedLabel(service.label)}
        </Link>
      </div>
      {correctTooltip(location, entity, snapshotId)}
    </div>
  );
};

export const WebsiteSourceLocation = ({ location, beacon }) => {
  const websiteHrefWithPageid = useLinkToWebsite(beacon.websiteId, { pageId: beacon.page });
  const websiteHref = useLinkToWebsite(beacon.websiteId);

  return (
    <div
      className={classNames({
        [locals.serviceLine]: true
      })}
    >
      <div className={locals.serviceLineInfo}>
        <span className={locals.locationText}>{location}</span>
        {beacon.page ? (
          <Fragment>
            <Link className={locals.link} href={websiteHrefWithPageid}>
              <SvgIcon type="lib_document" size="s" className={locals.icon} />
              {shortenedLabel(beacon.page)}
            </Link>
            <span className={locals.text}>{t('in-analyze:traceDetail.components.callDetails.on')}</span>
          </Fragment>
        ) : (
          ''
        )}
        <Link className={locals.link} href={websiteHref}>
          <SvgIcon className={locals.entityIcon} type="lib_website" />
          {shortenedLabel(beacon.websiteLabel)}
        </Link>
      </div>
    </div>
  );
};

export const MobileAppSourceLocation = ({ location, beacon }) => {
  const linkToMobileAppHref = useGetLinkToMobileApp(beacon.mobileAppId);
  const linkToMobileAppWithViewHref = useGetLinkToMobileApp(beacon.mobileAppId, { viewId: beacon.view });

  return (
    <div
      className={classNames({
        [locals.serviceLine]: true
      })}
    >
      <div className={locals.serviceLineInfo}>
        <span className={locals.locationText}>{location}</span>
        {beacon.view ? (
          <Fragment>
            <Link className={locals.link} href={linkToMobileAppWithViewHref}>
              <SvgIcon type="lib_mobile_app_view" size="s" className={locals.icon} />
              {shortenedLabel(beacon.view)}
            </Link>
            <span className={locals.text}>{t('in-analyze:traceDetail.components.callDetails.on')}</span>
          </Fragment>
        ) : (
          ''
        )}
        <Link className={locals.link} href={linkToMobileAppHref}>
          <SvgIcon className={locals.entityIcon} type="lib_mobile_app" />
          {shortenedLabel(beacon.mobileAppLabel)}
        </Link>
      </div>
    </div>
  );
};

function correctTooltip(location, entity, snapshotId) {
  if (!entity && snapshotId === null) {
    return (
      <Tooltip
        content={t('in-analyze:traceDetail.components.callDetails.instanaDoesNotMonitorTheLocationOfThisCall', {
          location: location
        })}
      >
        <SvgIcon className={locals.infoIcon} type="lib_help_error_info_circle" />
      </Tooltip>
    );
  } else if (!entity && snapshotId) {
    return (
      <Tooltip
        content={t(
          'in-analyze:traceDetail.components.callDetails.instanaCouldNotCorrelateThisSpanWithTheInfrastructureThatGeneratedIt'
        )}
      >
        <SvgIcon className={locals.infoIcon} type="lib_help_error_info_circle" />
      </Tooltip>
    );
  }
}

function shortenedLabel(label) {
  return label.length > 34 ? shorten(label, 34) : label;
}
