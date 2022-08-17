/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Message } from '@instana/components';

import CustomPayloadViewer from 'in-alerting/smart-alerts/components/details/CustomPayloadViewer';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { t } from 'in-i18n';

const cardConfig = {
  openByDefault: true,
  darkFrame: true
};

export default function CustomPayloadCard({
  customPayloadFields = [],
  title = t('in-alerting:components.customPayload.customPayloadTitle'),
  TagBasedPayloadConfigurator
}) {
  const hasCustomPayload = Boolean(customPayloadFields.length);

  return (
    <ExpandableLightCard
      {...cardConfig}
      title={title}
      useMaxAvailableHeight={false}
      bodyWithoutPadding={hasCustomPayload}
    >
      {hasCustomPayload ? (
        <CustomPayloadViewer
          customPayloadFields={customPayloadFields}
          TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        />
      ) : (
        <Message small title={t('in-alerting:components.customPayload.noCustomPayloadConfigured')} />
      )}
    </ExpandableLightCard>
  );
}

CustomPayloadCard.propTypes = {
  TagBasedPayloadConfigurator: PropTypes.node,
  customPayloadFields: PropTypes.array,
  title: PropTypes.string
};
