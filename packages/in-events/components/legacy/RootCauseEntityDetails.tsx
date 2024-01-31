/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import { Link, Stack, SvgIcon, Typography } from '@instana/components';
import { Endpoint, ServiceLabel, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import { SnapshotData, getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import { Location, MatrixParameters, Parameters } from 'in-stores/navigation/types';
import AIProbabilityBadge from 'in-events/components/legacy/AIProbabilityBadge';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { setTimeConfig } from 'in-stores/time/config';
import { useTheme } from 'in-themes';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseEntityDetailsParams {
  selectedSnapshotMetadata: Map<string, string>;
  eventsRelatedToEntity: [string];
  probabilityScore: number | null | undefined;
  relatedAPID: string | null;
}

const endpointIDURLParameter = 'endpointId';
const serviceIDURLParameter = 'serviceId';
const appIDURLParameter = 'appId';

export default function RootCauseEntityDetails({
  selectedSnapshotMetadata,
  eventsRelatedToEntity,
  probabilityScore,
  relatedAPID
}: RootCauseEntityDetailsParams): JSX.Element {
  const [query, setQuery] = useState<
    Observable<SnapshotData> | Observable<Endpoint | undefined> | Observable<ServiceLabel | undefined> | null | string
  >(null);
  const theme = useTheme();
  const { location } = useNavigation();
  const entityType = selectedSnapshotMetadata.get('EntityType');
  const originalID = selectedSnapshotMetadata.get('UntransformedEntityID');

  const urlForEntity = useGenerateLinksForEntity(entityType, originalID, location, relatedAPID);

  // generates a list of event information based on Observables
  //@ts-expect-error
  const entityInformation = useObservable(query, [query], { resetStateOnObservableChange: true }) ?? null;

  useEffect(() => {
    if (entityType === 'infrastructure' || entityType === 'process') {
      // Need to get snapshot versions first and then retrieve appropriate snapshot
      setQuery(
        getSnapshotVersions(originalID).map((versions: List<string>) => {
          if (List.isList(versions)) {
            const snapVersions = versions.toJS();
            if (snapVersions.length > 0) {
              const { to, from } = snapVersions[snapVersions.length - 1];

              const timeConfigFromSnapVersion = {
                windowSize: (to || Date.now()) - from,
                to,
                focusedMoment: to
              } as TimeConfig;
              setTimeConfig(location, timeConfigFromSnapVersion);
              setQuery(getSnapshot(originalID, timeConfigFromSnapVersion));
            }
          }
        })
      );
    } else if (entityType === 'endpoint') {
      setQuery(getEndpointInfo({ id: originalID }).map(data => data.data));
    } else if (entityType === 'service') {
      setQuery(getServiceLabel({ id: originalID }).map(data => data.data));
    } else if (entityType === 'application') {
      setQuery(getApplication({ id: originalID }).map(data => data.data));
    }
  }, [originalID, entityType, selectedSnapshotMetadata, location]);

  if (entityInformation === null || (entityInformation?.progress && entityInformation.progress?.loading)) {
    return <LoadingIndicator />;
  }

  return (
    <div className={locals.entityDescription}>
      <Stack gap="small">
        <Stack direction="horizontal" gap="small" align="center">
          <Typography variant="body-bold">{t('in-events:RCA.probableRootCauseLabel')}</Typography>
          {entityInformation !== null && (
            <Link href={urlForEntity}>
              <Stack direction="horizontal" align="center" gap="xxsmall">
                <SvgIcon type={getIcon(entityType)} color={theme.cds.link.primary} />
                {Map.isMap(entityInformation) ? entityInformation?.get('label') : entityInformation?.label}
              </Stack>
            </Link>
          )}
          <AIProbabilityBadge probabilityScore={probabilityScore} />
        </Stack>

        <Typography variant="body-regular">
          {t('in-events:RCA.relatedEventsLabel', {
            number_of_events: Array.isArray(eventsRelatedToEntity) ? eventsRelatedToEntity.length : 0
          })}
        </Typography>
      </Stack>
    </div>
  );
}

function useGenerateLinksForEntity(
  entityType: string,
  originalID: string,
  location: Location,
  relatedAPID: string | null
): string | undefined {
  const { createHref } = useNavigation();

  const query = { ...location.query };
  const matrixParam = {} as MatrixParameters;
  let pathname = '';

  if (entityType === 'infrastructure' || entityType === 'process') {
    query[snapshotIdUrlParameter.name] = originalID;
    pathname = '/physical/dashboard';
  } else if (entityType === 'endpoint') {
    pathname = '/endpoint/summary';
    matrixParam['/endpoint'] = buildMatrixParam(endpointIDURLParameter, originalID, relatedAPID);
  } else if (entityType === 'service') {
    pathname = '/service/summary';
    matrixParam['/service'] = buildMatrixParam(serviceIDURLParameter, originalID, relatedAPID);
    //query[serviceIDURLParameter] = originalID;
  } else if (entityType === 'application') {
    pathname = '/application/summary';
    matrixParam['/application'] = buildMatrixParam(appIDURLParameter, originalID, null);
  }

  if (pathname !== '') {
    return createHref({
      ...location,
      pathname,
      query,
      matrix: matrixParam
    });
  }
  return undefined;
}

function buildMatrixParam(
  entityURLParameterType: string,
  originalEntityID: string,
  relatedAPID: string | null
): Parameters {
  const builtMatrixParam = { [entityURLParameterType]: originalEntityID };

  if (relatedAPID) {
    builtMatrixParam[appIDURLParameter] = relatedAPID;
  }

  return builtMatrixParam;
}

function getIcon(entityType: string): string {
  if (entityType === 'infrastructure') {
    return 'lib_infrastructure';
  } else if (entityType === 'process') {
    return 'lib_infra_process';
  } else if (entityType === 'endpoint') {
    return 'lib_infra_endpoint';
  } else if (entityType === 'service') {
    return 'lib_infra_service';
  } else if (entityType === 'application') {
    return 'lib_application';
  } else {
    return 'lib_infra_unknownIcon';
  }
}
