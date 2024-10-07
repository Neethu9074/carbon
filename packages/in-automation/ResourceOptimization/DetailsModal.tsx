/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { CarbonDropdown, CarbonModal, LoadingSkeleton, Pill, Spacer, Stack, Typography } from '@instana/components';
import { Link } from '@instana/components';

import { RecommendedAction, ResourceImpactEntities, AgentSnapshot } from 'in-types';
import { turboActionCategoryMap } from './RecommendedOptimizations';
import { runResourceOptimizationAction } from 'in-automation/api';
import { useResourceImpacts } from './useResourceOptimization';
import { close } from 'in-components/DialogPresenter/store';
import { useSegmentTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

import locals from './DetailsModal.mless';

interface DetailsModalProps {
  currentAction: RecommendedAction;
  agents: AgentSnapshot[];
}

export default function DetailsModal({ currentAction, agents }: DetailsModalProps) {
  const { runOptimizationTrackerSegment } = useSegmentTracker();
  // When displayed as a title vs. as a tag, 'Performance' and 'Efficiency' actions need a different key.
  const getCurrentActionCategoryTitle = () => {
    const cat = currentAction?.actionCategory;
    if (cat == 'PERFORMANCE_ASSURANCE') {
      return turboActionCategoryMap['PERFORMANCE_ASSURANCE_FULL'];
    } else if (cat == 'EFFICIENCY_IMPROVEMENT') {
      return turboActionCategoryMap['EFFICIENCY_IMPROVEMENT_FULL'];
    } else {
      return turboActionCategoryMap[cat];
    }
  };

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
      // console.log('🚀 ~ runResourceOptimizationAction ~ data:', data);
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
      }
    });
  }

  function getActionLoadingStatus() {
    if (isSavingAction) {
      return 'active';
    } else if (runActionError !== '') {
      return 'error';
    } else if (runActionResponseId !== '') {
      return;
    } else {
      return 'inactive';
    }
  }

  const resourceImpactSection = () => {
    if (impactLoading) {
      return (
        <Stack direction="vertical">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </Stack>
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
        {entities?.map((entity: ResourceImpactEntities) => (
          <Stack direction="vertical" gap="small" distribution="center">
            {/* Container Spec*/}
            <Typography variant="heading-200" noMargin>
              {entity?.name}
            </Typography>
            <Typography variant="body-small" noMargin>
              {entity?.type}
            </Typography>

            {(entity?.resourceImpactDataList?.length ?? 0) > 0 && (
              <Stack direction="horizontal">
                {/* Resource impact */}
                <Stack direction="vertical">
                  <Typography variant="heading-200" noMargin>
                    {t('in-automation:resourceOptimization.resourceImpact')}
                  </Typography>

                  {entity?.resourceImpactDataList?.map(x => (
                    <Typography variant="body-small" noMargin>
                      {x.name}
                    </Typography>
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
                    <Typography variant="body-small" noMargin>
                      {`${x.before}${x.units}`}
                    </Typography>
                  ))}
                </Stack>
                {/* After actions */}
                {/* <Spacer horizontal="medium" /> */}
                <Stack direction="vertical">
                  <div className={locals.after}>
                    <Typography variant="heading-200" noMargin>
                      {t('in-automation:resourceOptimization.afterActions')}
                    </Typography>
                  </div>
                  {entity?.resourceImpactDataList?.map(x => (
                    <Typography variant="body-small">{`${x.after}${x.units}`}</Typography>
                  ))}
                </Stack>
              </Stack>
            )}
            <Spacer />
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
      primaryButtonText="Run action"
      secondaryButtonText="Cancel"
      size="lg"
      onRequestSubmit={() => handleRunAction()}
      loadingStatus={getActionLoadingStatus()}
    >
      <div className={locals.detailsRow}>
        {/* Details - Left Section */}
        <div className={locals.leftSection}>
          <Stack direction="vertical" gap={'small'} distribution="spaceEvenly">
            <Pill> {turboActionCategoryMap[currentAction.actionCategory]}</Pill>
            <Typography variant="heading-200" noMargin>
              {`${currentAction?.actionType} ${currentAction?.targetClass}`}
            </Typography>
            <Typography variant="body-regular"> {currentAction?.name}</Typography>
            <Typography variant="heading-200" noMargin>
              {getCurrentActionCategoryTitle()}
            </Typography>
            <Typography variant="body-regular"> {currentAction?.description}</Typography>
            {currentAction?.actionDetailsURL && (
              <Link href={currentAction?.actionDetailsURL} linkIconType={'lib_views_external_link'}>
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
