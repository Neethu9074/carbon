/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { AISkeletonText, Accordion, AccordionItem, Button, Callout, Column, Grid, Stack } from '@carbon/react';
import { AiGenerate } from '@carbon/icons-react';
import React, { FC } from 'react';

import { TypographyProps, Typography as TypographyWithMargin } from '@instana/components';
import { ProductiveCard } from '@instana/ibm-products';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import { InvestigationResponse } from 'in-events/subscriptions/rcaInvestigation';
import { toHtml } from 'in-services/formatters/markdown';
import { t, Trans } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/RootCauseInvestigation/RootCauseInvestigation.mless';

const Typography = (props: TypographyProps) => <TypographyWithMargin noMargin {...props} />;
const MarkdownRenderer = (props: { html: string; className?: string }) => (
  <DangerousHtmlPresenter className={locals.llmOutput} {...props} />
);

interface SingleEntityOutputProps {
  backendResponse: InvestigationResponse | null;
  backendLoading: boolean;
  error: String | null;
  startInvestigation: () => void;
}

const SingleEntityOutput: FC<SingleEntityOutputProps> = ({
  backendResponse,
  backendLoading,
  error,
  startInvestigation
}) => {
  return (
    <Stack gap={5} orientation="vertical">
      {!backendResponse && !backendLoading && <InitialState startInvestigation={startInvestigation} />}

      {error && (
        <Callout
          kind="error"
          statusIconDescription="error"
          title={t('in-events:RCA.singleEntityLLM.errorTitle')}
          subtitle={error}
        />
      )}

      {backendLoading && <SingleEntityOutputSkeleton />}

      {backendResponse && (
        <Grid narrow className={locals.grid} fullWidth>
          <Column lg={4}>
            <ProductiveCard aiLabel={<></>} className={locals.cardWithBorder} title="Diagnosis">
              <Typography variant="body-01">
                <MarkdownRenderer html={toHtml(backendResponse.diagnosis.diagnosis)} />
              </Typography>
            </ProductiveCard>
          </Column>

          <Column lg={12}>
            <ProductiveCard title="Summary" className={locals.cardWithBorder}>
              <Stack orientation="vertical" gap={5}>
                <Stack orientation="vertical" gap={3}>
                  <Typography variant="heading-01">
                    {t('in-events:RCA.singleEntityLLM.errorLogSummaryTitle')}
                  </Typography>
                  <Typography variant="body-01">
                    <MarkdownRenderer html={toHtml(backendResponse.trace_error_log_summary)} />
                  </Typography>
                </Stack>

                <Stack orientation="vertical" gap={3}>
                  <Typography variant="heading-01">
                    {t('in-events:RCA.singleEntityLLM.traceLogSummaryTitle')}
                  </Typography>
                  <Typography variant="body-01">
                    <MarkdownRenderer html={toHtml(backendResponse.trace_log_summary)} />
                  </Typography>
                </Stack>

                <Stack orientation="vertical" gap={3}>
                  <Typography variant="heading-01">
                    {t('in-events:RCA.singleEntityLLM.associatedEventsSummaryTitle')}
                  </Typography>
                  <Typography variant="body-01">
                    <MarkdownRenderer html={toHtml(backendResponse.event_summary)} />
                  </Typography>
                </Stack>

                <Accordion>
                  <AccordionItem title={t('in-events:RCA.singleEntityLLM.reasoningTitle')}>
                    <Stack gap={5} orientation="vertical">
                      <Stack gap={3}>
                        <Typography variant="heading-compact-01">
                          {t('in-events:RCA.singleEntityLLM.factualityScoreTitle')}
                        </Typography>
                        <Typography variant="heading-05">
                          {backendResponse.fact_check.factuality_score * 100}%
                        </Typography>
                        <Typography variant="body-compact-01">
                          <MarkdownRenderer html={toHtml(backendResponse.fact_check.reasoning)} />
                        </Typography>
                      </Stack>

                      <Stack gap={3}>
                        <Typography variant="heading-compact-01">
                          {t('in-events:RCA.singleEntityLLM.reasoningTitle')}
                        </Typography>
                        <Typography variant="body-compact-01">
                          <MarkdownRenderer html={toHtml(backendResponse.fact_check.reasoning)} />
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionItem>
                </Accordion>
              </Stack>
            </ProductiveCard>
          </Column>
        </Grid>
      )}
    </Stack>
  );
};

const InitialState: FC<{
  startInvestigation: () => void;
}> = ({ startInvestigation }) => (
  <Stack>
    <Typography variant="body-01">
      <Trans i18nKey="in-events:RCA.singleEntityLLM.runInvestigationInstructions" />
    </Typography>
    <Button renderIcon={AiGenerate} onClick={() => startInvestigation()}>
      {t('in-events:RCA.singleEntityLLM.investigateButtonLabel')}
    </Button>
  </Stack>
);

const SingleEntityOutputSkeleton: FC = () => (
  <Grid narrow className={locals.grid} fullWidth>
    <Column lg={4}>
      <ProductiveCard title={t('in-events:RCA.singleEntityLLM.diagnosisTitle')} className={locals.cardWithBorder}>
        <AISkeletonText lineCount={3} />
      </ProductiveCard>
    </Column>
    <Column lg={12}>
      <ProductiveCard title={t('in-events:labelSummary')} className={locals.cardWithBorder}>
        <AISkeletonText lineCount={3} />
      </ProductiveCard>
    </Column>
  </Grid>
);

export default SingleEntityOutput;
