/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, MapForm, Field, Item, ValidationResult, MapFormItems } from 'formalistic';
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { add } from 'date-fns';
import { RRule } from 'rrule';

import {
  Duration,
  MaintenanceConfigV2,
  OneTimeMaintenanceWindow,
  RecurrentMaintenanceWindow,
  TagFilterExpressionElementUnion
} from '@instana/types';
import { DateFormatterInput } from '@instana/format-date';
import { Observable } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { Button } from '@instana/components';

import {
  SETTINGS_MAINTENANCE_WINDOW_ADVANCED,
  SETTINGS_MAINTENANCE_WINDOW_CANCEL,
  SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE,
  SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO,
  SETTINGS_MAINTENANCE_WINDOW_SIMPLE,
  SETTINGS_MAINTENANCE_WINDOW_SUBMIT
} from 'in-services/tracking/eventNames';
import {
  advancedModeMaintenanceWindowTracker,
  cancelMaintenanceWindowTracker,
  nextStepOneMaintenanceWindowTracker,
  nextStepTwoMaintenanceWindowTracker,
  simpleModeMaintenanceWindowTracker,
  submitMaintenanceWindowTracker
} from 'in-settings/tracker';
import {
  createMaintenanceConfigV2,
  createMaintenanceWindowV2,
  getMaintenanceConfigV2,
  saveMaintenanceConfigV2
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/api';
import {
  MaintenanceStepConfigObject,
  stepConfigs
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/simpleModeConfig';
import RecurrentMaintenanceConfigContainer from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceConfigContainer';
import {
  setPartsToUTCDate,
  subtractDurationFromGivenTime
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/rruleHelpers';
import { maintenanceWindowCTATracker } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/tracker';
import { applicationIdsToDfq, parseQuery } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useEntityForm, { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import { globalSettingsAlertingMaintenanceConfigurations } from 'in-settings/navigation/paths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { formatTime, formatDate, parseDateTime } from 'in-services/formatters/date';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { timeValidator, dateValidator } from 'in-services/validators/date';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { notBlankValidator } from 'in-services/validators/string';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { getSingle } from 'in-services/settings/settings';
import Section from 'in-settings/components/Section';
import { Nullish } from 'in-types';
import { Trans, t } from 'in-i18n';

import locals from './MaintenanceConfiguration.mless';

interface MatchParams {
  id: string;
}

interface RMConfigProps {
  setSaved?: Function;
  existingID?: string;
}

export default function RecurrentMaintenanceConfigForm(props: RouteComponentProps<MatchParams> & RMConfigProps) {
  const id = props.existingID || props.match.params.id || '';
  const entityId = id === 'new' ? null : id;
  const { location, goToPath, createHrefToPath } = useNavigation();
  const onClose = () => {
    close();
    if (props.setSaved) props.setSaved(true);

    goToPath(globalSettingsAlertingMaintenanceConfigurations);
  };
  const [step, setStep] = useState<number>(0);
  const [simpleMode, setSimpleMode] = useState(!entityId);
  const entityFormParams = {
    entityId,
    createDefaultEntity: createMaintenanceConfigV2,
    createForm: (config: MaintenanceConfigV2) => createForm(config, !entityId),
    getEntityFromApi: getMaintenanceConfigV2,
    openEntities: () => goToPath(globalSettingsAlertingMaintenanceConfigurations),
    saveEntity: (config: MaintenanceConfigV2, form: MapForm<any>) => {
      return save(config, form, !entityId, simpleMode);
    },
    onClose,
    onSaveSuccess: () => {
      const entityName = form && form.get('name') && (form.get('name') as Field<string>).value;
      let entityIDForLink = entityId;
      if (!entityIDForLink) entityIDForLink = form && form.get('id') && (form.get('id') as Field<string>).value;
      let hrefForLinking = createHrefToPath(location.pathname);
      if (!entityId) hrefForLinking = createHrefToPath(location.pathname + `/${entityIDForLink}`);
      addMessage({
        type: 'info',
        timeout: 5000,
        title: entityIDForLink
          ? t('in-settings:maintenanceWindow.userInfo.edit.title')
          : t('in-settings:maintenanceWindow.userInfo.create.title'),
        content: (
          <div>
            <p>
              {entityId && (
                <Trans i18nKey="in-settings:maintenanceWindow.userInfo.edit.message" values={{ name: entityName }} />
              )}
              {!entityId && (
                <Trans i18nKey="in-settings:maintenanceWindow.userInfo.create.message" values={{ name: entityName }} />
              )}
            </p>
            <Button kind="action" href={hrefForLinking}>
              {t('in-settings:tabs.viewMwConfigMessage')}
            </Button>
          </div>
        )
      });
      onClose();
    }
  };

  const { entity, form, isCreate, loading, error, message, onSubmit, setForm, onChange } =
    useEntityForm<MaintenanceConfigV2>(entityFormParams);

  if (loading) return <LoadingIndicator size={'xl'} />;

  if (!entity && error) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
          {t('in-settings:tabs.unknownMaintenanceWindowConfiguration')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>{t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}</DescriptionText>
      </SettingsDetailPage>
    );
  } else {
    return (
      <RecurrentMaintenanceForm
        entity={entity}
        form={form}
        message={message}
        error={error}
        loading={loading}
        isCreate={isCreate}
        onClose={onClose}
        onSubmit={onSubmit}
        setForm={setForm}
        onChange={onChange}
        step={step}
        setStep={setStep}
        simpleMode={simpleMode}
        setSimpleMode={setSimpleMode}
      />
    );
  }
}
interface RecurrentMaintenanceFormProps {
  entity: MaintenanceConfigV2 | null;
  form: MapForm<any> | null;
  message: string | null;
  error: boolean;
  loading: boolean;
  isCreate: boolean;
  onClose: () => void;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setForm: SetFormFunction;
  onSubmit: (e: FormEvent<Element>) => void;
  onChange: OnEntityChange<MaintenanceConfigV2>;
  simpleMode: boolean;
  setSimpleMode: React.Dispatch<React.SetStateAction<boolean>>;
}
function RecurrentMaintenanceForm({
  entity,
  form,
  message,
  error,
  loading,
  isCreate,
  onClose,
  step,
  setStep,
  setForm,
  onChange,
  onSubmit,
  simpleMode,
  setSimpleMode
}: RecurrentMaintenanceFormProps) {
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const { location } = useNavigation();
  if (!form || loading || !entity) return <LoadingIndicator size="regular" />;
  const footer = simpleMode ? (
    <DialogFooter
      form={form}
      onSecondaryActionClick={() => {
        if (step === 0) {
          maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_CANCEL, location.pathname);
          onClose();
        } else {
          setStep(step - 1);
        }
      }}
      secondaryActionText={
        step === 0
          ? t('in-components:blueprintFormMultistep.buttonCancel')
          : t('in-components:blueprintFormMultistep.buttonBack')
      }
      primaryActionDisabled={!form.hierarchyValid}
      renderCustomSaveAction={
        step < stepConfigs.length - 1
          ? () => (
              <Button
                kind="primary"
                onClick={() => {
                  if (step === 0) {
                    maintenanceWindowCTATracker(
                      SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE,
                      location.pathname,
                      form.get('id').value
                    );
                    nextStepOneMaintenanceWindowTracker({ id: form.get('id') });
                  } else {
                    maintenanceWindowCTATracker(
                      SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO,
                      location.pathname,
                      form.get('id').value
                    );
                    nextStepTwoMaintenanceWindowTracker({ id: form.get('id') });
                  }
                  setStep(step + 1);
                }}
                disabled={validateStep(form, stepConfigs, step)}
                key="next"
              >
                {t('in-components:blueprintFormMultistep.buttonNext')}
              </Button>
            )
          : () => (
              <Button
                kind="primary"
                type="submit"
                key="createSave"
                disabled={!form.hierarchyValid || validateStep(form, stepConfigs, step)}
              >
                {isCreate ? t('in-components:blueprintFormMultistep.buttonCreate') : t('in-settings:tabs.save')}
              </Button>
            )
      }
    />
  ) : (
    <DialogFooter
      form={form}
      saving={loading}
      primaryActionText={isCreate ? t('in-components:blueprintFormMultistep.buttonCreate') : t('in-settings:tabs.save')}
      primaryActionDisabled={!form.hierarchyValid || validateStep(form, stepConfigs, step)}
      onSecondaryActionClick={() => {
        cancelMaintenanceWindowTracker({});
        maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_CANCEL, location.pathname);
        onClose();
      }}
      secondaryActionText={t('in-components:blueprintFormMultistep.buttonCancel')}
    />
  );

  return (
    <form onSubmit={onSubmit}>
      <DialogWithSlideInView
        title={
          isCreate ? t('in-settings:tabs.scheduleMaintenanceWindow') : t('in-settings:tabs.changeMaintenanceWindow')
        }
        titleIconType="lib_actions_build_outline"
        slideInViewVisible={slideInViewVisible}
        doNotCloseOnOutsideClick
        onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
        onClose={() => {
          cancelMaintenanceWindowTracker({});
          maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_CANCEL, location.pathname);
          onClose();
        }}
        renderCustomCloseBehaviour={() => (
          <Button
            onClick={() => {
              const newMode = !simpleMode;
              if (simpleMode) {
                advancedModeMaintenanceWindowTracker({});
                maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_ADVANCED, location.pathname);
              } else {
                simpleModeMaintenanceWindowTracker({});
                maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_SIMPLE, location.pathname);
              }
              setSimpleMode(newMode);
            }}
            kind="action"
          >
            {simpleMode
              ? t('in-applications:creation.switchAdvancedMode')
              : t('in-applications:creation.switchSimpleMode')}
          </Button>
        )}
        footer={footer}
      >
        {message ? (
          <Section>
            <Notification failure={error} loading={loading}>
              {message}
            </Notification>
          </Section>
        ) : null}

        <div className={simpleMode ? locals.simpleDialog : locals.dialog}>
          <RecurrentMaintenanceConfigContainer
            entity={entity}
            form={form}
            onChange={onChange}
            onChangeApplyOn={onChangeApplyOn}
            step={step}
            simpleMode={simpleMode}
            setForm={setForm}
          />
        </div>
      </DialogWithSlideInView>
    </form>
  );
}

