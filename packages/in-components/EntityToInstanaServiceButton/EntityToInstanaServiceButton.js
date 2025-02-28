/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { CarbonTable, CarbonTableBody, CarbonTableRow, CarbonTableCell } from '@instana/components';
import { SvgIcon, Button } from '@instana/components';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { number, meanLatency, percentage } from 'in-services/formatters/number';
import { useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import EntityWithType from 'in-components/EntityWithType';
import Overlay from 'in-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
          {t('in-components:entityToInstanaServiceButton.services')} ({instanaServices.length})
          <SvgIcon className={locals.icon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}

function ServiceList({ instanaServices }) {
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  return (
    <div className={locals.tableWrapper}>
      <CarbonTable size="lg">
        <CarbonTableBody>
          {instanaServices.map(service => {
            const calls = get(service, ['metrics', 'callsAgg', 0, 1]);
            const latency = get(service, ['metrics', 'latencyAgg', 0, 1]);
            const errors = get(service, ['metrics', 'errorsAgg', 0, 1]);

            return (
              <CarbonTableRow key={service.id}>
                <CarbonTableCell className={locals.labelColumn}>
                  <SeverityAwareEntityLink
                    icon="lib_application_service"
                    label={service.label}
                    severity={get(service, ['metrics', 'maxSeverity', 0, 1], 0)}
                    href={getLinkToServiceDashboard({ serviceId: service.id })}
                  />
                </CarbonTableCell>
                <CarbonTableCell>
                  <EndpointTypeBadgeList types={service.types} />
                </CarbonTableCell>
                <CarbonTableCell>
                  <EntityWithType label={calls >= 0 ? number.compact(calls) : valueMissingPlaceholder} type="Calls" />
                </CarbonTableCell>
                <CarbonTableCell>
                  <EntityWithType
                    label={latency >= 0 ? meanLatency.detailed(latency) : valueMissingPlaceholder}
                    type="Latency"
                  />
                </CarbonTableCell>
                <CarbonTableCell>
                  <EntityWithType
                    label={errors >= 0 ? percentage.detailed(errors) : valueMissingPlaceholder}
                    type="Errors"
                  />
                </CarbonTableCell>
              </CarbonTableRow>
            );
          })}
        </CarbonTableBody>
      </CarbonTable>
    </div>
  );
}
