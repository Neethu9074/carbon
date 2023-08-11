/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import DeleteSloMoreMenuButton from 'in-service-levels/components/SloList/components/DeleteSloMoreMenuButton';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';

interface Props {
  item: SloListItem;
}

export default function SloActions({ item }: Props) {
  return (
    <Stack align="end">
      <MoreMenu kind="subtle">
        <MoreMenuButton icon="lib_actions_edit" disabled>
          {t('in-service-levels:general.editButtonLabel')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_copy" disabled>
          {t('in-service-levels:general.copyButtonLabel')}
        </MoreMenuButton>
        <DeleteSloMoreMenuButton configuration={item.configuration} />
      </MoreMenu>
    </Stack>
  );
}
