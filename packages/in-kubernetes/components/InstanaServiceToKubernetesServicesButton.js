import { get } from 'lodash';
import React from 'react';

import getKubernetesServicesForApplicationService from 'in-subscription/kubernetes/getKubernetesServicesForApplicationService';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import ServiceTypeBadgeList from 'in-kubernetes/components/ServiceTypeBadgeList';
import { Td, Table, Tbody, Tr } from 'in-components/tables/sharedComponents';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import EntityWithType from 'in-new-components/EntityWithType';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './InstanaServiceToKubernetesServicesButton.mless';

export default connectTo(
  ({ applicationId, serviceId, timeConfig }) => ({
    kubernetesServices: getKubernetesServicesForApplicationService({ applicationId, serviceId, timeConfig }).map(
      result => result.data
    )
  }),
  InstanaServiceToKubernetesServicesButton
);

export function InstanaServiceToKubernetesServicesButton({ kubernetesServices }) {
  if (!kubernetesServices || kubernetesServices.length === 0) {
    return null;
  }

  return (
    <Overlay align="bottomRight" content={ServiceList} props={{ kubernetesServices }}>
      {({ toggle, isOpen }) => (
        <Button className={locals.button} kind="primaryv2" icon="lib_kubernetes_service" onClick={toggle}>
          Services ({kubernetesServices.length})
          <SvgIcon
            className={locals.icon}
            type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
            width={24}
            height={24}
          />
        </Button>
      )}
    </Overlay>
  );
}

function ServiceList({ kubernetesServices }) {
  return (
    <div className={locals.tableWrapper}>
      <Table>
        <Tbody>
          {kubernetesServices.map(service => (
            <Tr key={service.snapshotId} size="compact">
              <Td className={locals.labelColumn}>
                <SeverityAwareEntityLink
                  icon="lib_kubernetes_service"
                  label={service.name}
                  severity={get(service, ['entityHealthInfo', 'maxSeverity'], 0)}
                  href$={getServiceDashboard(service.snapshotId)}
                />
              </Td>
              <Td>
                <ServiceTypeBadgeList type={service.type} />
              </Td>
              <Td>
                <EntityWithType label={service.clusterName || valueMissingPlaceholder} type="Cluster" />
              </Td>
              <Td>
                <EntityWithType label={service.namespace || valueMissingPlaceholder} type="Namespace" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