function validateStep(
  form: MapForm<any>,
  stepConfig: Array<MaintenanceStepConfigObject>,
  currentStep: number
): boolean {
  let validationResult = false;
  const currentStepConfig = stepConfig[currentStep];
  if (currentStepConfig && currentStepConfig.mustBeTouched && currentStepConfig.mustBeValid) {
    currentStepConfig.mustBeTouched.forEach(fieldPath => {
      // So this try catch is necessary because getIn will throw an error if the path doesn't exist
      // The intended behaviour is to skip checking the field if it does not exist as this might happen such as checking the scope
      try {
        //@ts-expect-error
        const field = form.getIn(fieldPath);
        if (!field.touched) {
          validationResult = true;
        }
      } catch (err) {
        return;
      }
    });

    if (!validationResult && !validationResult) {
      const checkValid = currentStepConfig.mustBeValid;

      checkValid.forEach(fieldPath => {
        try {
          //@ts-expect-error
          const field = form.getIn(fieldPath);
          if (!field.valid) {
            validationResult = true;
            return;
          }
        } catch (err) {
          return;
        }
      });
    }
    // RRULE Validation
    //@ts-expect-error
    const rrule = (form.getIn(['window', 'recurrence', 'rrule']) as Field<RRule | Nullish>).value;
    if (currentStep === 0 && rrule) {
      //@ts-expect-error
      const interval = form.getIn(['window', 'recurrence', 'interval']) as Field<string | number>;
      //@ts-expect-error
      const repeatType = (form.getIn(['window', 'recurrence', 'repeatType']) as Field<string>).value;
      const freq = rrule.options.freq;

      if (freq !== RRule.YEARLY) {
        const parsedIntervalVal = Number(interval.value);
        if (!interval.touched || isNaN(parsedIntervalVal) || parsedIntervalVal < 0) {
          validationResult = true;
        }
      }

      if (repeatType === 'aDate' && !rrule.options.until) {
        validationResult = true;
      } else if (repeatType === 'numOccur' && !rrule.options.count) {
        validationResult = true;
      }
    }
  }
  return validationResult;
}

