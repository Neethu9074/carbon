import { get } from 'lodash';
import React from 'react';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import getEndpoint from 'in-subscription/application/getEndpoint';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ScopeNotification.mless';

export default connectTo(
  ({ applicationId, serviceId, endpointId }) => ({
    applicationLabel: applicationId ? getApplication({ id: applicationId }).map(getLabel) : alwaysNull,
    serviceLabel: serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : alwaysNull,
    endpointLabel: endpointId
      ? timeConfig$.flatMap(timeConfig => getEndpoint({ id: endpointId, filter: { timeConfig } })).map(getLabel)
      : alwaysNull
  }),
  function ScopeNotification({
    productArea,
    contextScope,
    applicationId,
    serviceId,
    endpointId,
    applicationLabel,
    serviceLabel,
    endpointLabel,
    icon,
    onClose
  }) {
    let entityLabel;
    let href;
    if (endpointId) {
      entityLabel = endpointLabel;
      href = getEndpointDashboard(endpointId, { applicationId, serviceId });
    } else if (serviceId) {
      entityLabel = serviceLabel;
      href = getServiceDashboard(serviceId, { applicationId });
    } else if (applicationId) {
      entityLabel = applicationLabel;
      href = getApplicationDashboard(applicationId);
    }

    return (
      <div className={locals.wrapper}>
        <SvgIcon size="s" className={locals.icon} type={icon} />
        <div className={locals.notificationText}>
          Showing {productArea}s <span className={locals.bold}>{contextScope.toLowerCase()}</span> of{' '}
          <Link className={locals.bold} href$={href}>
            {entityLabel}
          </Link>
          {applicationLabel &&
            (serviceLabel || endpointLabel) && (
              <>
                <span> in context of </span>
                <Link className={locals.bold} href$={getApplicationDashboard(applicationId)}>
                  {applicationLabel}
                </Link>
              </>
            )}
        </div>
        <div>
          <Button icon="lib_openclose_circle" size="compact" onClick={onClose}>
            Show all {productArea}s
          </Button>
        </div>
      </div>
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
