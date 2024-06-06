/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Card, Spacer, Stack } from '@instana/components';
import { ButtonGroup } from '@instana/components';
import { SvgIcon } from '@instana/components';

import useActions, { useUserActions, useAIActions } from 'in-automation/ActionCatalog/useActions';
import { aiGenaratedActionsTabClickTracker } from 'in-automation/tracker';
import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import ActionCatalog from 'in-automation/ActionCatalog/ActionCatalog';
import useNavigateToActionCatalog from './useNavigateToActionCatalog';
import { actionCatalog } from 'in-automation/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

export type ButtonKey = 'userDefinedActions' | 'aiGeneratedActions';
export type SetActiveKey = (str: ButtonKey) => void;
interface AutomationCardButtonGroupProps {
  activeKey: ButtonKey;
  setActiveKey: SetActiveKey;
  userCreatedActionsCount?: number | undefined;
  aiGeneratedActionsCount?: number | undefined;
}
export default function ActionCatalogTab() {
  return (
    <AutomationTabs>
      <ActionCatalogTabsCard />
    </AutomationTabs>
  );
}

function AutomationCardButtonGroup({
  activeKey,
  setActiveKey,
  userCreatedActionsCount,
  aiGeneratedActionsCount
}: AutomationCardButtonGroupProps) {
  const navigateToActionCatalog = useNavigateToActionCatalog();
  const buttonProps = [
    {
      text:
        userCreatedActionsCount !== undefined
          ? t('in-automation:userDefinedWithCount', { count: userCreatedActionsCount })
          : t('in-automation:userDefined'),
      key: 'userDefinedActions',
      onClick: () => {
        setActiveKey('userDefinedActions');
        navigateToActionCatalog('user');
      }
    },
    {
      text:
        aiGeneratedActionsCount !== undefined
          ? t('in-automation:aiGeneratedWithCount', { count: aiGeneratedActionsCount })
          : t('in-automation:aiGenerated'),
      key: 'aiGeneratedActions',
      onClick: () => {
        setActiveKey('aiGeneratedActions');
        navigateToActionCatalog('ai');
        aiGenaratedActionsTabClickTracker();
      }
    }
  ];

  return (
    <Stack gap="xxsmall">
      <ButtonGroup buttonPropsList={buttonProps} activeKey={activeKey} segmented />
    </Stack>
  );
}

function ActionCatalogTabsCard() {
  const { location } = useNavigation();
  const activeTab =
    location.matrix[actionCatalog]?.view && location.matrix[actionCatalog]?.view === 'ai'
      ? 'aiGeneratedActions'
      : 'userDefinedActions';
  const [activeKey, setActiveKey] = useState<ButtonKey>(activeTab);

  const actions = useActions();
  const userActions = useUserActions({ actions });
  const aiActions = useAIActions({ actions });
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card>
          <Stack direction="horizontal" distribution="spaceBetween" align="center">
            <AutomationCardButtonGroup
              activeKey={activeKey}
              setActiveKey={setActiveKey}
              userCreatedActionsCount={userActions?.data?.length}
              aiGeneratedActionsCount={aiActions?.data?.length}
            />
            {activeKey === 'aiGeneratedActions' && <SvgIcon type="lib_ai_slug" />}
          </Stack>
          <Spacer vertical="small" />
          {activeKey === 'userDefinedActions' && <ActionCatalog actions={userActions} actionsType="user" />}
          {activeKey === 'aiGeneratedActions' && <ActionCatalog actions={aiActions} actionsType="ai" />}
        </Card>
      </Col>
    </Row>
  );
}