function save(
  config: MaintenanceConfigV2,
  form: MapForm<any>,
  isNew: boolean,
  isSimple: boolean
): Observable<MaintenanceConfigV2> {
  const window = form.get('window') as MapForm<any>;
  const windowStart = getTime(window.get('start') as MapForm<any>);
  const duration = (window.get('duration') as Field<Duration>).value;
  const rrule = (window.getIn(['recurrence', 'rrule']) as Field<RRule>)?.value;
  let rruleWithoutInvalidRules = rrule ? new RRule(rrule.options) : null;
  if (rruleWithoutInvalidRules) {
    rruleWithoutInvalidRules.options.byhour = [];
    rruleWithoutInvalidRules.options.byminute = [];
    rruleWithoutInvalidRules.options.bysecond = [];
    //@ts-expect-error
    rruleWithoutInvalidRules.options.wkst = null;
    rruleWithoutInvalidRules.origOptions.byweekday = rrule.origOptions.byweekday; // Documented here https://github.com/jkbrzt/rrule?tab=readme-ov-file#instance-properties
  }
  let scheduling;

  let rruleString = '';

  if (rruleWithoutInvalidRules) {
    rruleString = RRule.optionsToString({
      ...rruleWithoutInvalidRules.options,
      byweekday: rrule.options.freq === 1 ? rrule.origOptions.byweekday : rruleWithoutInvalidRules.options.byweekday
    });
  }

  if (rrule) {
    const recurrentStart = windowStart;
    scheduling = {
      start: recurrentStart,
      type: 'RECURRENT',
      duration,
      rrule: rruleString ? rruleString.split('RRULE:')[1] : '',
      timezoneId: getSingle('formatTimestampsAsUtc') ? 'UTC' : new Intl.DateTimeFormat().resolvedOptions().timeZone //If format as UTC then we send an empty string
    } as RecurrentMaintenanceWindow;
  } else {
    scheduling = {
      start: windowStart,
      type: 'ONE_TIME',
      duration
    } as OneTimeMaintenanceWindow;
  }

  // the query field might not exist in case 'Apply on ALL' is selected,
  // which corresponds to an empty query
  const tagFilterExpressionEnabled = form.get('tagFilterExpressionEnabled').value;
  let query = '';
  let tagFilterExpression;

  if (tagFilterExpressionEnabled) {
    const tagFilterExpressionform = form.get('tagFilterExpression').value;
    tagFilterExpression = toBackendQueryModel(tagFilterExpressionform, false);
  } else {
    query = getQueryFromFormField(form);
  }

  const nameVal =
    form && form.get('name') && (form.get('name') as Field<string>).value
      ? (form.get('name') as Field<string>).value
      : null;

  const instrumentationEventProperties = {
    windowStart: windowStart || null,
    query,
    mwID: config ? config.id : null,
    name: nameVal,
    isNew,
    isSimple,
    schedulingType: scheduling.type,
    schedulingStart: scheduling.start,
    schedulingDurationAmount: scheduling.duration.amount,
    schedulingDurationUnit: scheduling.duration.unit,
    schedulingRRule: scheduling.type == 'RECURRENT' ? scheduling.rrule : '',
    schedulingTimezoneId: scheduling.type == 'RECURRENT' ? scheduling.timezoneId : ''
  };

  submitMaintenanceWindowTracker(instrumentationEventProperties);

  //maintenanceWindowObjectModification(isNew ? CREATED_OBJECT : UPDATED_OBJECT, location.pathname, scheduling.type);
  maintenanceWindowCTATracker(
    SETTINGS_MAINTENANCE_WINDOW_SUBMIT,
    location?.pathname,
    undefined,
    JSON.stringify(instrumentationEventProperties)
  );
  return saveMaintenanceConfigV2(
    createMaintenanceConfigV2(
      config ? config.id : '',
      config ? config.paused : false,
      nameVal || '',
      query,
      scheduling,
      tagFilterExpressionEnabled,
      tagFilterExpression
    )
  );
}

