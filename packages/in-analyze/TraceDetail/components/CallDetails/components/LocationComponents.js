/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { t } from 'in-i18n';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import PluginIcon from 'in-components/PluginIcon';
import { shorten } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './LocationComponents.mless';

export const SourceLocation = ({ location, service, snapshotId, entity, span }) => {
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
          <Link className={locals.link} href$={getServiceDashboard(service.id)}>
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
        <Link className={locals.link} href$={getEndpointDashboard(endpoint.id, { serviceId: service.id })}>
          <SvgIcon className={locals.entityIcon} type="lib_application_endpoint" />
          {shortenedLabel(endpoint.label)}
        </Link>
        <span className={locals.text}>of</span>
        <Link className={locals.link} href$={getServiceDashboard(service.id)}>
          <SvgIcon className={locals.entityIcon} type="lib_application_service" />
          {shortenedLabel(service.label)}
        </Link>
      </div>
      {correctTooltip(location, entity, snapshotId)}
    </div>
  );
};

export const WebsiteSourceLocation = ({ location, beacon }) => {
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
            <Link className={locals.link} href$={getLinkToWebsite(beacon.websiteId, { pageId: beacon.page })}>
              <SvgIcon type="lib_document" size="s" className={locals.icon} />
              {shortenedLabel(beacon.page)}
            </Link>
            <span className={locals.text}>on</span>
          </Fragment>
        ) : (
          ''
        )}
        <Link className={locals.link} href$={getLinkToWebsite(beacon.websiteId)}>
          <SvgIcon className={locals.entityIcon} type="lib_website" />
          {shortenedLabel(beacon.websiteLabel)}
        </Link>
      </div>
    </div>
  );
};

export const MobileAppSourceLocation = ({ location, beacon }) => {
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
            <Link className={locals.link} href$={getLinkToMobileApp(beacon.mobileAppId, { viewId: beacon.view })}>
              <SvgIcon type="lib_mobile_app_view" size="s" className={locals.icon} />
              {shortenedLabel(beacon.view)}
            </Link>
            <span className={locals.text}>on</span>
          </Fragment>
        ) : (
          ''
        )}
        <Link className={locals.link} href$={getLinkToMobileApp(beacon.mobileAppId)}>
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
      <Tooltip content={`Instana does not monitor the ${location} of this call`}>
        <SvgIcon className={locals.infoIcon} type="lib_help_error_info_circle" />
      </Tooltip>
    );
  } else if (!entity && snapshotId) {
    return (
      <Tooltip content="Instana could not correlate this span with the infrastructure that generated it.">
        <SvgIcon className={locals.infoIcon} type="lib_help_error_info_circle" />
      </Tooltip>
    );
  }
}

function shortenedLabel(label) {
  return label.length > 34 ? shorten(label, 34) : label;
}
