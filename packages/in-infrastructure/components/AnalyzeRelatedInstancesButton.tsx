/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, PreviewPill, Stack } from '@instana/components';

import {
  GetLinkToExploreProps,
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { t } from 'in-i18n';

export interface AnalyzeRelatedInstancesButtonProps extends GetLinkToExploreProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const defaultAnalyzeRelatedInstancesButtonParams = { ...defaultInfraExploreViewParams };

export default function AnalyzeRelatedInstancesButton(
  props: AnalyzeRelatedInstancesButtonProps = defaultAnalyzeRelatedInstancesButtonParams
) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  return (
    <Button kind="primary" size="compact" href={getLinkToInfraEntityExplore(props)} onClick={props.onClick}>
      <Stack direction="horizontal" gap="disabled" align="center">
        {t('in-infrastructure:explore.relatedInstances')}
        <PreviewPill />
      </Stack>
    </Button>
  );
}
