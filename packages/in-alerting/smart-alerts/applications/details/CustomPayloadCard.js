/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import CustomPayloadViewer from 'in-alerting/smart-alerts/applications/details/CustomPayloadViewer';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import Message from 'in-components/Message/Message';
import { t } from 'in-i18n';

export default function CustomPayloadCard({
  customPayloadFields = [],
  title = t('in-alerting:components.customPayload.customPayloadTitle'),
  cardConfig = {
    openByDefault: true,
    darkFrame: true
  }
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
        <CustomPayloadViewer customPayloadFields={customPayloadFields} />
      ) : (
        <Message small title={t('in-alerting:components.customPayload.noCustomPayloadConfigured')} />
      )}
    </ExpandableLightCard>
  );
}

CustomPayloadCard.propTypes = {
  cardConfig: PropTypes.shape({
    openByDefault: PropTypes.bool,
    darkFrame: PropTypes.bool
  }),
  customPayloadFields: PropTypes.array,
  title: PropTypes.string
};
