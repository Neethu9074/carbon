/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field } from 'formalistic';

import useSloFormSideEffects from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSloFormSideEffects';
import { createForm } from 'in-custom-dashboards/widgets/SloLegacy/form';
import { formatDate, formatTime } from 'in-services/formatters/date';

jest.mock('in-services/formatters/date', () => {
  return {
    ...jest.requireActual('in-services/formatters/date'),
    formatTime: jest.fn(),
    formatDate: jest.fn(),
    __esModule: true
  };
});

const formatTimeMock = formatTime as jest.MockedFunction<typeof formatTime>;
const formatDateMock = formatDate as jest.MockedFunction<typeof formatDate>;

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useSloFormSideEffects', () => {
  describe('#handleTimeWindowChange', () => {
    it('it contains fields for startTimeStamp and timeDuration if timeWindowType is "fixed".', () => {
      let updatedForm: { [key: string]: unknown } = {};

      // GIVEN
      const form = createForm();
      formatDateMock.mockReturnValueOnce('date');
      formatTimeMock.mockReturnValueOnce('time');

      const updateForm = useSloFormSideEffects(form, f => {
        updatedForm = f.toJS();
      });

      // WHEN
      updateForm(form.updateIn(['timeWindowType'], f => (f as Field<string>).setValue('fixed').setTouched(true)));

      // THEN
      const timeWindowStart = updatedForm.timeWindowStart;
      expect(timeWindowStart).toHaveProperty('date');
      expect(timeWindowStart).toHaveProperty('time');
      expect(updatedForm).toHaveProperty('timeWindowDuration');
      expect(updatedForm).toHaveProperty('timeWindowDurationUnit');
    });
    it('it contains fields for timeDuration but not for startTimeStamp if timeWindowType is "rolling".', () => {
      let updatedForm: { [key: string]: unknown } = {};

      // GIVEN
      const form = createForm();
      const updateForm = useSloFormSideEffects(form, f => {
        updatedForm = f.toJS();
      });

      // WHEN
      updateForm(form.updateIn(['timeWindowType'], f => (f as Field<string>).setValue('rolling').setTouched(true)));

      // THEN
      expect(updatedForm).not.toHaveProperty('timeWindowStart');
      expect(updatedForm).toHaveProperty('timeWindowDuration');
      expect(updatedForm).toHaveProperty('timeWindowDurationUnit');
    });

    it('it does not contain fields for timeDuration and startTimeStamp if timeWindowType is "dynamic".', () => {
      let updatedForm: { [key: string]: unknown } = {};

      // GIVEN
      const form = createForm();
      const updateForm = useSloFormSideEffects(form, f => {
        updatedForm = f.toJS();
      });

      // WHEN
      updateForm(form.updateIn(['timeWindowType'], f => (f as Field<string>).setValue('dynamic').setTouched(true)));

      // THEN
      expect(updatedForm).not.toHaveProperty('timeWindowStart');
      expect(updatedForm).not.toHaveProperty('timeWindowDuration');
      expect(updatedForm).not.toHaveProperty('timeWindowDurationUnit');
    });
  });

  describe('#timeWindowDurationUnit', () => {
    it('it chooses the minimum value between last and actual timeWindowDuration if timeWindowDurationUnit changes.', () => {
      let updatedForm: { [key: string]: unknown } = {};

      // GIVEN
      const form = createForm({
        timeWindowDurationUnit: 'weeks',
        timeWindowDuration: 52,
        timeWindowType: 'rolling'
      });

      const updateForm = useSloFormSideEffects(form, f => {
        updatedForm = f.toJS();
      });

      // WHEN
      updateForm(
        form.updateIn(['timeWindowDurationUnit'], f => (f as Field<string>).setValue('months').setTouched(true))
      );

      // THEN
      expect(updatedForm.timeWindowDuration).toBe(12);
    });
  });

  describe('#clearSliConfigId', () => {
    it('Field sliConfigId is set to empty string on entityId change.', () => {
      let updatedForm: { [key: string]: unknown } = {};

      // GIVEN
      const form = createForm({
        entityId: 'oldEntityId',
        sliConfigId: 'sliConfigId'
      });

      const updateForm = useSloFormSideEffects(form, f => {
        updatedForm = f.toJS();
      });

      // WHEN
      updateForm(form.updateIn(['entityId'], f => (f as Field<string>).setValue('latestEntityId').setTouched(true)));

      // THEN
      expect(updatedForm.sliConfigId).toBe('');
    });
  });
});

describe('#clearSliConfigId', () => {
  it('Field entityId is set to empty string on entityType change.', () => {
    let updatedForm: { [key: string]: unknown } = {};

    // GIVEN
    const form = createForm({
      entityType: 'application',
      entityId: 'entityId'
    });

    const updateForm = useSloFormSideEffects(form, f => {
      updatedForm = f.toJS();
    });

    // WHEN
    updateForm(form.updateIn(['entityType'], f => (f as Field<string>).setValue('website').setTouched(true)));

    // THEN
    expect(updatedForm.entityId).toBe('');
  });
});
