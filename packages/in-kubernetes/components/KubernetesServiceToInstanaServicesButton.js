import { get } from 'lodash';
import React from 'react';

import getApplicationServicesForKubernetesService from 'in-subscription/kubernetes/getApplicationServicesForKubernetesService';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { Td, Table, Tbody, Tr } from 'in-components/tables/sharedComponents';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import EntityWithType from 'in-new-components/EntityWithType';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './KubernetesServiceToInstanaServicesButton.mless';

export default connectTo(({ timeConfig, result }) => {
  if (!result || !result.data) {
    return {};
  }
  return {
    instanaServices: getApplicationServicesForKubernetesService({
      kubernetesServiceUid: result.data.uid,
      timeConfig: timeConfig,
      order: {
        by: 'callsAgg',
        direction: 'DESC'
      },
      metrics: {
        callsAgg: {
          metric: 'calls',
          aggregation: 'SUM'
        },
        latencyAgg: {
          metric: 'latency',
          aggregation: 'MEAN'
        },
        errorsAgg: {
          metric: 'errors',
          aggregation: 'MEAN'
        },
        maxSeverity: {
          metric: 'maxSeverity',
          aggregation: 'MAX'
        }
      }
    }).map(result => result.data)
  };
}, KubernetesServiceToInstanaServicesButton);

export function KubernetesServiceToInstanaServicesButton({ instanaServices }) {
  if (!instanaServices || instanaServices.length === 0) {
    return null;
  }

  return (
    <Overlay align="bottomRight" content={ServiceList} props={{ instanaServices }}>
      {({ toggle, isOpen }) => (
        <Button className={locals.button} kind="primaryv2" icon="lib_application_service" onClick={toggle}>
          Services ({instanaServices.length})
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

function ServiceList({ instanaServices }) {
  return (
    <div className={locals.tableWrapper}>
      <Table>
        <Tbody>
          {instanaServices.map(service => (
            <Tr key={service.id} size="compact">
              <Td className={locals.labelColumn}>
                <SeverityAwareEntityLink
                  icon="lib_application_service"
                  label={service.label}
                  severity={get(service, ['metrics', 'maxSeverity', 0, 1], 0)}
                  href$={getServiceDashboard(service.id)}
                />
              </Td>
              <Td>
                <EntityWithType
                  label={number.compact(get(service, ['metrics', 'callsAgg', 0, 1], 0))}
                  type="Inbound Calls"
                />
              </Td>
              <Td>
                <EntityWithType
                  label={meanLatency.detailed(get(service, ['metrics', 'latencyAgg', 0, 1], 0))}
                  type="Latency"
                />
              </Td>
              <Td>
                <EntityWithType
                  label={percentage.detailed(get(service, ['metrics', 'errorsAgg', 0, 1], 0))}
                  type="Errors"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