function getTime(subForm: MapForm<any>) {
  const dateVal = (subForm.get('date') as Field<string>).value;
  const timeVal = (subForm.get('time') as Field<string>).value;
  let parsedDateTime = null;

  try {
    parsedDateTime = parseDateTime(`${dateVal} ${timeVal}`).getTime();
  } catch (exception) {
    parsedDateTime = null;
  }
  return parsedDateTime;
}

function onChangeApplyOn(form: MapForm<any>, applyOn: string): MapForm<any> | Nullish {
  if (!applyOn) {
    return;
  }
  let updatedForm = form.updateIn(['applyOn'], (field: Item) =>
    (field as Field<string>).setValue(applyOn).setTouched(true)
  );

  if (applyOn === 'all') {
    updatedForm = updatedForm.remove('query');
    updatedForm = updatedForm.remove('applicationIds');
    updatedForm = updatedForm.remove('tagFilterExpression');
  } else if (applyOn === 'application') {
    updatedForm = updatedForm.remove('query');
    updatedForm = updatedForm.remove('tagFilterExpression');
    //@ts-expect-error-next-line
    updatedForm = putApplicationIdFields(updatedForm, []);
  } else if (applyOn === 'synthetic') {
    updatedForm = updatedForm.remove('query');
    //@ts-expect-error-next-line
    updatedForm = putTagFilterExpressionFields(updatedForm, true);
  } else {
    updatedForm = updatedForm.remove('applicationIds');
    updatedForm = updatedForm.remove('tagFilterExpression');
    //@ts-expect-error-next-line
    updatedForm = putQueryFields(updatedForm, '');
  }

  // Update any booleans

  if (applyOn !== 'synthetic') {
    //@ts-expect-error-next-line
    updatedForm = updatedForm.updateIn(['tagFilterExpressionEnabled'], (field: Item) =>
      (field as Field<boolean>).setValue(false)
    );
  } else {
    //@ts-expect-error-next-line
    updatedForm = updatedForm.updateIn(['tagFilterExpressionEnabled'], (field: Item) =>
      (field as Field<boolean>).setValue(true)
    );
  }
  return updatedForm;
}

