import React, { forwardRef } from 'react';

import performantNodeManipulationWrapper from 'in-applications/ApplicationMap/components/Node/PerformantNodeManipulationWrapper';
import ServiceInformation from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/ServerServiceInformation';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import ContextMenu from 'in-applications/ApplicationMap/components/ContextMenu';
import classNames from 'classnames';
import { getButtonKindBySeverity } from 'in-stores/events';
import Overlay from 'in-new-components/overlays/Overlay';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Node.mless';

export default performantNodeManipulationWrapper(NodeComponent);

export function NodeComponent(props) {
  const { node, nodesSize, applicationId, serviceLocatorUid, power } = props;
  const dimensionInPx = 32 + 32 * power;
  const isExternalService = (node.data.applications || []).indexOf(applicationId) === -1;

  return (
    <div
      className={classNames({
        [locals.wrapper]: true
      })}
      style={{
        width: dimensionInPx,
        height: dimensionInPx,
        top: -dimensionInPx / 2,
        left: -dimensionInPx / 2
      }}
    >
      <Overlay
        content={ContextMenu}
        props={props}
        position="fixed"
        onToggle={isOpen => {
          const hiddenEntitiesServiceLocator = getServiceLocators(serviceLocatorUid).hiddenEntitiesServiceLocator;
          if (isOpen) {
            hiddenEntitiesServiceLocator.setHoveredNodeId(null);
            hiddenEntitiesServiceLocator.setSelectedNodeId(node.id);
          } else {
            hiddenEntitiesServiceLocator.setSelectedNodeId(null);
          }
        }}
      >
        {({ toggle, isOpen }) => {
          if (isOpen) {
            return <NodeShape {...props} toggle={toggle} isExternalService={isExternalService} />;
          }
          return (
            <Tooltip
              align="rightMiddle"
              themeStyle="unset"
              content={
                <ServiceInformation
                  service={node.data}
                  applicationId={applicationId}
                  serviceId={node.id}
                  isExternalService={isExternalService}
                />
              }
            >
              <NodeShape {...props} toggle={toggle} isExternalService={isExternalService} />
            </Tooltip>
          );
        }}
      </Overlay>

      {nodesSize !== 'sm' && <div className={locals.label}>{node.data.label}</div>}
    </div>
  );
}

const NodeShape = forwardRef(function NodeShape({ node, serviceLocatorUid, toggle, power, isExternalService }, ref) {
  const maxSeverity = node.data.maxSeverity;
  const iconSize = isExternalService ? 16 + 12 * power : 24 + 24 * power;
  const kind = getButtonKindBySeverity(maxSeverity, 'healthy');

  return (
    <div
      ref={ref}
      className={classNames({
        [locals.shape]: true,
        [locals.isExternal]: isExternalService,
        [locals[`health_${kind}`]]: true
      })}
      onMouseEnter={() => getServiceLocators(serviceLocatorUid).hiddenEntitiesServiceLocator.setHoveredNodeId(node.id)}
      onMouseLeave={() => getServiceLocators(serviceLocatorUid).hiddenEntitiesServiceLocator.setHoveredNodeId(null)}
      onClick={toggle}
    >
      <SvgIcon className={locals.icon} type={getIconByType(node)} size={getIconSizeByPx(iconSize)} />
    </div>
  );
});

function getIconByType(node) {
  const type = node.data.types ? node.data.types[0] : null;
  if (type === 'DATABASE') {
    return 'lib_application_endpoint_type_database';
  }
  if (type === 'MESSAGING') {
    return 'lib_application_endpoint_type_messaging';
  }
  return 'lib_application_service';
}

function getIconSizeByPx(pixels) {
  if (pixels <= 14) {
    return 'xxs';
  }
  if (pixels <= 18) {
    return 'xs';
  }
  if (pixels <= 22) {
    return 's';
  }
  if (pixels <= 28) {
    return 'regular';
  }
  if (pixels <= 40) {
    return 'l';
  }
  if (pixels <= 52) {
    return 'xl';
  }
  return 'xxl';
}
