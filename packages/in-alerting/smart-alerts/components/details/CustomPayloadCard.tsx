/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { CustomPayloadFieldUnion } from '@instana/types/typeDefinitions';
import { Message } from '@instana/components';

import CustomPayloadViewer from 'in-alerting/smart-alerts/components/details/CustomPayloadViewer';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { t } from 'in-i18n';

export interface CustomPayloadCardProps {
  customPayloadFields?: CustomPayloadFieldUnion[];
  title?: string;
  noCustomPayloadConfiguredText?: string;
  openByDefault?: boolean;
  alternatingBg?: boolean;
  TagBasedPayloadConfigurator: React.FunctionComponent<any>;
  isTearSheetView?: boolean;
}

export default function CustomPayloadCard({
  customPayloadFields = [],
  title = t('in-alerting:components.customPayload.additionalCustomPayloadTitle', {
    count: customPayloadFields?.length
  }),
  noCustomPayloadConfiguredText = t('in-alerting:components.customPayload.noCustomPayloadConfigured'),
  openByDefault = false,
  alternatingBg,
  TagBasedPayloadConfigurator,
  isTearSheetView
}: CustomPayloadCardProps) {
  const hasCustomPayload = Boolean(customPayloadFields.length);

  return (
    <ExpandableLightCard
      title={title}
      useMaxAvailableHeight={false}
      bodyWithoutPadding={hasCustomPayload}
      openByDefault={openByDefault}
      darkFrame
      isTearSheetView={isTearSheetView}
    >
      {hasCustomPayload ? (
        <CustomPayloadViewer
          customPayloadFields={customPayloadFields}
          TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
          alternatingBg={alternatingBg}
        />
      ) : (
        <Message small title={noCustomPayloadConfiguredText} />
      )}
    </ExpandableLightCard>
  );
}
