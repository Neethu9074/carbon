/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, Typography } from '@instana/components';

import {
  ClearableTagFilterQueryBuilder,
  TagFilterQueryBuilder
} from 'in-service-levels/components/Shared/TagFilterQueryBuilder';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export default function IndicatorWebsiteCustomFilters() {
  const { form, mode, onChange } = useContext(SloFormContext);

  const entityIdField = form.getIn(['entity', 'entityId']);
  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const goodEventsFilterExpressionField = form.getIn(['indicator', 'goodEventsFilter']);
  const badEventsFilterExpressionField = form.getIn(['indicator', 'badEventsFilter']);
  const isEditMode = mode === 'EDIT';

  return (
    <Stack gap="small">
      <Typography variant="body-bold" component="p" noMargin>
        {t('in-service-levels:createSloDialog.indicatorSection.eventType')}
      </Typography>
      <Stack gap="medium">
        <Stack gap="xsmall">
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-service-levels:createSloDialog.indicatorSection.setGoodCall')}
          </Typography>
          {isEditMode && (
            <TagFilterQueryBuilder
              websiteId={entityIdField.value}
              beaconType={beaconTypeField.value}
              value={goodEventsFilterExpressionField.value}
              readOnly
            />
          )}
          {!isEditMode && (
            <ClearableTagFilterQueryBuilder
              applicationId={entityIdField.value}
              beaconType={beaconTypeField.value}
              value={goodEventsFilterExpressionField.value}
              onChange={newFilterExpression =>
                onChange(['indicator', 'goodEventsFilter'], () =>
                  goodEventsFilterExpressionField.setValue(newFilterExpression).setTouched(true)
                )
              }
            />
          )}
        </Stack>
        <Stack gap="xsmall">
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-service-levels:createSloDialog.indicatorSection.setBadCall')}
          </Typography>
          {isEditMode && (
            <TagFilterQueryBuilder
              websiteId={entityIdField.value}
              beaconType={beaconTypeField.value}
              value={badEventsFilterExpressionField.value}
              readOnly
            />
          )}
          {!isEditMode && (
            <ClearableTagFilterQueryBuilder
              applicationId={entityIdField.value}
              beaconType={beaconTypeField.value}
              value={badEventsFilterExpressionField.value}
              onChange={newFilterExpression =>
                onChange(['indicator', 'badEventsFilter'], () =>
                  badEventsFilterExpressionField.setValue(newFilterExpression).setTouched(true)
                )
              }
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
