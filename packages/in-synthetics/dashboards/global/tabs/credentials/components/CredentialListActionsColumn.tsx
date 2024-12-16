/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SyntheticCredential } from '@instana/types';
import { IconButton } from '@instana/components';

import DeleteSelectedCredential from 'in-synthetics/dashboards/global/tabs/credentials/components/DeleteSelectedCredential';
import EditSelectedCredential from 'in-synthetics/dashboards/global/tabs/credentials/components/EditSelectedCredential';
// @ts-expect-error Could not find a declaration file
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { stopPropagation } from 'in-services/util/function';
import { t } from 'in-i18n';

const CredentialListActionsColumn = ({ item }: { item: SyntheticCredential }) => {
  const showDeleteDialog = () => {
    return addActiveDialog(<DeleteSelectedCredential item={item} />);
  };

  const showEditDialog = () => {
    return addActiveDialog(<EditSelectedCredential item={item} />);
  };
  return (
    <HorizontalFlexWrapper>
      <MoreMenu
        renderInteractiveElement={({ ref, toggle }: InteractiveElementsProps) => (
          <IconButton
            kind="info"
            type="lib_menu_more_horizontal"
            onClick={e => {
              stopPropagation(e);
              toggle();
            }}
            ref={ref as React.MutableRefObject<HTMLButtonElement>}
          />
        )}
      >
        <MoreMenuButton icon="lib_actions_edit" onClick={showEditDialog}>
          {t('in-synthetics:dashboard.credentialList.editAction.editActionLabel')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_delete" onClick={showDeleteDialog}>
          {t('in-synthetics:dashboard.credentialList.deleteAction.deleteActionLabel')}
        </MoreMenuButton>
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
};

export default CredentialListActionsColumn;
