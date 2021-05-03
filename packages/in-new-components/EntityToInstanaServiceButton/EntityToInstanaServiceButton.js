/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { Td, Table, Tbody, Tr } from 'in-components/tables/sharedComponents';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import EntityWithType from 'in-new-components/EntityWithType';
import Overlay from 'in-new-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';

import locals from './EntityToInstanaServiceButton.mless';

export default connectTo(
  ({ getServices }) => ({
    instanaServices: getServices().map(result => result.data)
  }),
  EntityToInstanaServicesButton
);

export function EntityToInstanaServicesButton({ instanaServices }) {
  if (!instanaServices || instanaServices.length === 0) {
    return null;
  }

  return (
    <Overlay align="bottomLeft" content={ServiceList} props={{ instanaServices }}>
      {({ toggle, isOpen }) => (
        <Button className={locals.button} kind="primaryv2" icon="lib_application_service" onClick={toggle}>
          Services ({instanaServices.length})
          <SvgIcon className={locals.icon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
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
          {instanaServices.map(service => {
            const calls = get(service, ['metrics', 'callsAgg', 0, 1]);
            const latency = get(service, ['metrics', 'latencyAgg', 0, 1]);
            const errors = get(service, ['metrics', 'errorsAgg', 0, 1]);

            return (
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
                  <EndpointTypeBadgeList types={service.types} />
                </Td>
                <Td>
                  <EntityWithType label={calls >= 0 ? number.compact(calls) : valueMissingPlaceholder} type="Calls" />
                </Td>
                <Td>
                  <EntityWithType
                    label={latency >= 0 ? meanLatency.detailed(latency) : valueMissingPlaceholder}
                    type="Latency"
                  />
                </Td>
                <Td>
                  <EntityWithType
                    label={errors >= 0 ? percentage.detailed(errors) : valueMissingPlaceholder}
                    type="Errors"
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}
