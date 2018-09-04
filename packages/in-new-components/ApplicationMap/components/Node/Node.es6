import React from 'react';

import performantNodeManipulationWrapper from 'in-new-components/ApplicationMap/components/Node/PerformantNodeManipulationWrapper';
import ServiceInformation from 'in-new-components/ApplicationMap/components/Tooltips/ServiceInformation/ServerServiceInformation';
import { getServiceLocators } from 'in-new-components/ApplicationMap/serviceLocator/serviceLocator';
import ContextMenu from 'in-new-components/ApplicationMap/components/ContextMenu';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getButtonKindBySeverity } from 'in-stores/events';
import Overlay from 'in-new-components/overlays/Overlay';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Node.mless';

export default performantNodeManipulationWrapper(NodeComponent);

export function NodeComponent(props) {
  const { node, nodesSize, applicationId, serviceLocatorUid, power } = props;
  const dimensionInPx = 32 + 32 * power;

  return (
    <div
      className={evaluateClassNames({
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
            return <NodeShape {...props} toggle={toggle} />;
          }
          return (
            <Tooltip
              align="rightMiddle"
              themeStyle="unset"
              content={<ServiceInformation service={node.data} applicationId={applicationId} serviceId={node.id} />}
            >
              <NodeShape {...props} toggle={toggle} />
            </Tooltip>
          );
        }}
      </Overlay>

      {nodesSize !== 'sm' && <div className={locals.label}>{node.data.label}</div>}
    </div>
  );
}

function NodeShape({ node, serviceLocatorUid, toggle, power }) {
  const maxSeverity = node.data.maxSeverity;
  const iconSize = 24 + 24 * power;
  const kind = getButtonKindBySeverity(maxSeverity, 'healthy');

  return (
    <div
      className={evaluateClassNames({
        [locals.shape]: true,
        [locals[`health_${kind}`]]: true
      })}
      onMouseEnter={() => getServiceLocators(serviceLocatorUid).hiddenEntitiesServiceLocator.setHoveredNodeId(node.id)}
      onMouseLeave={() => getServiceLocators(serviceLocatorUid).hiddenEntitiesServiceLocator.setHoveredNodeId(null)}
      onClick={toggle}
    >
      <SvgIcon className={locals.icon} type={getIconByType(node)} width={iconSize} height={iconSize} />
    </div>
  );
}

function getIconByType(node) {
  const type = node.data.types[0];
  if (type === 'DATABASE') {
    return 'lib_application_endpoint_type_database';
  }
  if (type === 'MESSAGING') {
    return 'lib_application_endpoint_type_messaging';
  }
  return 'lib_application_service';
}
