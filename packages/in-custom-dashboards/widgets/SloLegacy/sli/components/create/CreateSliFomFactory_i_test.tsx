/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import CreateSliFormFactory from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliFormFactory';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createSliConfiguration as cSC } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { SliConfigBySliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { t } from 'in-i18n';

jest.mock('in-custom-dashboards/widgets/SloLegacy/sli/api', () => {
  const { just } = jest.requireActual('@instana/observables');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    createSliConfiguration: jest.fn(() => just(success({})))
  };
});
const createSliConfiguration = cSC as jest.MockedFunction<typeof cSC>;

jest.mock('in-components/QueryBuilder', () => {
  const { just } = jest.requireActual('@instana/observables');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    createQueryBuilder: jest.fn(() => ({
      QueryBuilder: () => <div>QueryBuilder</div>,
      isQueryValid: () => just(success(true))
    }))
  };
});

jest.mock('in-applications/subscriptions/getApplication', () => {
  const { just } = jest.requireActual('@instana/observables');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    __esModule: true,
    default: () =>
      just(
        success({
          id: 'Stans fabulous bugs',
          label: 'Stans fabulous bugs application',
          boundaryScope: 'ALL',
          entityType: 'APPLICATION'
        })
      )
  };
});

jest.mock('in-websites/subscriptions/getWebsite', () => {
  const { just } = jest.requireActual('@instana/observables');
  const { success } = jest.requireActual('in-services/util/result');
  return {
    __esModule: true,
    default: () =>
      just(
        success({
          id: 'Stans fabulous bugs website',
          label: 'Stans fabulous bugs website'
        })
      )
  };
});

