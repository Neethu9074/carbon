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

export default function CustomPayloadCard({
  customPayloadFields = [],
  title = t('in-alerting:components.customPayload.additionalCustomPayloadTitle', {
    count: customPayloadFields?.length
  }),
  noCustomPayloadConfiguredText = t('in-alerting:components.customPayload.noCustomPayloadConfigured'),
  openByDefault = false,
  alternatingBg,
  TagBasedPayloadConfigurator
}) {
  const hasCustomPayload = Boolean(customPayloadFields.length);

  return (
    <ExpandableLightCard
      title={title}
      useMaxAvailableHeight={false}
      bodyWithoutPadding={hasCustomPayload}
      openByDefault={openByDefault}
      darkFrame
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

CustomPayloadCard.propTypes = {
  TagBasedPayloadConfigurator: PropTypes.node,
  customPayloadFields: PropTypes.array,
  title: PropTypes.string,
  noCustomPayloadConfiguredText: PropTypes.string,
  openByDefault: PropTypes.bool,
  alternatingBg: PropTypes.bool
};
