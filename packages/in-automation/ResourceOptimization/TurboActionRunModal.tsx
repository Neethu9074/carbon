/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import {
  ResourceImpactEntities,
  AgentSnapshot,
  ImpactedApplicationDetails,
  TurboActionCategory,
  VolatileId
} from '@instana/types';
import {
  Button,
  CarbonDropdown,
  CarbonModal,
  LoadingSkeleton,
  Pill,
  Spacer,
  Stack,
  Typography
} from '@instana/components';
import { Link } from '@instana/components';

import {
  useResourceImpacts,
  useActionImpactedApplications
} from 'in-automation/ResourceOptimization/useResourceOptimization';
import { turboActionCategoryMap } from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import { refresh as refreshScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { ActionInstance } from 'in-automation/subscriptions/turboSubmitActionExecution';
import { setActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import { refreshHistory } from 'in-automation/AutomationCard/useHistory';
import { runResourceOptimizationAction } from 'in-automation/api';
import { close } from 'in-components/DialogPresenter/store';
import { useSegmentTracker } from 'in-automation/tracker';
import { ScoredAction } from 'in-automation/types';
import { t, Trans } from 'in-i18n';

import locals from './DetailsModal.mless';

interface DetailsModalProps {
  action: ScoredAction;
  agents: AgentSnapshot[];
  targetSnapshotId: string;
  eventId?: string;
}

function LoadingSkeletons({ n = 3 }: { n?: number }) {
  if (n <= 0 || n > 10) {
    n = 1;
  }
  return (
    <>
      {Array.from({ length: n }, (__, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </>
  );
}

const showToastNotification = (data: ActionInstance, actionName: string) => {
  const error = data.errorMessage;
  addMessage(
    {
      type: error ? 'danger' : 'info',
      content: (
        <Stack direction="vertical">
          <Trans
            i18nKey={
              error
                ? 'in-automation:resourceOptimization.actionFailedMessage'
                : 'in-automation:resourceOptimization.actionStartedMessage'
            }
            values={{ actionName: actionName, message: data.errorMessage }}
            components={{ bold: <strong /> }}
          />
          <Button
            kind="tertiary"
            onClick={() => {
              setActiveKey('actionHistory');
              removeMessage('run-resource-optimization');
            }}
          >
            {t('in-automation:resourceOptimization.viewActionHistory')}
          </Button>
        </Stack>
      ),
      title: t(
        error ? 'in-automation:resourceOptimization.actionFailed' : 'in-automation:resourceOptimization.actionStarted'
      )
    },
    'run-resource-optimization'
  );
};

const handleRunAction = (
  params: {
    volatileId: VolatileId;
    createdDate: number;
    actionName: string;
    actionInstanceId: string;
    eventId?: string;
  },
  setStateFunctions: {
    setIsSavingAction: React.Dispatch<React.SetStateAction<boolean>>;
    setRunActionError: React.Dispatch<React.SetStateAction<string>>;
    setRunActionResponseId: React.Dispatch<React.SetStateAction<string>>;
  },
  runOptimizationTrackerSegment: (params: Record<string, string>) => void
) => {
  const { setIsSavingAction, setRunActionError, setRunActionResponseId } = setStateFunctions;

  setIsSavingAction(true);
  runResourceOptimizationAction(params).once((data: ActionInstance) => {
    setIsSavingAction(false);
    refreshHistory();

    if (data.errorMessage) {
      setRunActionError(data.errorMessage);
      setRunActionResponseId(data.actionInstanceId);
      runOptimizationTrackerSegment({
        actionName: params.actionName,
        source: 'Turbonomic',
        errorMessage: data.errorMessage
      });
      close();
    } else {
      setRunActionResponseId(data.actionInstanceId);
      runOptimizationTrackerSegment({ actionName: params.actionName, source: 'Turbonomic' });
      close();
      refreshScoredActions();
    }
    showToastNotification(data, params.actionName);
  });
};

const getActionLoadingStatus = (isSavingAction: boolean, runActionError: string, runActionResponseId: string) => {
  if (isSavingAction) return 'active';
  if (runActionError) return 'error';
  if (runActionResponseId) return 'finished';
  return 'inactive';
};

function ApplicationImpactSection({
  appImpactLoading,
  impactedApplications,
  errorMessageAppImpact
}: {
  appImpactLoading: boolean;
  impactedApplications: any;
  errorMessageAppImpact: any;
}) {
  return (
    <div className={locals.impactedAppsSection}>
      {/* Headers Row */}
      <div className={locals.impactedAppsTitleRow}>
        <div className={locals.impactedAppsTitle}>
          <Typography variant="heading-200" noMargin>
            {t('in-automation:resourceOptimization.impactedApplications')}
          </Typography>
        </div>
        <div className={locals.impactedAppsTitle}>
          <Typography variant="heading-200" noMargin>
            {t('in-automation:resourceOptimization.services')}
          </Typography>
        </div>
      </div>

      {/* Scrollable content */}

      <div className={locals.appsScroll}>
        <div className={locals.impactedAppsCol}>
          {appImpactLoading && (
            <Stack direction="vertical">
              <LoadingSkeletons />
            </Stack>
          )}
          {!appImpactLoading &&
            impactedApplications.map((app: ImpactedApplicationDetails) => {
              return <div className={locals.smallText}>{app?.name}</div>;
            })}
        </div>

        <div className={locals.impactedAppsCol}>
          {!appImpactLoading &&
            impactedApplications.map((app: ImpactedApplicationDetails) => {
              return <div className={locals.smallText}>{app?.servicesCount}</div>;
            })}
        </div>
      </div>
      {errorMessageAppImpact !== '' && (
        <Typography variant="body-small" noMargin>
          {errorMessageAppImpact}
        </Typography>
      )}
    </div>
  );
}

function ResourceImpactSection({
  resImpactLoading,
  entities,
  errorMessageResourceImpact
}: {
  resImpactLoading: boolean;
  entities: any;
  errorMessageResourceImpact: any;
}) {
  if (resImpactLoading) {
    return (
      <div className={locals.paddingBox}>
        <Stack direction="vertical">
          <LoadingSkeletons n={2} />
          <Spacer />
          <Stack direction="horizontal">
            <Stack direction="vertical">
              <LoadingSkeletons n={4} />
            </Stack>
            <Stack direction="vertical">
              <LoadingSkeletons n={4} />
            </Stack>
            <Stack direction="vertical">
              <LoadingSkeletons n={4} />
            </Stack>
          </Stack>
        </Stack>
      </div>
    );
  } else if (errorMessageResourceImpact !== '') {
    return (
      <Typography variant="body-small" noMargin>
        {errorMessageResourceImpact}
      </Typography>
    );
  }
  return (
    <>
      {entities?.map((entity: ResourceImpactEntities, i: number) => (
        <Stack direction="vertical" gap="small" distribution="center">
          {/* Container Spec*/}
          <div className={locals.paddingBox}>
            <Typography variant="heading-200" noMargin>
              {entity?.type}
            </Typography>
            <div className={locals.smallText}>{entity?.name}</div>
          </div>

          {(entity?.resourceImpactDataList?.length ?? 0) > 0 && (
            <div className={locals.paddingBox}>
              <div className={locals.resourceImpactsSection}>
                {/* Resource impact */}
                <div className={locals.resourceImpactsCol}>
                  <Typography variant="heading-200" noMargin>
                    {t('in-automation:resourceOptimization.resourceImpact')}
                  </Typography>
                  {entity?.resourceImpactDataList?.map(x => (
                    <div className={locals.smallText}>{x.name}</div>
                  ))}
                </div>
                {/* Current */}
                <div className={locals.resourceImpactsCol}>
                  <div className={locals.current}>
                    <Typography variant="heading-200" noMargin>
                      {t('in-automation:resourceOptimization.current')}
                    </Typography>
                  </div>
                  {entity?.resourceImpactDataList?.map(x => (
                    <div className={locals.smallText}>{`${x.before} ${x.units}`}</div>
                  ))}
                </div>
                {/* After actions */}
                <div className={locals.resourceImpactsCol}>
                  <div className={locals.after}>
                    <Typography variant="heading-200" noMargin>
                      {t('in-automation:resourceOptimization.afterActions')}
                    </Typography>
                  </div>
                  {entity?.resourceImpactDataList?.map(x => (
                    <div className={locals.smallText}>{`${x.after} ${x.units}`}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Include dividers for all but the last section */}
          {i + 1 < entities?.length && <hr className={locals.divider} />}
        </Stack>
      ))}
    </>
  );
}

export default function TurboActionRunModal({ action, agents, targetSnapshotId, eventId }: DetailsModalProps) {
  const { runOptimizationTrackerSegment } = useSegmentTracker();
  const [targetAgent, setTargetAgent] = useState<AgentSnapshot | null>(agents[0]);

  const [isSavingAction, setIsSavingAction] = useState(false);
  const [runActionError, setRunActionError] = useState('');
  const [runActionResponseId, setRunActionResponseId] = useState('');
  // @ts-ignore-error
  const metadata = action?.metadata?.ai[0];

  const actionInstanceId = metadata?.actionInstanceId ?? '';
  const createdDate = metadata?.actionInstanceCreatedDate ?? 0;
  const volatileId = targetAgent?.volatileId ?? {};

  const resourceImpactResult = useResourceImpacts({
    volatileId: volatileId,
    actionInstanceId,
    createdDate
  });
  const appImpactResult = useActionImpactedApplications({
    targetSnapshotId: targetSnapshotId ?? ''
  });
  const resImpactLoading = resourceImpactResult?.progress?.loading;
  const appImpactLoading = appImpactResult?.progress?.loading;

  //@ts-expect-error
  const entities = resourceImpactResult?.data?.entitiesList;
  //@ts-expect-error
  const errorMessageResourceImpact = resourceImpactResult?.data?.errorMessage;
  //@ts-expect-error
  const impactedApplications = appImpactResult?.data?.impactedApplications;
  //@ts-expect-error
  const errorMessageAppImpact = appImpactResult?.data?.errorMessage;

  const params = {
    volatileId: targetAgent?.volatileId ?? {},
    createdDate: metadata?.actionInstanceCreatedDate ?? 0,
    actionName: action?.name ?? '',
    actionInstanceId: metadata?.actionInstanceId ?? '',
    eventId
  };

  return (
    <CarbonModal
      isFullWidth
      open
      onRequestClose={close}
      modalHeading={t('in-automation:resourceOptimization.details')}
      primaryButtonText={t('in-automation:runAction')}
      primaryButtonDisabled={metadata?.actionMode === 'RECOMMEND'}
      secondaryButtonText={t('in-automation:cancel')}
      size="lg"
      onRequestSubmit={() =>
        handleRunAction(
          params,
          { setIsSavingAction, setRunActionError, setRunActionResponseId },
          runOptimizationTrackerSegment
        )
      }
      loadingStatus={getActionLoadingStatus(isSavingAction, runActionError, runActionResponseId)}
      loadingDescription={t('in-automation:resourceOptimization.runningAction')}
    >
      <div className={locals.detailsRow}>
        {/* Details - Left Section */}
        <div className={locals.leftSection}>
          <div className={locals.leftContent}>
            <Typography variant="heading-200" noMargin>
              {t('in-automation:resourceOptimization.actionName')}
            </Typography>
            <Typography variant="body-regular"> {action?.name}</Typography>
            <Pill size="md"> {turboActionCategoryMap[metadata?.actionCategory as TurboActionCategory]}</Pill>
            <Typography variant="heading-200" noMargin>
              {t('in-automation:resourceOptimization.riskDescription')}
            </Typography>
            <Typography variant="body-regular"> {action?.description}</Typography>
            <ApplicationImpactSection
              appImpactLoading={appImpactLoading}
              impactedApplications={impactedApplications}
              errorMessageAppImpact={errorMessageAppImpact}
            />
            {metadata?.actionDetailsURL && (
              <div className={locals.turboLink}>
                <Link href={metadata?.actionDetailsURL} linkIconType={'lib_views_external_link'} external>
                  {t('in-automation:resourceOptimization.viewInTurbo')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Resource Impact - Right Section */}
        <div className={locals.rightSection}>
          <ResourceImpactSection
            resImpactLoading={resImpactLoading}
            entities={entities}
            errorMessageResourceImpact={errorMessageResourceImpact}
          />
        </div>
      </div>

      {/* Target Agent - Bottom Section */}
      <div className={locals.agentRow}>
        <Stack>
          <CarbonDropdown
            items={agents}
            itemToString={item => item?.label ?? ''}
            initialSelectedItem={targetAgent}
            titleText={t('in-automation:resourceOptimization.targetAgent')}
            label={targetAgent?.label ?? ''}
            id={'dropdown-resourceOptimizations'}
            helperText={t('in-automation:resourceOptimization.agentHelperText')}
            onChange={({ selectedItem }) => setTargetAgent(selectedItem)}
          />
          <Typography variant="body-bold">{t('in-automation:resourceOptimization.proceedConfirm')}</Typography>
        </Stack>
      </div>
    </CarbonModal>
  );
}
