/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  GetLinkToExploreProps,
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';
import { carbonButtonEnabled } from 'in-services/featureFlags';

export interface AnalyzeRelatedInstancesButtonProps extends GetLinkToExploreProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const defaultAnalyzeRelatedInstancesButtonParams = { ...defaultInfraExploreViewParams };

export default function AnalyzeRelatedInstancesButton(
  props: AnalyzeRelatedInstancesButtonProps = defaultAnalyzeRelatedInstancesButtonParams
) {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  if (carbonButtonEnabled) {
    return (
      <Button kind="primary" size="compact" href={getLinkToInfraEntityExplore(props)} onClick={props.onClick}>
        <Stack direction="horizontal" gap="disabled" align="center">
          {t('in-infrastructure:explore.relatedInstances')}
          <PreviewBadge />
        </Stack>
      </Button>
    );
  }

  return (
    <Button
      kind="primary"
      icon="lib_analyze_inverted"
      href={getLinkToInfraEntityExplore(props)}
      onClick={props.onClick}
    >
      {t('in-infrastructure:explore.relatedInstances')}
      <div>
        <PreviewBadge />
      </div>
    </Button>
  );
}
