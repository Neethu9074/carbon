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
  CarbonStack,
  CarbonTile,
  Link,
  Typography
} from '@instana/components';

import {
  TRIGGERING_AGENT,
  TRIGGERING_HOST_FQDN_OPTION,
  TRIGGERING_HOST_IP_OPTION
} from 'in-automation/RunActionDialog/RunActionDialogContent';
import { renderConfigurationFields } from 'in-automation/ActionDashboard/ActionConfiguration/ActionConfigurationCard';
import useHrefToActionDashboard from 'in-automation/navigation/hooks/useHrefToActionDashboard';
import { isNotEditableContext } from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import { ACTION_TRANSLATIONS, ACTION_TYPE, NO_FIELD_VALUE } from 'in-automation/constants';
import { useHostSnapshots } from 'in-automation/PolicyDetails/useHostSnapshots';
import ParametersTable from 'in-automation/ActionCatalog/ParametersTable';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import { Action, Nullish, ParameterValue } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/PolicyDetails/PolicyDetails.mless';

interface ActionConfigurationCardProps {
  data: Action | Nullish;
  agentId: string | undefined;
  inputParameterValues?: ParameterValue[];
}

const hostLimitOption = {
  TRIGGERING_HOST_FQDN: TRIGGERING_HOST_FQDN_OPTION,
  TRIGGERING_HOST_IP: TRIGGERING_HOST_IP_OPTION
};

export default function ActionConfigurationCard({ data, agentId, inputParameterValues }: ActionConfigurationCardProps) {
  const { hostSnapshots } = useHostSnapshots(data);
  const hrefToActionDashboard = useHrefToActionDashboard();
  if (!data) return null;
  const showParametersSection = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(data.type);
  const { tags } = data;
  const renderTags = tags?.length ? <DynamicTagList tags={tags} /> : NO_FIELD_VALUE;
  const currentAgent = hostSnapshots?.filter(
    ({ hostSnapshot }) => hostSnapshot.get('entityId').get('host') === agentId
  )?.[0];
  const hostname =
    currentAgent?.hostSnapshot.get('label') ||
    (agentId === TRIGGERING_AGENT ? t('in-automation:policies.triggeringAgent') : NO_FIELD_VALUE);

  return (
    <CarbonTile>
      <CarbonStack orientation="horizontal">
        <Typography variant="heading-02">{t('in-automation:policies.actionConfiguration')}</Typography>
      </CarbonStack>
      <CarbonGrid fullWidth className={classNames(local.removeMarginX, local.customMarginY)}>
        <CarbonColumn span="50%">
          <CarbonFormGroup legendText={t('in-automation:name')}>
            <Link href={hrefToActionDashboard(data.id)} external>
              {data?.name}
            </Link>
          </CarbonFormGroup>
        </CarbonColumn>
        <CarbonColumn span="50%">
          <CarbonFormGroup legendText={t('in-automation:description')}>{data?.description}</CarbonFormGroup>
        </CarbonColumn>
        <CarbonColumn span="50%">
          <CarbonFormGroup legendText={t('in-automation:tagsLabel')}>{renderTags}</CarbonFormGroup>
        </CarbonColumn>
        <CarbonColumn span="50%">
          <CarbonFormGroup legendText={t('in-automation:type')}>{ACTION_TRANSLATIONS[data.type]}</CarbonFormGroup>
        </CarbonColumn>
        {renderConfigurationFields(data.type, data)}
        {data.type === ACTION_TYPE.ANSIBLE && renderAnsibleContent(inputParameterValues)}
        <CarbonColumn span="100%">
          <CarbonFormGroup legendText={t('in-automation:targetAgent')}>{hostname}</CarbonFormGroup>
        </CarbonColumn>
        {showParametersSection && (
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:actionDashboard.ParameterDetails')}>
              <isNotEditableContext.Provider value>
                <ParametersTable isAnsibleParameter hideHiddenParams parameterNewValues={inputParameterValues} />
              </isNotEditableContext.Provider>
            </CarbonFormGroup>
          </CarbonColumn>
        )}
      </CarbonGrid>
    </CarbonTile>
  );
}

const renderAnsibleContent = (inputParameterValues?: ParameterValue[]) => {
  const hostLimit = inputParameterValues?.find(item => item.name === 'hostsLimit');
  return (
    <CarbonColumn span="100%">
      <CarbonFormGroup legendText={t('in-automation:hostsLimit')}>
        {hostLimitOption[hostLimit?.value as keyof typeof hostLimitOption]?.label ?? NO_FIELD_VALUE}
      </CarbonFormGroup>
    </CarbonColumn>
  );
};
