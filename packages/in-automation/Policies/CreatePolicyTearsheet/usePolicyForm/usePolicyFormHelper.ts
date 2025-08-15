/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { composeValidators, createField, CreateFieldOpts, createMapForm } from 'formalistic';
import { Frequency, RRule } from 'rrule';

import { formatDate, formatTimeWithoutSeconds } from '@instana/format-date';
import { Action, ConditionWhen, TriggerType } from '@instana/types';

import {
  canAutomateActionValidator,
  dateFieldValidator,
  daysOfTheWeekValidator,
  parametersValidator,
  policyTypeValidator,
  scopeValidator,
  startAndEndDateValidator
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/validator';
import {
  ActionConfigurationFormItems,
  DayInterval,
  Month,
  PolicyCondition,
  PolicyForm,
  RecurrenceFields,
  RepeatType,
  RepeatUntil,
  StartFields
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import {
  getActionConfigurationFromPolicy,
  getPolicyTriggerFromTriggers,
  isAutomatic,
  isManual,
  isScheduledPolicy
} from 'in-automation/utils/policy';
import {
  CONDITION_WHEN,
  ONE_TIME,
  POLICY_CONDITION
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { TriggerDetailsProps } from 'in-automation/AutomationCard/CreatePolicyButton';
import { maxValidator, positiveNumberValidator } from 'in-services/validators/number';
import { ApplyOn, ScopeFormItems } from 'in-automation/Policies/usePolicyForm/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { notBlankValidator } from 'in-services/validators/string';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { nameValidator } from 'in-automation/utils/validators';
import { timeValidator } from 'in-services/validators/date';
import { getSingle } from 'in-services/settings/settings';
import { POLICY_TYPE } from 'in-automation/constants';
import { Triggers } from 'in-automation/types';

const defaultFrequency = ONE_TIME;

function parsePolicy(policy: PolicyFormEntity) {
  const typeConfiguration = policy.typeConfigurations.find(
    typeConfiguration => typeConfiguration.name === (isManual(policy) ? POLICY_TYPE.MANUAL : POLICY_TYPE.AUTOMATIC)
  )!;

  const { agentId = '', inputParameterValues = [] } = getActionConfigurationFromPolicy(policy);

  return {
    name: policy.name,
    description: policy.description ?? '',
    actionId: typeConfiguration?.runnable.runConfiguration.actions[0]?.action?.id,
    agentId,
    applyOn: typeConfiguration.condition?.query ? SCOPE.DFQ : SCOPE.ALL,
    query: typeConfiguration.condition?.query ?? '',
    inputParameterValues,
    tags: policy.tags ?? [],
    manual: isManual(policy),
    automatic: isAutomatic(policy),
    condition: isScheduledPolicy(policy) ? POLICY_CONDITION.SCHEDULE : POLICY_CONDITION.EVENT,
    conditionWhen: typeConfiguration.condition?.when ?? CONDITION_WHEN.EVENT_OPEN
  };
}

export function parseTrigger(
  policy: PolicyFormEntity,
  triggers: Triggers
): { triggerId: string; triggerType: TriggerType } {
  const trigger = getPolicyTriggerFromTriggers(triggers, policy);

  if (!trigger && policy.trigger.type !== POLICY_CONDITION.SCHEDULE) {
    return {
      triggerType: 'builtinEvent',
      triggerId: ''
    };
  }

  return {
    triggerType: policy.trigger.type!,
    triggerId: policy.trigger.id!
  };
}
export function createReccurenceFields({
  endDate,
  repeatUntil,
  occurrences,
  interval,
  daysOfTheWeek,
  dayInterval,
  date,
  repeatType,
  month,
  frequency,
  startDate
}: {
  endDate: CreateFieldOpts<string>;
  repeatUntil: CreateFieldOpts<RepeatUntil | undefined>;
  occurrences: CreateFieldOpts<number>;
  interval: CreateFieldOpts<number | undefined>;
  daysOfTheWeek: CreateFieldOpts<number[]>;
  dayInterval: CreateFieldOpts<DayInterval | undefined>;
  date: CreateFieldOpts<number | undefined>;
  repeatType: CreateFieldOpts<RepeatType | undefined>;
  month: CreateFieldOpts<Month | undefined>;
  frequency: typeof ONE_TIME | Frequency;
  startDate: string;
}): RecurrenceFields {
  return {
    occurrences: createField({
      ...occurrences,
      validator: repeatUntil.value === 'occurrences' ? positiveNumberValidator : undefined
    }),
    repeatUntil: createField({
      ...repeatUntil,
      validator: frequency === ONE_TIME ? undefined : notBlankValidator
    }),
    endDate: createField({
      ...endDate,
      validator:
        repeatUntil.value === 'date'
          ? composeAndShortCircuitOnError<string>(dateFieldValidator, endDate =>
              startAndEndDateValidator(startDate, endDate)
            )
          : undefined
    }),
    interval: createField({
      ...interval,
      validator:
        frequency === Frequency.DAILY || frequency === Frequency.WEEKLY
          ? composeAndShortCircuitOnError(
              positiveNumberValidator,
              maxValidator(frequency === Frequency.DAILY ? 31 : 52)
            )
          : undefined
    }),
    daysOfTheWeek: createField({
      ...daysOfTheWeek,
      validator:
        frequency === Frequency.WEEKLY || (frequency === Frequency.MONTHLY && repeatType.value === 'day')
          ? daysOfTheWeekValidator
          : undefined
    }),
    dayInterval: createField({
      ...dayInterval,
      validator:
        (frequency === Frequency.MONTHLY || frequency === Frequency.YEARLY) && repeatType.value === 'day'
          ? notBlankValidator
          : undefined
    }),
    date: createField({
      ...date,
      validator:
        (frequency === Frequency.MONTHLY || frequency === Frequency.YEARLY) && repeatType.value === 'date'
          ? composeAndShortCircuitOnError(positiveNumberValidator, maxValidator(31))
          : undefined
    }),
    month: createField({
      ...month,
      validator: frequency === Frequency.YEARLY ? notBlankValidator : undefined
    }),
    repeatType: createField({
      ...repeatType,
      validator: frequency === Frequency.MONTHLY || frequency === Frequency.YEARLY ? notBlankValidator : undefined
    })
  };
}

export function createStartFields({
  date,
  time,
  endDate
}: {
  date: CreateFieldOpts<string>;
  time: CreateFieldOpts<string>;
  endDate: string;
}): StartFields {
  return {
    date: createField({
      ...date,
      validator: composeAndShortCircuitOnError<string>(dateFieldValidator, startDate =>
        startAndEndDateValidator(startDate, endDate)
      )
    }),
    time: createField({
      ...time,
      validator: composeValidators(notBlankValidator, v => timeValidator(v, 'HH:mm'))
    })
  };
}

interface RepeatOccurrences {
  repeatUntil: 'occurrences';
  occurrences: number;
}

interface RepeatForever {
  repeatUntil: 'forever';
}

interface RepeatDate {
  repeatUntil: 'date';
  endDate: string;
}

type ReccurrenceOption = RepeatOccurrences | RepeatForever | RepeatDate;
export function getReccurrenceOptions(rrule: RRule): ReccurrenceOption {
  if (rrule.options.count) {
    return {
      occurrences: rrule.options.count,
      repeatUntil: 'occurrences' as const
    };
  } else if (!rrule.options.until) {
    return { repeatUntil: 'forever' as const };
  }
  return { repeatUntil: 'date' as const, endDate: rrule.options.until.toISOString().slice(0, 10) };
}

export function rruleToFormValues(rrule: RRule) {
  const isMonthly = rrule.options.freq === Frequency.MONTHLY;
  const isYearly = rrule.options.freq === Frequency.YEARLY;

  const dayInterval = isMonthly || isYearly ? rrule.options.bynweekday?.[0]?.[1] : undefined;

  const date = isMonthly || isYearly ? rrule.options.bymonthday?.[0] : undefined;

  const daysOfTheWeek =
    isMonthly || isYearly
      ? rrule.options.bynweekday?.[0]?.[0] !== undefined
        ? [rrule.options.bynweekday[0][0]]
        : rrule.options.byweekday
      : rrule.options.byweekday;

  const month = rrule.options.freq === Frequency.YEARLY ? rrule.options.bymonth?.[0] : undefined;

  return {
    dayInterval,
    date,
    daysOfTheWeek: (daysOfTheWeek ?? []).filter((day): day is number => day !== undefined),
    month
  };
}

export function createPolicyFormFromPolicy(
  policy: PolicyFormEntity,
  actions: Action[],
  triggers: Triggers
): PolicyForm {
  const {
    name,
    description,
    actionId,
    agentId,
    applyOn,
    query,
    inputParameterValues,
    tags,
    manual,
    automatic,
    condition,
    conditionWhen
  } = parsePolicy(policy);
  const { triggerType, triggerId } = parseTrigger(policy, triggers);
  const { startDate, time } = getStart(policy);
  const { recurrentRule } = policy.trigger.scheduling ?? {};
  const recurrent = !!recurrentRule;
  const rrule = RRule.fromString(recurrentRule ?? '');
  const recurrence = recurrent ? getReccurrenceOptions(rrule) : null;
  const endDate = recurrence?.repeatUntil === 'date' ? recurrence.endDate : '';
  const { dayInterval, date, daysOfTheWeek, month } = rruleToFormValues(rrule);
  const frequency = recurrent ? rrule.options.freq : ONE_TIME;
  const isSchedulePolicy = triggerType === POLICY_CONDITION.SCHEDULE;

  return createMapForm({
    items: {
      name: createField({
        value: name,
        validator: nameValidator
      }),
      description: createField({
        value: description,
        validator: notBlankValidator
      }),
      tags: createField({
        value: tags
      }),
      action: createMapForm({
        items: {
          parameters: createField({
            value: inputParameterValues
          }),
          actionId: createField({
            value: actionId
          }),
          agentId: createField({
            value: agentId
          }),
          type: createMapForm({
            items: {
              manual: createField({
                value: manual
              }),
              automatic: createField({
                value: automatic
              })
            },
            validator: policyTypeValidator
          }),
          isActionPreSelected: createField({
            value: false
          }),
          isSchedulePolicy: createField({
            value: isSchedulePolicy
          })
        },
        validator: composeAndShortCircuitOnError(
          form => notBlankValidator(form.actionId.value),
          form => canAutomateActionValidator(form, actions),
          form => parametersValidator(form, actions)
        )
      }),
      triggerType: createField({
        value: triggerType,
        validator: notBlankValidator
      }),
      triggerId: createField({
        value: triggerId,
        validator: notBlankValidator
      }),
      scope: createMapForm({
        items: {
          applyOn: createField<ApplyOn>({
            value: applyOn
          }),
          query: createField({
            value: query
          })
        },
        validator: scopeValidator
      }),
      conditionWhen: createField<ConditionWhen>({
        value: conditionWhen
      }),
      condition: createField<PolicyCondition>({
        value: condition as PolicyCondition
      }),
      schedule: createMapForm({
        items: {
          start: createMapForm({
            items: createStartFields({
              date: { value: startDate },
              time: { value: time },
              endDate
            })
          }),
          recurrence: createMapForm({
            items: createReccurenceFields({
              endDate: { value: endDate },
              occurrences: { value: recurrence?.repeatUntil === 'occurrences' ? recurrence.occurrences : 0 },
              repeatUntil: { value: recurrence?.repeatUntil },
              interval: { value: rrule.options.interval },
              daysOfTheWeek: { value: daysOfTheWeek },
              dayInterval: { value: dayInterval as DayInterval },
              date: { value: date },
              month: { value: month as Month | undefined },
              repeatType: { value: rrule.options.bynweekday != null ? 'day' : 'date' },
              frequency,
              startDate
            })
          }),
          frequency: createField<typeof ONE_TIME | Frequency>({
            value: frequency
          })
        }
      })
    }
  });
}
export function createPolicyFormDefinition(actions: Action[], triggerDetails?: TriggerDetailsProps): PolicyForm {
  const { triggerType, triggerId } = triggerDetails ?? {};
  return createMapForm({
    items: {
      name: createField({
        value: '',
        validator: nameValidator
      }),
      description: createField({
        value: '',
        validator: notBlankValidator
      }),
      tags: createField<string[]>({
        value: []
      }),
      action: createMapForm<ActionConfigurationFormItems>({
        items: {
          parameters: createField({
            value: []
          }),
          actionId: createField({
            value: ''
          }),
          agentId: createField({
            value: ''
          }),
          type: createMapForm({
            items: {
              manual: createField({
                value: false
              }),
              automatic: createField({
                value: false
              })
            },
            validator: policyTypeValidator
          }),
          isActionPreSelected: createField({
            value: false
          }),
          isSchedulePolicy: createField({
            value: false
          })
        },
        validator: composeAndShortCircuitOnError(
          form => notBlankValidator(form.actionId.value),
          form => canAutomateActionValidator(form, actions),
          form => parametersValidator(form, actions)
        )
      }),
      triggerType: createField<TriggerType>({
        value: triggerType ?? 'builtinEvent',
        validator: notBlankValidator
      }),
      triggerId: createField({
        value: triggerId ?? '',
        validator: notBlankValidator
      }),
      scope: createMapForm<ScopeFormItems>({
        items: {
          applyOn: createField<ApplyOn>({
            value: 'all',
            validator: notBlankValidator
          }),
          query: createField({
            value: ''
          })
        },
        validator: scopeValidator
      }),
      conditionWhen: createField<ConditionWhen>({
        value: CONDITION_WHEN.EVENT_OPEN
      }),
      condition: createField<PolicyCondition>({
        value: 'event'
      }),
      schedule: createMapForm({
        items: {
          start: createMapForm({
            items: createStartFields({
              date: { value: '' },
              time: { value: '' },
              endDate: ''
            })
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
      })
    }
  });
}

function getStart(policy: PolicyFormEntity) {
  const { startTime } = policy.trigger.scheduling ?? {};

  // If no start time, return empty values
  if (!startTime) {
    return {
      startDate: '',
      time: ''
    };
  }

  // Check if UTC is enabled in user settings
  const isUtcEnabled = getSingle('formatTimestampsAsUtc');

  // Create a date object from the timestamp
  const date = new Date(startTime);

  let formattedDate;
  let formattedTime;

  if (isUtcEnabled) {
    // Format as UTC time
    formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    formattedTime = date.toISOString().split('T')[1].substring(0, 5); // "HH:MM"
  } else {
    // Format as local time
    formattedDate = formatDate(startTime) ?? '';
    formattedTime = formatTimeWithoutSeconds(startTime) ?? '';
  }

  return {
    startDate: formattedDate,
    time: formattedTime
  };
}
