/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import { TagFilterQueryBuilder } from 'in-service-levels/components/Shared/TagFilterQueryBuilder/TagFilterQueryBuilder';
import { SloFormContext } from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import { t } from 'in-i18n';

export const IndicatorWebsiteCustomFilters = () => {
  const { form, onChange } = useContext(SloFormContext);

  const entityIdField = form.getIn(['entity', 'entityId']);
  const beaconTypeField = form.getIn(['scope', 'beaconType']);
  const goodEventsFilterExpressionField = form.getIn(['indicator', 'goodEventsFilter']);
  const badEventsFilterExpressionField = form.getIn(['indicator', 'badEventsFilter']);

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
          <StackItem>
            <TagFilterQueryBuilder
              websiteId={entityIdField.value}
              beaconType={beaconTypeField.value}
              value={goodEventsFilterExpressionField.value}
              onChange={newFilterExpression =>
                onChange(['indicator', 'goodEventsFilter'], () =>
                  goodEventsFilterExpressionField.setValue(newFilterExpression).setTouched(true)
                )
              }
            />
          </StackItem>
        </Stack>
        <Stack gap="xsmall">
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-service-levels:createSloDialog.indicatorSection.setBadCall')}
          </Typography>
          <StackItem>
            <TagFilterQueryBuilder
              websiteId={entityIdField.value}
              beaconType={beaconTypeField.value}
              onChange={newFilterExpression =>
                onChange(['indicator', 'badEventsFilter'], () =>
                  goodEventsFilterExpressionField.setValue(newFilterExpression).setTouched(true)
                )
              }
              value={badEventsFilterExpressionField.value}
            />
          </StackItem>
        </Stack>
      </Stack>
    </Stack>
  );
};
