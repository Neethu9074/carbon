/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';

import getCloudfoundryApplicationForInstanaApplication from 'in-subscription/cloudfoundry/getCloudfoundryApplicationForInstanaApplication';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Td, Table, Tbody, Tr } from 'in-components/tables/sharedComponents';
import { getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import EntityWithType from 'in-new-components/EntityWithType';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './InstanaServiceToCloudfoundryApplicationButton.mless';

export default connectTo(
  ({ applicationId, serviceId, timeConfig }) => ({
    pcfApplications: getCloudfoundryApplicationForInstanaApplication({ applicationId, serviceId, timeConfig }).map(
      result => result.data
    )
  }),
  InstanaServiceToCloudfoundryApplicationButton
);

export function InstanaServiceToCloudfoundryApplicationButton({ pcfApplications }) {
  if (!pcfApplications || pcfApplications.length === 0) {
    return null;
  }

  const relevantPCFApps = pcfApplications.filter(app => app.guid !== '' && app.name !== '');
  const uniquePCFApps = Array.from(new Set(relevantPCFApps.map(app => app.snapshotId))).map(snapshotId => {
    const pcfAppDistinctSnapshotId = relevantPCFApps.find(app => app.snapshotId === snapshotId);

    return {
      snapshotId: snapshotId,
      guid: pcfAppDistinctSnapshotId.guid,
      name: pcfAppDistinctSnapshotId.name,
      space: pcfAppDistinctSnapshotId.space,
      organization: pcfAppDistinctSnapshotId.organization
    };
  });

  if (!uniquePCFApps || uniquePCFApps.length === 0) {
    return null;
  }

  pcfApplications = uniquePCFApps;

  return (
    <Overlay align="bottomLeft" content={ServiceList} props={{ pcfApplications }} withoutWrapper>
      {({ toggle, isOpen, refSetter }) => (
        <Button
          className={locals.button}
          kind="secondary"
          icon="lib_cloudfoundry_application"
          onClick={toggle}
          refSetter={refSetter}
        >
          {t('in-cloudfoundry:cfApplicationsWithCount', {
            count: pcfApplications.length
          })}
          <SvgIcon className={locals.icon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}

function ServiceList({ pcfApplications }) {
  return (
    <div className={locals.tableWrapper}>
      <Table>
        <Tbody>
          {pcfApplications.map(pcfApp => (
            <Tr key={pcfApp.snapshotId} size="compact">
              <Td className={locals.labelColumn}>
                <SeverityAwareEntityLink
                  icon="lib_cloudfoundry_application"
                  label={pcfApp.name}
                  severity={get(pcfApp, ['entityHealthInfo', 'maxSeverity'], 0)}
                  href$={getApplicationDashboard(pcfApp.snapshotId)}
                />
              </Td>
              <Td>
                <EntityWithType label={pcfApp.organization || valueMissingPlaceholder} type="Organization" />
              </Td>
              <Td>
                <EntityWithType label={pcfApp.space || valueMissingPlaceholder} type="Space" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
