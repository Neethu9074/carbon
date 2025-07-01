/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { AILabel, AILabelContent, Stack } from '@carbon/react';
import React, { FC, useCallback, useContext, useState } from 'react';

import { Typography } from '@instana/components';
import { createLogger } from '@instana/logger';

import {
  InvestigationResponse,
  startInvestigation as startInvestigationAPI
} from 'in-events/subscriptions/rcaInvestigation';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import SingleEntityOutput from 'in-events/components/RootCauseAnalysis/RootCauseInvestigation/SingleEntityOutput';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/SingleEntityLLM/SingleEntityLLM.mless';

const logger = createLogger('in-events:RCA.Investigation');

const SingleEntityLLM: FC = () => {
  const { incident } = useIncident();
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const { selectedEntityId } = useEntitySelection();
  const rootCauseIndex = rootCauses.findIndex(rc => rc.entityData?.id === selectedEntityId);

  const [backendResponse, setBackendResponse] = useState<(InvestigationResponse | null)[]>(rootCauses.map(() => null));
  const [backendLoading, setBackendLoading] = useState(rootCauses.map(() => false));
  const [error, setError] = useState<(String | null)[]>(rootCauses.map(() => null));

  const serviceId = rootCauses[rootCauseIndex]?.entityStackData?.application.groups.find(g => g.type === 'service')
    ?.items[0].id;

  const startInvestigation = useCallback(() => {
    setBackendLoading(old => {
      var loading = [...old];
      loading[rootCauseIndex] = true;
      return loading;
    });
    setBackendResponse(old => {
      var responses = [...old];
      responses[rootCauseIndex] = null;
      return responses;
    });
    setError(old => {
      var errors = [...old];
      errors[rootCauseIndex] = null;
      return errors;
    });

    const result = startInvestigationAPI({
      rcaEntityId: rootCauseMetadata[rootCauseIndex].entityID,
      triggeringEntityId: {
        host: incident.metadata?.host,
        pluginId: incident.plugin,
        steadyId: incident.metadata?.applicationId
      },
      eventId: incident.id,
      timeConfig: getIncidentTimeConfig(incident),
      applicationId: incident.metadata?.['app20ApplicationId'],
      serviceId
    });

    result.once(
      data => {
        setBackendResponse(old => {
          var responses = [...old];
          responses[rootCauseIndex] = data?.body;
          return responses;
        });
        setBackendLoading(old => {
          var loading = [...old];
          loading[rootCauseIndex] = false;
          return loading;
        });
      },
      err => {
        if (__DEV__) {
          //
          logger.warn(err);
        }
        setError(old => {
          var errors = [...old];
          errors[rootCauseIndex] = t('in-events:RCA.singleEntityLLM.commonErrorMessage');
          return errors;
        });
        setBackendLoading(old => {
          var loading = [...old];
          loading[rootCauseIndex] = false;
          return loading;
        });
      }
    );
  }, [incident, rootCauseMetadata, rootCauseIndex, serviceId]);

  if (rootCauseIndex < 0) {
    return <div>Click on a root cause to get started</div>;
  }

  return (
    <Stack orientation="vertical" className={locals.llmContainer}>
      <Typography variant="heading-compact-02">
        <Stack orientation="horizontal" gap={3}>
          Investigation
          <AILabel>
            <AILabelContent>Details on how we are using this will go here</AILabelContent>
          </AILabel>
        </Stack>
      </Typography>

      <SingleEntityOutput
        startInvestigation={startInvestigation}
        backendLoading={backendLoading[rootCauseIndex]}
        backendResponse={backendResponse[rootCauseIndex]}
        error={error[rootCauseIndex]}
      />
    </Stack>
  );
};

export default SingleEntityLLM;