function createForm(config: MaintenanceConfigV2, isCreate: boolean): MapForm<any> {
  const scheduling = config.scheduling as RecurrentMaintenanceWindow;
  const startTime = new Date(scheduling.start !== -1 ? scheduling.start : '');
  const windowStart = createMaintenanceWindowV2(config.id, !isNaN(startTime.getTime()) ? startTime : null);
  const tagFilterExpressionEnabled = config.tagFilterExpressionEnabled;
  const query = config.query;

  // always set to 'Dynamic Focus Query' per default for new configs, so that
  // the user manually has to select 'All' in case he really want that
  //const applyOn = isCreate || isNotBlank(query) ? 'dfq' : 'all';

  let applyOn, applicationIds;
  if (!tagFilterExpressionEnabled) {
    const parsedQueryResponse = isCreate ? { applyOn: '', applicationIds: [] } : parseQuery(query);
    applyOn = parsedQueryResponse.applyOn;
    applicationIds = parsedQueryResponse.applicationIds;
  } else {
    applyOn = 'synthetic';
  }

  let form = createMapForm()
    .put(
      'id',
      createField({
        value: config.id
      })
    )
    .put(
      'name',
      createField({
        value: config.name,
        validator: notBlankValidator,
        touched: !isCreate
      })
    )
    .put('window', getWindowSubForm(windowStart, scheduling, isCreate))
    .put(
      'applyOn',
      createField({
        value: applyOn,
        validator: notBlankValidator,
        touched: !isCreate
      })
    );

  if (applyOn === 'dfq') {
    //@ts-expect-error-next-line
    form = putQueryFields(form, query);
  }

  if (applyOn === 'application') {
    //@ts-expect-error-next-line
    form = putApplicationIdFields(form, applicationIds);
  }

  if (applyOn === 'synthetic') {
    //@ts-expect-error-next-line
    form = putTagFilterExpressionFields(form, true, config.tagFilterExpression);
  } else {
    //@ts-expect-error-next-line
    form = putTagFilterExpressionFields(form, false);
  }

  return form;
}

