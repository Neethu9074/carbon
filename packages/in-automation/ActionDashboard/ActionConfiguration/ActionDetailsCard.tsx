/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonButton,
  CarbonColumn,
  CarbonFormGroup,
  CarbonGrid,
  CarbonIconButton,
  CarbonRow,
  CarbonStack,
  CarbonTag,
  CarbonTile,
  SvgIcon,
  Typography
} from '@instana/components';
import { Action } from '@instana/types';

import { Nullish } from 'in-types';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionConfigurationProps {
  data: Action | Nullish;
}

export default function ActionDetailsCard({ data }: ActionConfigurationProps) {
  if (!data) return null;
  const { name, description, tags } = data;

  const renderTags = tags?.map(tag => (
    <CarbonTag key={tag} type="gray" size="md">
      {tag}
    </CarbonTag>
  ));

  return (
    <CarbonTile className={local.borderBottom}>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">Action details</Typography>
        <ActionConfigurationActions />
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={local.noHorizontalPaddings}>
          <CarbonColumn sm={4}>
            <CarbonFormGroup legendText="Name">{name}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn sm={4}>
            <CarbonFormGroup legendText="Description">{description}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="50%">
            <CarbonFormGroup legendText="Tags">{renderTags}</CarbonFormGroup>
          </CarbonColumn>
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}

function ActionConfigurationActions() {
  return (
    <CarbonStack orientation="horizontal">
      <CarbonIconButton label="Copy" kind="ghost" size="sm">
        <SvgIcon type="lib_actions_copy" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton label="Edit" kind="ghost" size="sm">
        <SvgIcon type="lib_actions_edit" size="xs" />
      </CarbonIconButton>
      <CarbonIconButton label="Delete" kind="ghost" size="sm">
        <SvgIcon type="lib_actions_delete" size="xs" />
      </CarbonIconButton>
      <CarbonButton
        className={local.testActionButton}
        kind="ghost"
        size="sm"
        renderIcon={() => <SvgIcon type="lib_actions_play" size="xs" color="#fff" />}
      >
        Test action
      </CarbonButton>
    </CarbonStack>
  );
}
