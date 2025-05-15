/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { AILabel, AILabelContent, AISkeletonText, AccordionSkeleton, Accordion, AccordionItem } from '@carbon/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import {
  CarbonCallout,
  CarbonLayer,
  PreviewPill,
  Stack,
  TypographyProps,
  Typography as TypographyWithMargin
} from '@instana/components';
import { createLogger } from '@instana/logger';
import { Trans, t } from '@instana/i18n-react';

import {
  InvestigationResponse,
  startInvestigation as startInvestigationAPI
} from 'in-events/subscriptions/rcaInvestigation';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';
import { Event } from 'in-types';

import locals from 'in-events/components/RootCauseAnalysis/RootCauseInvestigation/RootCauseInvestigation.mless';

const logger = createLogger('in-events:RCA.Investigation');

const Typography = (props: TypographyProps) => <TypographyWithMargin noMargin {...props} />;
const MarkdownRenderer = (props: { html: string; className?: string }) => (
  <DangerousHtmlPresenter className={locals.llmOutput} {...props} />
);

interface RootCauseInvestigationProps {
  openInvestigation: boolean;
  incident: Event;
  setOpenInvestigation: React.Dispatch<React.SetStateAction<boolean>>;
}

const RootCauseInvestigation = ({ openInvestigation, incident, setOpenInvestigation }: RootCauseInvestigationProps) => {
  const { selectedRootCause } = useContext(SelectedRootCauseContext);
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const rootCause = rootCauses[selectedRootCause];

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
      applicationId: incident.metadata?.['app20ApplicationId']
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
  }, [incident, rootCauseMetadata, selectedRootCause, setOpenInvestigation]);

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

const SingleEntityOutput = ({
  backendResponse,
  backendLoading,
  error
}: {
  backendResponse: InvestigationResponse | null;
  backendLoading: boolean;
  error: String | null;
}) => {
  if (backendResponse === null) {
    if (!backendLoading) {
      return error === null ? (
        <Typography variant="body-01">
          <Trans i18nKey="in-events:RCA.singleEntityLLM.runInvestigationInstructions" />
        </Typography>
      ) : (
        <></>
      );
    } else {
      return <></>;
    }
  } else {
    return (
      <>
        <Stack gap="xxsmall">
          <Stack gap="xsmall" direction="horizontal">
            <Typography variant="heading-compact-02">{t('in-events:RCA.singleEntityLLM.diagnosisTitle')}</Typography>
            <AILabel>
              <AILabelContent>
                <Stack gap="small">
                  <Stack gap="xxsmall">
                    <Typography variant="body-compact-01">
                      {t('in-events:RCA.singleEntityLLM.aiExplainedTitle')}
                    </Typography>
                    <Typography variant="heading-05">{backendResponse.fact_check.factuality_score * 100}%</Typography>
                  </Stack>

                  <Stack gap="xxsmall">
                    <Typography variant="heading-compact-01">
                      {t('in-events:RCA.singleEntityLLM.factualityScoreTitle')}
                    </Typography>
                    <Typography variant="body-compact-01">
                      <MarkdownRenderer html={toHtml(backendResponse.fact_check.reasoning)} />
                    </Typography>
                  </Stack>

                  <Stack gap="xxsmall">
                    <Typography variant="heading-compact-01">
                      {t('in-events:RCA.singleEntityLLM.reasoningTitle')}
                    </Typography>
                    <Typography variant="body-compact-01">
                      <MarkdownRenderer
                        html={toHtml(backendResponse.diagnosis.reasoning, {
                          breaks: true,
                          typographer: true,
                          html: true
                        })}
                      />
                    </Typography>
                  </Stack>
                </Stack>
              </AILabelContent>
            </AILabel>
          </Stack>
          <Typography variant="body-01">
            <MarkdownRenderer html={toHtml(backendResponse.diagnosis.diagnosis)} />
          </Typography>
        </Stack>

        <Stack gap="xxsmall">
          <Typography variant="heading-01">{t('in-events:RCA.singleEntityLLM.errorLogSummaryTitle')}</Typography>
          <Typography variant="body-01">
            <MarkdownRenderer html={toHtml(backendResponse.trace_error_log_summary)} />
          </Typography>
        </Stack>

        <Stack gap="xxsmall">
          <Typography variant="heading-01">{t('in-events:RCA.singleEntityLLM.traceLogSummaryTitle')}</Typography>
          <Typography variant="body-01">
            <MarkdownRenderer html={toHtml(backendResponse.trace_log_summary)} />
          </Typography>
        </Stack>

        <Stack gap="xxsmall">
          <Typography variant="heading-01">
            {t('in-events:RCA.singleEntityLLM.associatedEventsSummaryTitle')}
          </Typography>
          <Typography variant="body-01">
            <MarkdownRenderer html={toHtml(backendResponse.event_summary)} />
          </Typography>
        </Stack>
      </>
    );
  }
};

export default RootCauseInvestigation;
