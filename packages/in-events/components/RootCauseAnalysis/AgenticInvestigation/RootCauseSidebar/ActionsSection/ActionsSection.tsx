/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 * */

// eslint-disable-next-line no-restricted-imports
import { Button, Link } from '@carbon/react';
import React, { useContext, useState } from 'react';
import { Launch } from '@carbon/icons-react';

import AssociatedEvents from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/ActionsSection/AssociatedEvents';
import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import ErrorsAndLogs from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/ActionsSection/ErrorsAndLogs';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import { useGenerateLinkToAnalyzePage } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
import { t } from 'in-i18n';

import locals from './ActionsSection.mless';

export default function ActionsSection() {
  const [isErrorsAndLogsOpen, setIsErrorsAndLogsOpen] = useState(false);
  const [isAssociatedEventsOpen, setIsAssociatedEventsOpen] = useState(false);

  const { selectedEntityId } = useEntitySelection();
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const rootCauseIndex = rootCauses?.findIndex(rc => rc.entityData?.id === selectedEntityId);
  const { incident } = useIncident();
  const { relatedAPInfo } = useRootCauseTopologyDataContext();

  const urlForAnalysisPage = useGenerateLinkToAnalyzePage(
    rootCauses[rootCauseIndex]?.entityType || 'unknown',
    rootCauseMetadata[rootCauseIndex]?.snapshotId,
    relatedAPInfo,
    rootCauses[rootCauseIndex]?.entityData,
    getIncidentTimeConfig(incident),
    rootCauses[rootCauseIndex]?.nonInfraServiceLabelInformation
  );

  //TODO: Add tracking back

  return (
    <div className={locals.actionsSectionContainer}>
      <Button
        className={locals.buttonStyle}
        kind={'tertiary'}
        onClick={() => {
          setIsErrorsAndLogsOpen(true);
        }}
        size={'sm'}
      >
        {t('in-events:RCA.relatedMessagesAndLogsLabel')}
      </Button>

      <Button
        className={locals.buttonStyle}
        kind={'tertiary'}
        onClick={() => {
          setIsAssociatedEventsOpen(true);
        }}
        size={'sm'}
      >
        {t('in-events:RCA.relatedEventsLabel')}
      </Button>

      <Link renderIcon={Launch} href={urlForAnalysisPage} size="compact">
        {t('in-events:analyzeCalls')}
      </Link>

      <ErrorsAndLogs isOpen={isErrorsAndLogsOpen} setIsOpen={setIsErrorsAndLogsOpen} />
      <AssociatedEvents isOpen={isAssociatedEventsOpen} setIsOpen={setIsAssociatedEventsOpen} />
    </div>
  );
}