function selectedApplicationsValidator(selectedApplications: Array<string>): ValidationResult | Nullish {
  if (selectedApplications.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneApplication')
      }
    ];
  }
  return null;
}

function putApplicationIdFields(form: MapForm<any>, applicationIds: Array<string> | undefined) {
  let updatedForm = form.put(
    'applicationIds',
    createField({
      value: applicationIds ? applicationIds : [],
      validator: selectedApplicationsValidator
    })
  );
  return updatedForm;
}

function putQueryFields(form: MapForm<any>, query: string) {
  return form.put(
    'query',
    createField({
      value: query,
      validator: notBlankValidator
    })
  );
}

function putTagFilterExpressionFields(
  form: MapForm<any>,
  tagFilterExpressionEnabled: boolean,
  tagFilterExpression: TagFilterExpressionElementUnion | undefined
) {
  let updatedForm = form.put(
    'tagFilterExpressionEnabled',
    createField({
      value: tagFilterExpressionEnabled
    })
  );
  if (tagFilterExpressionEnabled) {
    //@ts-expect-error-next-line
    updatedForm = updatedForm.put(
      'tagFilterExpression',
      createField({
        value: tagFilterExpression ? fromBackendModel(tagFilterExpression) : [],
        validator: syntheticTagFilterExpressionValidator
      })
    );
  }

  return updatedForm;
}

function syntheticTagFilterExpressionValidator(tfe: any[]): ValidationResult {
  if (tfe.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneTagFilter')
      }
    ];
  }
  return null;
}

function getQueryFromFormField(form: MapForm<any>): string {
  if (form.containsKey('applicationIds')) {
    return applicationIdsToDfq((form.get('applicationIds') as Field<Array<string>>).value);
  } else if (form.containsKey('query')) {
    return (form.get('query') as Field<string>).value;
  } else {
    return '';
  }
}

function getWindowSubForm(
  window: WindowObject,
  scheduling: RecurrentMaintenanceWindow,
  isCreate: boolean
): MapForm<any> {
  const duration = scheduling.duration && scheduling.duration.amount ? scheduling.duration.amount : null;
  const durationUnit = scheduling.duration && scheduling.duration.unit ? scheduling.duration.unit : null;

  const rrule = scheduling.rrule ? RRule.fromString(scheduling.rrule) : null;
  const freq = rrule ? rrule.options.freq : 'oneTime';

  return createMapForm({
    // using items instead of put, so that windowValidator is only called once
    // after all fields/subForms are added
    items: {
      id: createField({
        value: window.id,
        touched: !isCreate
      }),
      start: getDateTimeSubForm(window.start, isCreate),
      duration: createField({
        value: { amount: duration, unit: durationUnit },
        touched: !isCreate
      }),
      frequencyType: createField({
        value: freq,
        touched: !isCreate
      }),
      recurrence: getRecurrenceSubForm(rrule, isCreate)
    },
    validator: windowValidator
  });
}

function getDateTimeSubForm(ts: DateFormatterInput, isCreate: boolean): MapForm<any> {
  return createMapForm()
    .put(
      'date',
      createField({
        value: formatDate(ts) || '',
        validator: dateValidator,
        touched: !isCreate
      })
    )
    .put(
      'time',
      createField({
        value: formatTime(ts) || '',
        validator: timeValidator,
        touched: !isCreate
      })
    );
}

function getRecurrenceSubForm(rrule: RRule | null, isCreate: boolean): MapForm<any> {
  let repeatType = 'aDate';
  if (rrule) {
    if (rrule.options.count) {
      repeatType = 'numOccur';
    } else if (!rrule.options.until) {
      repeatType = 'forever';
    }
  }

  return createMapForm({
    items: {
      repeatType: createField({
        value: repeatType,
        touched: !isCreate
      }),
      // Created interval field for keeping track of input in UI
      interval: createField({
        value: rrule?.options.interval || '',
        touched: !isCreate
      }),
      rrule: createField({
        value: rrule,
        touched: !isCreate
      })
    },
    validator: rruleValidation
  });
}

