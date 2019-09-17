import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { evaluateClassNames } from 'in-services/util/classnames';
import PluginIcon from 'in-components/PluginIcon';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './LocationComponents.mless';

export const SourceLocation = ({ location, sourceService, snapshotId, entity, span }) => {
  return (
    <div
      className={evaluateClassNames({
        [locals.serviceLine]: true,
        [locals.unmonitored]: !snapshotId,
        [locals.hasError]: span && span.errorCount > 0
      })}
    >
      <div className={locals.serviceLineInfo}>
        <span className={locals.locationText}>{location}</span>
        {snapshotId ? (
          <Link className={locals.link} href$={getServiceDashboard(sourceService.id)}>
            <SvgIcon className={locals.entityIcon} type="lib_application_service" />
            {sourceService.label}
          </Link>
        ) : (
          <span className={locals.unmonitoredText}>
            <PluginIcon className={locals.simplePluginIcon} size="xs" /> Unmonitored
          </span>
        )}
      </div>
      <div className={locals.serviceLineAction}>{correctTooltip(location, entity, snapshotId)}</div>
    </div>
  );
};

export const DestinationLocation = ({ location, endpoint, service, snapshotId, entity, span }) => {
  return (
    <div
      className={evaluateClassNames({
        [locals.serviceLine]: true,
        [locals.unmonitored]: !snapshotId,
        [locals.hasError]: span && span.errorCount > 0
      })}
    >
      <div className={locals.serviceLineInfo}>
        <span className={locals.locationText}>{location}</span>
        <Link className={locals.link} href$={getEndpointDashboard(endpoint.id, { serviceId: service.id })}>
          <SvgIcon className={locals.entityIcon} type="lib_application_endpoint" />
          {endpoint.label}
        </Link>
        <span className={locals.text}>of</span>
        <Link className={locals.link} href$={getServiceDashboard(service.id)}>
          <SvgIcon className={locals.entityIcon} type="lib_application_service" />
          {service.label}
        </Link>
      </div>
      {correctTooltip(location, entity, snapshotId)}
    </div>
  );
};

function correctTooltip(location, entity, snapshotId) {
  if (!entity && !snapshotId) {
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
