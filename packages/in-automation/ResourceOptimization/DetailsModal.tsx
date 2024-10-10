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
import { Link } from '@instana/components';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { RecommendedAction, ResourceImpactEntities, AgentSnapshot } from 'in-types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { turboActionCategoryMap } from './RecommendedOptimizations';
import { actionHistoryPath } from 'in-automation/navigation/paths';
import { runResourceOptimizationAction } from 'in-automation/api';
import { useResourceImpacts } from './useResourceOptimization';
import { close } from 'in-components/DialogPresenter/store';
import { useSegmentTracker } from 'in-automation/tracker';
import { refresh } from './useResourceOptimization';
import { t, Trans } from 'in-i18n';

import locals from './DetailsModal.mless';

interface DetailsModalProps {
  currentAction: RecommendedAction;
  agents: AgentSnapshot[];
}

export default function DetailsModal({ currentAction, agents }: DetailsModalProps) {
  const { runOptimizationTrackerSegment } = useSegmentTracker();
  const [targetAgent, setTargetAgent] = useState<AgentSnapshot | null>(agents[0]);
  const [isSavingAction, setIsSavingAction] = useState(false);
  const [runActionError, setRunActionError] = useState('');
  const [runActionResponseId, setRunActionResponseId] = useState('');

  const { location, navigate } = useNavigation();

  const actionInstanceId = currentAction?.id ?? '';
  const createdDate = currentAction?.createdDate ?? 0;
  const volatileId = targetAgent?.volatileId ?? {};

  const resourceImpactResult = useResourceImpacts({
    volatileId: volatileId,
    actionInstanceId,
    createdDate
  });

  const impactLoading = resourceImpactResult?.progress?.loading;

  //TODO: TS errors due to an unknown type mismatch - need to investigate further.
  //@ts-expect-error
  const entities = resourceImpactResult?.data?.entitiesList;
  // console.log('🚀 ~ entities:', entities);
  //@ts-expect-error
  const errorMessage = resourceImpactResult?.data?.errorMessage;

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
      } else {
        setRunActionResponseId(data.actionInstanceId);
        runOptimizationTrackerSegment({ actionName: currentAction.name, source: 'Turbonomic' }); //Turbonomic only for now and we may need to have a source parameter
        close();
        addMessage(
          {
            type: 'info',
            content: (
              <Stack direction="vertical">
                <Trans
                  i18nKey="in-automation:resourceOptimization.actionStartedMessage"
                  values={{ actionName: currentAction.name }}
                  components={{ bold: <strong /> }}
                />
                <Button
                  kind="tertiary"
                  onClick={() => {
                    location.pathname = actionHistoryPath;
                    navigate(location);
                    removeMessage('run-resource-optimization');
                  }}
                >
                  {t('in-automation:resourceOptimization.viewActionHistory')}
                </Button>
              </Stack>
            ),
            title: t('in-automation:resourceOptimization.actionStarted')
          },
          'run-resource-optimization'
        );
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

  const resourceImpactSection = () => {
    if (impactLoading) {
      return (
        <div className={locals.paddingBox}>
          <Stack direction="vertical">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <Spacer />
            <Stack direction="horizontal">
              <Stack direction="vertical">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </Stack>
              <Stack direction="vertical">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </Stack>
              <Stack direction="vertical">
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </Stack>
            </Stack>
          </Stack>
        </div>
      );
    } else if (errorMessage !== '') {
      return (
        <Typography variant="body-small" noMargin>
          {errorMessage}
        </Typography>
      );
    }
    return (
      <>
        {entities?.map((entity: ResourceImpactEntities, i: number) => (
          <>
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
                  <Stack direction="horizontal">
                    {/* Resource impact */}
                    <Stack direction="vertical">
                      <Typography variant="heading-200" noMargin>
                        {t('in-automation:resourceOptimization.resourceImpact')}
                      </Typography>
                      {entity?.resourceImpactDataList?.map(x => (
                        <div className={locals.smallText}>{x.name}</div>
                      ))}
                    </Stack>
                    {/* Current */}
                    <Stack direction="vertical">
                      <div className={locals.current}>
                        <Typography variant="heading-200" noMargin>
                          {t('in-automation:resourceOptimization.current')}
                        </Typography>
                      </div>
                      {entity?.resourceImpactDataList?.map(x => (
                        <div className={locals.smallText}>{`${x.before} ${x.units}`}</div>
                      ))}
                    </Stack>
                    {/* After actions */}
                    <Stack direction="vertical">
                      <div className={locals.after}>
                        <Typography variant="heading-200" noMargin>
                          {t('in-automation:resourceOptimization.afterActions')}
                        </Typography>
                      </div>
                      {entity?.resourceImpactDataList?.map(x => (
                        <div className={locals.smallText}>{`${x.after} ${x.units}`}</div>
                      ))}
                    </Stack>
                  </Stack>
                </div>
              )}
              {i + 1 < entities?.length && <hr className={locals.divider} />}
            </Stack>
          </>
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
      primaryButtonText="Run action"
      secondaryButtonText="Cancel"
      size="lg"
      onRequestSubmit={() => handleRunAction()}
      loadingStatus={getActionLoadingStatus()}
      loadingDescription={t('in-automation:resourceOptimization.runningAction')}
    >
      <div className={locals.detailsRow}>
        {/* Details - Left Section */}
        <div className={locals.leftSection}>
          <Stack direction="vertical" gap={'small'} distribution="spaceEvenly">
            <Typography variant="heading-200" noMargin>
              {t('in-automation:resourceOptimization.actionDescription')}
            </Typography>
            <Typography variant="body-regular"> {currentAction?.name}</Typography>
            <Pill size="md"> {turboActionCategoryMap[currentAction.actionCategory]}</Pill>
            <Typography variant="heading-200" noMargin>
              {t('in-automation:resourceOptimization.riskDescription')}
            </Typography>
            <Typography variant="body-regular"> {currentAction?.description}</Typography>
            {currentAction?.actionDetailsURL && (
              <Link href={currentAction?.actionDetailsURL} linkIconType={'lib_views_external_link'} external>
                {t('in-automation:resourceOptimization.viewInTurbo')}
              </Link>
            )}
          </Stack>
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
