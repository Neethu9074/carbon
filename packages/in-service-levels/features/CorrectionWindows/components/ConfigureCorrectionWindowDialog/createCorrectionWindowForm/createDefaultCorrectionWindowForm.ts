/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm } from 'formalistic';
import { Frequency } from 'rrule';

import {
  createNameField,
  createStartFields,
  createReccurenceFields,
  createDurationFields
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createCorrectionWindowForm';
import { CorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';

const defaultFrequency = ONE_TIME;

export default function createDefaultCorrectionWindowForm(): CorrectionWindowForm {
  return createMapForm({
    items: {
      name: createNameField({ value: '' }),
      description: createField({ value: '' }),
      schedule: createMapForm({
        items: {
          start: createMapForm({
            items: createStartFields({
              date: { value: '' },
              time: { value: '' },
              allDay: { value: false },
              endDate: ''
            })
          }),
          duration: createMapForm({
            items: createDurationFields({ amount: { value: 0 }, unit: { value: 'hour' } })
          }),
          recurrence: createMapForm({
            items: createReccurenceFields({
              endDate: { value: '' },
              occurrences: { value: 0 },
              repeatUntil: { value: undefined },
              interval: { value: undefined },
              daysOfTheWeek: { value: [] },
              dayInterval: { value: undefined },
              date: { value: undefined },
              month: { value: undefined },
              repeatType: { value: undefined },
              frequency: defaultFrequency,
              startDate: ''
            })
          }),
          frequency: createField<typeof ONE_TIME | Frequency>({
            value: defaultFrequency
          })
        }
      }),
      sloIds: createField<string[]>({ value: [] })
    }
  });
}
