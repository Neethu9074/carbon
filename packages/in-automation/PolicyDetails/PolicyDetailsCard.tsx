/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import {
  CarbonColumn,
  CarbonFormGroup,
  CarbonGrid,
  CarbonRow,
  CarbonStack,
  CarbonTile,
  Typography
} from '@instana/components';

import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import { NO_FIELD_VALUE } from 'in-automation/constants';
import { Nullish, Policy } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/PolicyDetails/PolicyDetails.mless';

interface PolicyDetailsProps {
  data: Policy | Nullish;
}

export default function PolicyDetailsCard({ data }: PolicyDetailsProps) {
  if (!data) return null;
  const { name, description, tags } = data;
  const renderTags = tags?.length ? <DynamicTagList tags={tags} /> : NO_FIELD_VALUE;
  return (
    <CarbonTile>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">{t('in-automation:policies.policyDetails')}</Typography>
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={classNames(local.noHorizontalPaddings)}>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:name')}>{name}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:description')}>{description}</CarbonFormGroup>
          </CarbonColumn>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:tagsLabel')}>{renderTags}</CarbonFormGroup>
          </CarbonColumn>
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}
