/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

import { ApplicationBoundaryScope, SloEntityType } from '@instana/types';

import { ApplicationSloForm, WebsiteSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SloBeaconTypes, SloConfigType } from 'in-service-levels/types';

export const testWebsiteForm: WebsiteSloForm = createMapForm({
  items: {
    entityType: createField<SloEntityType>({ value: 'website' }),
    entity: createMapForm({
      items: {
        websiteId: createField({ value: '22222' })
      }
    }),
    scope: createMapForm({
      items: {
        beaconType: createField<SloBeaconTypes>({ value: 'pageLoad' }),
        tagFilterExpression: createField<FormModelElement[]>({ value: [] })
      }
    })
  }
});

export const testApplicationForm: ApplicationSloForm = createMapForm({
  items: {
    entityType: createField<SloEntityType>({ value: 'application' }),
    entity: createMapForm({
      items: {
        applicationId: createField<string>({ value: '11111' })
      }
    }),
    scope: createMapForm({
      items: {
        boundaryScope: createField<ApplicationBoundaryScope>({ value: 'ALL' }),
        endpointId: createField<string>({ value: 'endpoindNotEmpty' }),
        includeInternal: createField<boolean>({ value: true }),
        includeSynthetic: createField<boolean>({ value: false }),
        serviceId: createField<string>({ value: '12345' }),
        tagFilterExpression: createField<FormModelElement[]>({ value: [] })
      }
    })
  }
});

const sharedSloConfigFields = {
  id: '123456789',
  indicator: undefined,
  name: 'Random name',
  tags: ['tag1', 'tag2'],
  target: 50,
  timeWindow: undefined
};

export const testApplicationSloConfig: SloConfigType = {
  entity: {
    applicationId: 'applicationIdHere',
    boundaryScope: 'INBOUND',
    endpointId: 'endpointIdHere',
    includeInternal: true,
    includeSynthetic: true,
    serviceId: 'serviceIdHere',
    type: 'application'
  },
  ...sharedSloConfigFields
};

export const testWebsiteSloConfig: SloConfigType = {
  entity: {
    beaconType: 'httpRequest',
    type: 'website',
    websiteId: 'websiteIdHere'
  },
  ...sharedSloConfigFields
};
