/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import {
  useApplicationSliFormSideEffects,
  useWebsiteSliFormSideEffects
} from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import { getMetricOptions as gMO } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';

const getMetricOptions = gMO as jest.MockedFunction<typeof gMO>;

jest.mock('in-custom-dashboards/widgets/Slo/sli/metricFormData', () => {
  return {
    ...jest.requireActual('in-custom-dashboards/widgets/Slo/sli/metricFormData'),
    getMetricOptions: jest.fn()
  };
});

describe('in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects', () => {
  beforeEach(jest.clearAllMocks);

  const form = createMapForm({
    items: {
      sliEntity: createMapForm({
        items: {
          sliType: createField({ value: null }),
          goodEventFilterExpression: createField({ value: [] }),
          badEventFilterExpression: createField({ value: [] }),
          serviceId: createField({ value: null }),
          endpointId: createField({ value: null }),
          beaconType: createField({ value: 'httpRequest' })
        }
      }),
      metricConfiguration: createMapForm({
        items: {
          metricName: createField({ value: null }),
          threshold: createField({ value: null }),
          metricAggregation: createField({ value: null })
        }
      })
    }
  });
  const setForm = jest.fn();

  describe.each([[useApplicationSliFormSideEffects], [useWebsiteSliFormSideEffects]])('#%p', hookUnderTest => {
    it.each([['application'], ['websiteTimeBased']])(
      'removes filter expressions if sliEntity.sliType changes to %s',
      type => {
        // Given
        const updateForm = hookUnderTest(form, f => setForm(f.toJS()));
        const updatedForm = form.updateIn(['sliEntity', 'sliType'], f => (f as Field<string>).setValue(type));

        // When
        updateForm(updatedForm);

        // Then
        expect(setForm).toHaveBeenLastCalledWith(
          expect.not.objectContaining({
            sliEntity: expect.objectContaining({
              goodEventFilterExpression: expect.anything(),
              badEventFilterExpression: expect.anything()
            })
          })
        );
        expect(setForm).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sliEntity: expect.objectContaining({
              sliType: type
            })
          })
        );
      }
    );

    it.each([['application'], ['websiteTimeBased']])(
      'configures form for time based sli if sliEntity.sliType changes to %s',
      type => {
        // Given
        const updateForm = hookUnderTest(form, f => setForm(f.toJS()));
        const updatedForm = form.updateIn(['sliEntity', 'sliType'], f => (f as Field<string>).setValue(type));

        // When
        updateForm(updatedForm);

        // Then
        expect(setForm).toHaveBeenLastCalledWith(
          expect.objectContaining({
            metricConfiguration: expect.objectContaining({
              metricName: expect.anything(),
              metricAggregation: expect.anything(),
              threshold: expect.anything()
            })
          })
        );
        expect(setForm).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sliEntity: expect.objectContaining({
              sliType: type
            })
          })
        );
      }
    );

    it.each([['availability'], ['websiteEventBased']])(
      'removes metric configuration if sliEntity.sliType changes to %s',
      type => {
        // Given
        const updateForm = hookUnderTest(form, f => setForm(f.toJS()));
        const updatedForm = form.updateIn(['sliEntity', 'sliType'], f => (f as Field<string>).setValue(type));

        // When
        updateForm(updatedForm);

        // Then
        expect(setForm).toHaveBeenLastCalledWith(
          expect.not.objectContaining({
            metricConfiguration: expect.anything()
          })
        );
        expect(setForm).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sliEntity: expect.objectContaining({
              sliType: type
            })
          })
        );
      }
    );

    it.each([['availability'], ['websiteEventBased']])(
      'adds default filter expression configuration if sliEntity.sliType changes to %s',
      type => {
        // Given
        const updateForm = hookUnderTest(form, f => setForm(f.toJS()));
        const updatedForm = form
          .updateIn(['sliEntity', 'sliType'], f => (f as Field<string>).setValue(type))
          .updateIn(['sliEntity'], f =>
            (f as MapForm).remove('goodEventFilterExpression').remove('badEventFilterExpression')
          );

        // When
        updateForm(updatedForm);

        // Then
        expect(setForm).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sliEntity: expect.objectContaining({
              goodEventFilterExpression: expect.anything(),
              badEventFilterExpression: expect.anything(),
              sliType: type
            })
          })
        );
      }
    );

    it('resets service and endpoint id if sliEntity.sliType changes to "availability"', () => {
      // Given
      const updateForm = hookUnderTest(form, f => setForm(f.toJS()));
      const updatedForm = form
        .updateIn(['sliEntity', 'sliType'], f => (f as Field<string>).setValue('availability'))
        .updateIn(['sliEntity', 'serviceId'], f => (f as Field<string | null>).setValue('something'))
        .updateIn(['sliEntity', 'endpointId'], f => (f as Field<string | null>).setValue('something'));

      // When
      updateForm(updatedForm);

      // Then
      expect(setForm).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sliEntity: expect.objectContaining({
            sliType: 'availability',
            serviceId: expect.not.stringContaining('something'),
            endpointId: expect.not.stringContaining('something')
          })
        })
      );
    });
  });

  describe('useApplicationSliFormSideEffects', () => {
    it('resets metricConfiguration.threshold if metricName changes', () => {
      // Given
      const updateForm = useApplicationSliFormSideEffects(form, f => setForm(f.toJS()));
      const updatedForm = form
        .updateIn(['metricConfiguration', 'metricName'], f => (f as Field<string>).setValue('latency'))
        .updateIn(['metricConfiguration', 'threshold'], f => (f as Field<number>).setValue(10));
      getMetricOptions.mockReturnValueOnce({
        // @ts-expect-error This is an incomplete mock and jest and ts cause an issue when casting it to the correct type. Since it would need to be casted anyway we might as well ignore the error
        latency: {}
      });

      // When
      updateForm(updatedForm);

      // Then
      expect(setForm).toHaveBeenLastCalledWith(
        expect.objectContaining({
          metricConfiguration: expect.objectContaining({
            metricName: 'latency',
            threshold: ''
          })
        })
      );
    });

    it('sets metricAggregation to the default value if metricName changes', () => {
      // Given
      const updateForm = useApplicationSliFormSideEffects(form, f => setForm(f.toJS()));
      const updatedForm = form.updateIn(['metricConfiguration', 'metricName'], f =>
        (f as Field<string>).setValue('latency')
      );
      getMetricOptions.mockReturnValueOnce({
        // @ts-expect-error This is an incomplete mock and jest and ts cause an issue when casting it to the correct type. Since it would need to be casted anyway we might as well ignore the error
        latency: {
          defaultValue: 'P99'
        }
      });

      // When
      updateForm(updatedForm);

      // Then
      expect(setForm).toHaveBeenLastCalledWith(
        expect.objectContaining({
          metricConfiguration: expect.objectContaining({
            metricName: 'latency',
            threshold: ''
          })
        })
      );
    });
  });

  describe('useWebsiteSliFormSideEffects', () => {
    it('resets metricConfiguration.threshold if metricName changes', () => {
      // Given
      const updateForm = useWebsiteSliFormSideEffects(form, f => setForm(f.toJS()));
      const updatedForm = form
        .updateIn(['metricConfiguration', 'metricName'], f => (f as Field<string>).setValue('beaconErrorRate'))
        .updateIn(['metricConfiguration', 'threshold'], f => (f as Field<number>).setValue(10));
      getMetricOptions.mockReturnValueOnce({
        // @ts-expect-error This is an incomplete mock and jest and ts cause an issue when casting it to the correct type. Since it would need to be casted anyway we might as well ignore the error
        beaconErrorRate: {}
      });

      // When
      updateForm(updatedForm);

      // Then
      expect(setForm).toHaveBeenLastCalledWith(
        expect.objectContaining({
          metricConfiguration: expect.objectContaining({
            metricName: 'beaconErrorRate',
            threshold: ''
          })
        })
      );
    });

    it('sets metricAggregation to the default value if metricName changes', () => {
      // Given
      const updateForm = useWebsiteSliFormSideEffects(form, f => setForm(f.toJS()));
      const updatedForm = form.updateIn(['metricConfiguration', 'metricName'], f =>
        (f as Field<string>).setValue('beaconErrorRate')
      );
      getMetricOptions.mockReturnValueOnce({
        // @ts-expect-error This is an incomplete mock and jest and ts cause an issue when casting it to the correct type. Since it would need to be casted anyway we might as well ignore the error
        beaconErrorRate: {
          defaultValue: 'P99'
        }
      });

      // When
      updateForm(updatedForm);

      // Then
      expect(setForm).toHaveBeenLastCalledWith(
        expect.objectContaining({
          metricConfiguration: expect.objectContaining({
            metricName: 'beaconErrorRate',
            threshold: ''
          })
        })
      );
    });
  });
});