function rruleValidation(r: MapFormItems): ValidationResult {
  const rrule = (r.rrule as Field<RRule | Nullish>).value;
  const interval = r.interval as Field<string>;
  const frequencyType = rrule?.options.freq;
  const intervalVal = parseInt(interval.value);
  if (!rrule) return null;

  if (interval.touched && (isNaN(intervalVal) || intervalVal < 0)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.validFrequency')
      }
    ];
  }

  if (
    (frequencyType === RRule.MONTHLY && intervalVal > 12) ||
    (frequencyType === RRule.WEEKLY && intervalVal > 52) ||
    (frequencyType === RRule.DAILY && intervalVal > 31)
  ) {
    const selectedError =
      frequencyType === RRule.DAILY ? 'daily' : frequencyType === RRule.WEEKLY ? 'weekly' : 'monthly';
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.validFrequency', { context: selectedError })
      }
    ];
  }
  return null;
}

function windowValidator(w: MapFormItems): ValidationResult {
  if (!w) {
    return null;
  }
  const wStartMap = w.start as MapForm<any>;
  const wRecurrenceMap = w.recurrence as MapForm<any>;
  const windowStart = getTime(wStartMap);
  const startDateField = wStartMap.get('date');
  const startTimeField = wStartMap.get('time');
  const duration = (w.duration as Field<Duration>)?.value;
  if ((!startDateField?.valid || !startTimeField?.valid) && startDateField?.touched && startTimeField?.touched) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.validDateAndTime')
      }
    ];
  }
  const rrule = (wRecurrenceMap.get('rrule') as Field<RRule>).value;
  if (w.duration?.touched) {
    if (
      !duration ||
      duration.amount <= 0 ||
      (duration.amount > 365 && duration.unit === 'DAYS') ||
      (duration.amount > 8784 && duration.unit === 'HOURS')
    ) {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.validDuration')
        }
      ];
    }
  }

  let windowEnd;
  if (!duration.amount || !duration.unit) return null;

  if (rrule && rrule.options.until) {
    windowEnd = rrule.options.until.getTime();
  } else if (rrule && rrule.options.count) {
    // We need to check if there are any dates after the current date
    // We cannot simply just check if there are any past the current time but we must take the current time and see if there are any within in the duration of the mw
    // This is for MWs that may begin before the current date ends but end after
    const checkingDateAfter = subtractDurationFromGivenTime(duration.amount, duration.unit, new Date());

    if (!rrule.after(setPartsToUTCDate(checkingDateAfter), true)) {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.finishedInTheNextFiveSeconds')
        }
      ];
    }
  } else if (!rrule && windowStart) {
    windowEnd = add(windowStart, { [duration.unit.toLocaleLowerCase()]: duration.amount }).getTime();
  } else {
    return null;
  }
  if (windowStart && windowEnd && windowStart >= windowEnd && startDateField?.touched && startTimeField?.touched) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.startTimeMustBeSmallerThanEndTime')
      }
    ];
  }
  const now = new Date();
  const nextFiveSeconds = new Date(now.getTime() + 5000).getTime();

  if (
    windowEnd &&
    startTimeField?.touched &&
    startDateField?.touched &&
    windowEnd >= now.getTime() &&
    windowEnd <= nextFiveSeconds
  ) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.finishedInTheNextFiveSeconds')
      }
    ];
  }

  if (windowEnd && startTimeField?.touched && startDateField?.touched && now.getTime() > windowEnd) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.finishedInTheNextFiveSeconds')
      }
    ];
  }

  return null;
}

export interface WindowObject {
  id: string;
  start: Date | null;
  end?: Date | null;
  duration?: Field<Duration>;
  recurrence?: MapForm<any>;
  isAllDay?: boolean;
}