describe('in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliFormFactory', () => {
  describe('application sli type', () => {
    const entityType = 'application';

    it('correctly maps application type sli configurations to the backend model when saving', () => {
      // given
      const entityId = 'Stans fabulous bugs';
      const sliConfig: SliConfigBySliType<'application'> = {
        id: 'someId',
        sliName: 'hatching sli',
        metricConfiguration: {
          metricName: 'errors',
          threshold: 1,
          metricAggregation: 'MEAN'
        },
        sliEntity: {
          applicationId: entityId,
          serviceId: 'hatching service',
          endpointId: 'hatch',
          sliType: 'application',
          boundaryScope: 'ALL'
        },
        initialEvaluationTimestamp: 0
      };

      // when
      render(
        <CreateSliFormFactory
          entityType={entityType}
          entityId={entityId}
          sliConfig={sliConfig}
          setFooter={jest.fn()}
          onSave={jest.fn()}
          close={jest.fn()}
        />
      );

      fireEvent.submit(
        screen.getByRole('form', { name: t('in-custom-dashboards:widgets.slo.createSliForm.formName') })
      );

      // then
      const { initialEvaluationTimestamp, ...expectedConfigPayload } = sliConfig;
      expect(createSliConfiguration).toHaveBeenLastCalledWith({
        ...expectedConfigPayload,
        sliEntity: expect.objectContaining(expectedConfigPayload.sliEntity)
      });
    });

    it('correctly maps availability type sli configurations to the backend model when saving', () => {
      // given
      const entityId = 'Stans fabulous bugs';
      const badEventFilterExpression = toBackendQueryModel(
        joinExpressions({
          expressions: [
            tagFilter('agent.zone', 'EQUALS', 'Stans Lab', undefined, 'DESTINATION'),
            tagFilter('call.erroneous', 'EQUALS', true)
          ]
        })
      );
      const goodEventFilterExpression = toBackendQueryModel(
        joinExpressions({
          expressions: [
            tagFilter('agent.zone', 'EQUALS', 'Stans Lab', undefined, 'DESTINATION'),
            tagFilter('call.erroneous', 'EQUALS', false)
          ]
        })
      );
      const sliConfig: SliConfigBySliType<'application'> = {
        id: 'someId',
        sliName: 'hatching sli',
        sliEntity: {
          applicationId: entityId,
          serviceId: 'hatching service',
          endpointId: 'hatch',
          sliType: 'availability',
          boundaryScope: 'ALL',
          includeInternal: false,
          includeSynthetic: true,
          badEventFilterExpression,
          goodEventFilterExpression
        },
        initialEvaluationTimestamp: 0
      };

      // when
      render(
        <CreateSliFormFactory
          entityType={entityType}
          entityId={entityId}
          sliConfig={sliConfig}
          setFooter={jest.fn()}
          onSave={jest.fn()}
          close={jest.fn()}
        />
      );

      fireEvent.submit(
        screen.getByRole('form', { name: t('in-custom-dashboards:widgets.slo.createSliForm.formName') })
      );

      // then
      const { initialEvaluationTimestamp, ...expectedConfigPayload } = sliConfig;
      expect(createSliConfiguration).toHaveBeenLastCalledWith(expectedConfigPayload);
    });
  });

  describe('website sli type', () => {
    const entityType = 'website';

    it('correctly maps website time base type sli configurations to the backend model when saving', () => {
      // given
      const entityId = 'Stans fabulous bugs website';
      const beaconFilterExpression = toBackendQueryModel(
        joinExpressions({
          expressions: [
            tagFilter('agent.zone', 'EQUALS', 'Stans Lab', undefined, 'DESTINATION'),
            tagFilter('call.erroneous', 'EQUALS', false)
          ]
        })
      );
      const sliConfig: SliConfigBySliType<'website'> = {
        id: 'someId',
        sliName: 'hatching sli',
        sliEntity: {
          sliType: 'websiteTimeBased',
          beaconType: 'httpRequest',
          filterExpression: beaconFilterExpression,
          websiteId: entityId
        },
        metricConfiguration: {
          metricName: 'beaconErrorRate',
          threshold: 1,
          metricAggregation: 'MEAN'
        },
        initialEvaluationTimestamp: 0
      };

      // when
      render(
        <CreateSliFormFactory
          entityType={entityType}
          entityId={entityId}
          sliConfig={sliConfig}
          setFooter={jest.fn()}
          onSave={jest.fn()}
          close={jest.fn()}
        />
      );

      fireEvent.submit(
        screen.getByRole('form', { name: t('in-custom-dashboards:widgets.slo.createSliForm.formName') })
      );

      // then
      const { initialEvaluationTimestamp, ...expectedConfigPayload } = sliConfig;
      expect(createSliConfiguration).toHaveBeenLastCalledWith(expectedConfigPayload);
    });

    it('correctly maps website event based type sli configurations to the backend model when saving', () => {
      // given
      const entityId = 'Stans fabulous bugs website';
      const badEventFilterExpression = toBackendQueryModel(
        joinExpressions({
          expressions: [
            tagFilter('beacon.page.name', 'EQUALS', 'Stans Bug List'),
            tagFilter('beacon.erroneous', 'EQUALS', true)
          ]
        })
      );
      const goodEventFilterExpression = toBackendQueryModel(
        joinExpressions({
          expressions: [
            tagFilter('beacon.page.name', 'EQUALS', 'Stans Bug List'),
            tagFilter('beacon.erroneous', 'EQUALS', false)
          ]
        })
      );
      const sliConfig: SliConfigBySliType<'website'> = {
        id: 'someId',
        sliName: 'hatching sli',
        sliEntity: {
          sliType: 'websiteEventBased',
          beaconType: 'httpRequest',
          goodEventFilterExpression,
          badEventFilterExpression,
          websiteId: entityId
        },
        initialEvaluationTimestamp: 0
      };

      // when
      render(
        <CreateSliFormFactory
          entityType={entityType}
          entityId={entityId}
          sliConfig={sliConfig}
          setFooter={jest.fn()}
          onSave={jest.fn()}
          close={jest.fn()}
        />
      );

      fireEvent.submit(
        screen.getByRole('form', { name: t('in-custom-dashboards:widgets.slo.createSliForm.formName') })
      );

      // then
      const { initialEvaluationTimestamp, ...expectedConfigPayload } = sliConfig;
      expect(createSliConfiguration).toHaveBeenLastCalledWith({
        ...expectedConfigPayload,
        sliEntity: expect.objectContaining(expectedConfigPayload.sliEntity)
      });
    });
  });
});
