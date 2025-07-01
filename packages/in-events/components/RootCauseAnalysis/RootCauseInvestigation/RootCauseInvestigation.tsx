/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { AISkeletonText, AccordionSkeleton, Accordion, AccordionItem } from '@carbon/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { CarbonCallout, CarbonLayer, PreviewPill, Stack } from '@instana/components';
import { createLogger } from '@instana/logger';
import { t } from '@instana/i18n-react';

import {
  InvestigationResponse,
  startInvestigation as startInvestigationAPI
} from 'in-events/subscriptions/rcaInvestigation';
import SingleEntityOutput from 'in-events/components/RootCauseAnalysis/RootCauseInvestigation/SingleEntityOutput';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { useIncident } from 'in-events/components/providers/IncidentProvider';

const logger = createLogger('in-events:RCA.Investigation');

interface RootCauseInvestigationProps {
  openInvestigation: boolean;
  setOpenInvestigation: React.Dispatch<React.SetStateAction<boolean>>;
}

const RootCauseInvestigation = ({ openInvestigation, setOpenInvestigation }: RootCauseInvestigationProps) => {
  const { incident } = useIncident();
  const { selectedRootCause } = useContext(SelectedRootCauseContext);
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const rootCause = rootCauses[selectedRootCause];
  const serviceId = rootCause.entityStackData?.application.groups.find(g => g.type === 'service')?.items[0].id;

  // backend API
  const [backendResponse, setBackendResponse] = useState<(InvestigationResponse | null)[]>(rootCauses.map(() => null));
  const [backendLoading, setBackendLoading] = useState(rootCauses.map(() => false));
  const [error, setError] = useState<(String | null)[]>(rootCauses.map(() => null));
  const [isExpanded, setIsExpanded] = useState(false);

  const startInvestigation = useCallback(() => {
    setBackendLoading(old => {
      var loading = [...old];
      loading[selectedRootCause] = true;
      return loading;
    });
    setBackendResponse(old => {
      var responses = [...old];
      responses[selectedRootCause] = null;
      return responses;
    });
    setError(old => {
      var errors = [...old];
      errors[selectedRootCause] = null;
      return errors;
    });

    const result = startInvestigationAPI({
      rcaEntityId: rootCauseMetadata[selectedRootCause].entityID,
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
          responses[selectedRootCause] = data?.body;
          return responses;
        });
        setBackendLoading(old => {
          var loading = [...old];
          loading[selectedRootCause] = false;
          return loading;
        });
        setOpenInvestigation(false);
        setIsExpanded(true);
      },
      err => {
        if (__DEV__) {
          logger.warn(err);
        }
        setError(old => {
          var errors = [...old];
          errors[selectedRootCause] = t('in-events:RCA.singleEntityLLM.commonErrorMessage');
          return errors;
        });
        setBackendLoading(old => {
          var loading = [...old];
          loading[selectedRootCause] = false;
          return loading;
        });
        setOpenInvestigation(false);
        setIsExpanded(true);
      }
    );
  }, [incident, rootCauseMetadata, selectedRootCause, setOpenInvestigation, serviceId]);

  useEffect(() => {
    if (openInvestigation) startInvestigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openInvestigation]);

  if (rootCause.loadingSnapshotData || rootCause.loadingSnapshotData) {
    return <AccordionSkeleton count={1} open={false} />;
  }

  return (
    <CarbonLayer>
      <Accordion>
        <AccordionItem
          title={
            <>
              {t('in-events:RCA.singleEntityLLM.investigationPanelTitle')}
              <PreviewPill />
            </>
          }
          open={isExpanded || openInvestigation}
          onHeadingClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          <Stack gap="small">
            {backendLoading[selectedRootCause] && <AISkeletonText lineCount={4} paragraph />}
            {error[selectedRootCause] && (
              <CarbonCallout
                kind="error"
                statusIconDescription="error"
                title={t('in-events:RCA.singleEntityLLM.errorTitle')}
                subtitle={error[selectedRootCause]}
              />
            )}
            <SingleEntityOutput
              startInvestigation={startInvestigation}
              backendResponse={backendResponse[selectedRootCause]}
              backendLoading={backendLoading[selectedRootCause]}
              error={error[selectedRootCause]}
            />
          </Stack>
        </AccordionItem>
      </Accordion>
    </CarbonLayer>
  );
};

export default RootCauseInvestigation;
