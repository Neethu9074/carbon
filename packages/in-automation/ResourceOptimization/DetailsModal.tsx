/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

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
import { RecommendedAction, ResourceImpactEntities, AgentSnapshot, ImpactedApplicationDetails } from '@instana/types';
import { Link } from '@instana/components';

import {
  useResourceImpacts,
  useActionImpactedApplications
} from 'in-automation/ResourceOptimization/useResourceOptimization';
import { turboActionCategoryMap } from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import useNavigateToActionHistory from 'in-automation/navigation/hooks/useNavigateToActionHistory';
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { ActionInstance } from 'in-automation/subscriptions/turboSubmitActionExecution';
import { refresh } from 'in-automation/ResourceOptimization/useResourceOptimization';
import { runResourceOptimizationAction } from 'in-automation/api';
import { close } from 'in-components/DialogPresenter/store';
import { useSegmentTracker } from 'in-automation/tracker';
import { t, Trans } from 'in-i18n';

import locals from './DetailsModal.mless';

interface DetailsModalProps {
  currentAction: RecommendedAction;
  agents: AgentSnapshot[];
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

export default function DetailsModal({ currentAction, agents }: DetailsModalProps) {
  const { runOptimizationTrackerSegment } = useSegmentTracker();
  const [targetAgent, setTargetAgent] = useState<AgentSnapshot | null>(agents[0]);
  const [isSavingAction, setIsSavingAction] = useState(false);
  const [runActionError, setRunActionError] = useState('');
  const [runActionResponseId, setRunActionResponseId] = useState('');

  const actionInstanceId = currentAction?.id ?? '';
  const createdDate = currentAction?.createdDate ?? 0;
  const volatileId = targetAgent?.volatileId ?? {};

  const resourceImpactResult = useResourceImpacts({
    volatileId: volatileId,
    actionInstanceId,
    createdDate
  });
  const appImpactResult = useActionImpactedApplications({
    targetSnapshotId: currentAction?.targetSnapshotId ?? ''
  });
  const navigateToActionHistory = useNavigateToActionHistory();
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

  function showToastNotification(data: ActionInstance) {
    const error = 'errorMessage' in data && data.errorMessage != null;
    return addMessage(
      {
        type: error ? 'danger' : 'info',
        content: (
          <Stack direction="vertical">
            {error ? (
              <Trans
                i18nKey="in-automation:resourceOptimization.actionFailedMessage"
                values={{ actionName: currentAction.name, message: data.errorMessage }}
                components={{ bold: <strong /> }}
              />
            ) : (
              <Trans
                i18nKey="in-automation:resourceOptimization.actionStartedMessage"
                values={{ actionName: currentAction.name }}
                components={{ bold: <strong /> }}
              />
            )}
            <Button
              kind="tertiary"
              onClick={() => {
                navigateToActionHistory(data?.actionInstanceId);
                removeMessage('run-resource-optimization');
              }}
            >
              {t('in-automation:resourceOptimization.viewActionHistory')}
            </Button>
          </Stack>
        ),
        title: error
          ? t('in-automation:resourceOptimization.actionFailed')
          : t('in-automation:resourceOptimization.actionStarted')
      },
      'run-resource-optimization'
    );
  }

  function handleRunAction() {
    setIsSavingAction(true);
    const params = {
      volatileId: volatileId ?? {},
      createdDate: createdDate,
      actionName: currentAction?.name ?? '',
      actionInstanceId: actionInstanceId
    };

    runResourceOptimizationAction(params).once(data => {
      setIsSavingAction(false);

      if ('errorMessage' in data && data.errorMessage != null) {
        setRunActionError(data.errorMessage);
        setRunActionResponseId(data?.actionInstanceId);
        runOptimizationTrackerSegment({
          actionName: currentAction.name,
          source: 'Turbonomic',
          errorMessage: data.errorMessage
        });
        close();
        showToastNotification(data);
      } else {
        setRunActionResponseId(data.actionInstanceId);
        runOptimizationTrackerSegment({ actionName: currentAction.name, source: 'Turbonomic' }); //Turbonomic only for now and we may need to have a source parameter
        close();
        showToastNotification(data);
        refresh();
      }
    });
  }

  function getActionLoadingStatus() {
    if (isSavingAction) {
      return 'active';
    } else if (runActionError !== '') {
      return 'error';
    } else if (runActionResponseId !== '') {
      return 'finished';
    } else {
      return 'inactive';
    }
  }

  const ApplicationImpactSection = () => {
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
  };

  const resourceImpactSection = () => {
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
  };

  return (
    <CarbonModal
      isFullWidth
      open
      onRequestClose={close}
      modalHeading={t('in-automation:resourceOptimization.details')}
      primaryButtonText={t('in-automation:runAction')}
      primaryButtonDisabled={currentAction?.actionMode === 'RECOMMEND'}
      secondaryButtonText={t('in-automation:cancel')}
      size="lg"
      onRequestSubmit={() => handleRunAction()}
      loadingStatus={getActionLoadingStatus()}
      loadingDescription={t('in-automation:resourceOptimization.runningAction')}
    >
      <div className={locals.detailsRow}>
        {/* Details - Left Section */}
        <div className={locals.leftSection}>
          <div className={locals.leftContent}>
            <Typography variant="heading-200" noMargin>
              {t('in-automation:resourceOptimization.actionName')}
            </Typography>
            <Typography variant="body-regular"> {currentAction?.name}</Typography>
            <Pill size="md"> {turboActionCategoryMap[currentAction.actionCategory]}</Pill>
            <Typography variant="heading-200" noMargin>
              {t('in-automation:resourceOptimization.riskDescription')}
            </Typography>
            <Typography variant="body-regular"> {currentAction?.description}</Typography>
            <ApplicationImpactSection />
            {currentAction?.actionDetailsURL && (
              <div className={locals.turboLink}>
                <Link href={currentAction?.actionDetailsURL} linkIconType={'lib_views_external_link'} external>
                  {t('in-automation:resourceOptimization.viewInTurbo')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Resource Impact - Right Section */}
        <div className={locals.rightSection}>{resourceImpactSection()}</div>
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
