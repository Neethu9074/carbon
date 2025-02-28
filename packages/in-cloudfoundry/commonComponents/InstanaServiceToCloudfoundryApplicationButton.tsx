/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { CarbonTable, CarbonTableBody, CarbonTableRow, CarbonTableCell, Button, SvgIcon } from '@instana/components';
import { CloudfoundryApplicationLink, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error import EntityWithType from 'in-components/EntityWithType';
import EntityWithType from 'in-components/EntityWithType/EntityWithType';
import getCloudfoundryApplicationForInstanaApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplicationForInstanaApplication';
import { useNavigateToApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './InstanaServiceToCloudfoundryApplicationButton.mless';

export default function InstanaServiceToCloudfoundryApplicationButton({
  applicationId,
  serviceId,
  timeConfig
}: {
  applicationId: string;
  serviceId: string;
  timeConfig: TimeConfig;
}) {
  const pcfApplications = useObservable(
    getCloudfoundryApplicationForInstanaApplication({ applicationId, serviceId, timeConfig }).map(
      result => result.data
    ),
    [applicationId, serviceId, timeConfig]
  );
  return <InstanaServiceToCloudfoundryApplicationButtonPresenter pcfApplications={pcfApplications} />;
}

export function InstanaServiceToCloudfoundryApplicationButtonPresenter({
  pcfApplications
}: {
  pcfApplications: CloudfoundryApplicationLink[];
}) {
  if (!pcfApplications || pcfApplications.length === 0) {
    return null;
  }

  const relevantPCFApps = pcfApplications.filter(app => app.guid !== '' && app.name !== '');
  const uniquePCFApps = Array.from(new Set(relevantPCFApps.map(app => app.snapshotId))).map(snapshotId => {
    const pcfAppDistinctSnapshotId = relevantPCFApps.find(app => app.snapshotId === snapshotId);
    return pcfAppDistinctSnapshotId
      ? {
          snapshotId: snapshotId,
          guid: pcfAppDistinctSnapshotId.guid,
          name: pcfAppDistinctSnapshotId.name,
          space: pcfAppDistinctSnapshotId.space,
          organization: pcfAppDistinctSnapshotId.organization
        }
      : undefined;
  });
  if (!uniquePCFApps || uniquePCFApps.length === 0) {
    return null;
  }
  // @ts-expect-error Type undefined is not assignable to type CloudfoundryApplicationLink
  pcfApplications = uniquePCFApps;
  return (
    <Overlay align="bottomLeft" content={ServiceList} props={{ pcfApplications }} withoutWrapper>
      {({ toggle, isOpen, refSetter }) => (
        <Button
          className={locals.button}
          kind="secondary"
          icon="lib_cloudfoundry_application"
          onClick={toggle}
          // @ts-expect-error ignoring ts error on ref type narrowing issues
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

function ServiceList({ pcfApplications }: { pcfApplications: CloudfoundryApplicationLink[] }) {
  const getApplicationDashboardLink = useNavigateToApplicationDashboard();
  return (
    <div className={locals.tableWrapper}>
      <CarbonTable>
        <CarbonTableBody>
          {pcfApplications.map(pcfApp => (
            <CarbonTableRow key={pcfApp.snapshotId}>
              <CarbonTableCell className={locals.labelColumn}>
                <SeverityAwareEntityLink
                  icon="lib_cloudfoundry_application"
                  label={pcfApp.name}
                  severity={get(pcfApp, ['entityHealthInfo', 'maxSeverity'], 0)}
                  href={getApplicationDashboardLink(pcfApp.snapshotId)}
                />
              </CarbonTableCell>
              <CarbonTableCell>
                <EntityWithType label={pcfApp.organization || valueMissingPlaceholder} type="Organization" />
              </CarbonTableCell>
              <CarbonTableCell>
                <EntityWithType label={pcfApp.space || valueMissingPlaceholder} type="Space" />
              </CarbonTableCell>
            </CarbonTableRow>
          ))}
        </CarbonTableBody>
      </CarbonTable>
    </div>
  );
}
