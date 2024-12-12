/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, MapFormItems, Field, MapForm, ValidationMessage } from 'formalistic';
import React, { useState } from 'react';
import { List, Map } from 'immutable';

import {
  IconButton,
  Stack,
  TextArea,
  Typography,
  DescriptionList,
  DescriptionItem,
  CarbonTabs,
  CarbonTabList,
  CarbonTab,
  CarbonTabPanels,
  CarbonTabPanel,
  CarbonDropdown
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { Button } from '@instana/components';

import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
//@ts-expect-error
import Lettering from 'in-components/Lettering';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ChannelForm.mless';

// Potentially temporary until we pull in type from in-types
interface CustomEmailSubjectPrefix {
  issue?: CloseOpen;
  incident?: CloseOpen;
  change?: {
    changeValue?: string;
  };
  agentMonitoringIssue?: CloseOpen;
}

interface CustomEmailSubjectPrefixMapForm extends MapFormItems {
  issue: MapForm<CloseOpenMapForm>;
  incident: MapForm<CloseOpenMapForm>;
  change: MapForm<ChangeValueField>;
  agentMonitoringIssue: MapForm<CloseOpenMapForm>;
}

interface CloseOpen {
  openValue?: string;
  closeValue?: string;
}

interface ChangeValueField extends MapFormItems {
  changeValue: Field<string>;
}

interface CloseOpenMapForm extends MapFormItems {
  openValue: Field<string>;
  closeValue: Field<string>;
}

interface EmailAlertChannel {
  emails: string[];
  name: string;
  kind: string;
  customEmailSubjectPrefix?: CustomEmailSubjectPrefix;
}

interface EmailAlertChannelMapForm extends MapFormItems {
  name: Field<string>;
  kind: Field<string>;
  emails: Field<List<string>>;
  customEmailSubjectPrefix: MapForm<CustomEmailSubjectPrefixMapForm>;
}

interface EmailValidationResult extends ValidationMessage {
  mailIndex?: string | number;
  type?: string;
}

interface ComponentProps {
  form: MapForm<EmailAlertChannelMapForm>;
  onChange: OnEntityChange<EmailAlertChannelMapForm>;
}

const name = 'EMAIL';
const label = t('in-settings:tabs.email');
const testAlertChannelLabel = t('in-settings:tabs.sendTestEmail');
const defaultNewValue = 'unused';

const parameters = [
  {
    key: 'name',
    label: t('in-settings:tabs.name')
  },
  {
    key: 'kind',
    label: t('in-settings:tabs.type')
  },
  {
    key: 'emails',
    label: t('in-settings:tabs.emails')
  },
  {
    key: 'customEmailSubjectPrefix',
    label: t('in-settings:tabs.customSubjects'),
    isNested: true,
    nestedParamKeys: [
      {
        key: 'issue',
        label: t('in-settings:tabs.issue')
      },
      {
        key: 'incident',
        label: t('in-settings:tabs.incident')
      },
      {
        key: 'change',
        label: t('in-settings:tabs.change')
      },
      {
        key: 'agentMonitoringIssue',
        label: t('in-settings:tabs.monitoringIssues')
      }
    ]
  }
];

export default {
  name,
  label,
  testAlertChannelLabel,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel: EmailAlertChannel) {
    alertChannel.emails = [''];
    alertChannel.customEmailSubjectPrefix = {};
  },

  createDetails(alertChannel: Map<string, string | List<string> | List<string[]>>): JSX.Element | null {
    const emails = alertChannel.get('emails') as List<string>;
    if (!emails || emails.size === 0) {
      return null;
    }

    return (
      <DescriptionList inComponents>
        <DescriptionItem inComponents title={t('in-settings:tabs.eMails')}>
          {emails.toArray().map(email => (
            <div key={email}>{email}</div>
          ))}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  // Return type here should be MapForm<EmailAlertChannelMapForm> However due to the way put works we cannot do this
  createForm(alertChannel: Map<string, string | List<string> | List<string[]>>) {
    return createMapForm()
      .put(
        'kind',
        createField({
          value: name
        })
      )
      .put(
        'name',
        createField({
          value: alertChannel ? alertChannel.get('name') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'emails',
        createField({
          value: alertChannel && alertChannel.has('emails') ? (alertChannel.get('emails') as List<string>) : List(['']),
          validator: emails
        })
      )
      .put(
        'customEmailSubjectPrefix',
        createMapForm({
          items: {
            issue: createMapForm({
              items: {
                openValue: createField({
                  value: alertChannel && alertChannel.getIn(['customEmailSubjectPrefix', 'issue', 'openValue'], '')
                }),
                closeValue: createField({
                  value: alertChannel && alertChannel.getIn(['customEmailSubjectPrefix', 'issue', 'closeValue'], '')
                })
              }
            }),
            incident: createMapForm({
              items: {
                openValue: createField({
                  value: alertChannel && alertChannel.getIn(['customEmailSubjectPrefix', 'incident', 'openValue'], '')
                }),
                closeValue: createField({
                  value: alertChannel && alertChannel.getIn(['customEmailSubjectPrefix', 'incident', 'closeValue'], '')
                })
              }
            }),
            change: createMapForm({
              items: {
                changeValue: createField({
                  value: alertChannel && alertChannel.getIn(['customEmailSubjectPrefix', 'change', 'changeValue'], '')
                })
              }
            }),
            agentMonitoringIssue: createMapForm({
              items: {
                openValue: createField({
                  value:
                    alertChannel &&
                    alertChannel.getIn(['customEmailSubjectPrefix', 'agentMonitoringIssue', 'openValue'], '')
                }),
                closeValue: createField({
                  value:
                    alertChannel &&
                    alertChannel.getIn(['customEmailSubjectPrefix', 'agentMonitoringIssue', 'closeValue'], '')
                })
              }
            })
          }
        })
      );
  },

  createEntity(
    alertChannel: Map<string, string | List<string> | List<string[]>>,
    form: MapForm<EmailAlertChannelMapForm>
  ) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      emails: form.get('emails').value,
      customEmailSubjectPrefix: prepareCustomEmailPrefixOptionsForSending(form.get('customEmailSubjectPrefix'))
    };
  },

  Form,
  AdvancedFormSettings,
  advancedStateShouldBeExpandedByDefault(form: MapForm<EmailAlertChannelMapForm>) {
    let hasValues = false;
    const customEmailSubjectPrefixField = form.get('customEmailSubjectPrefix');
    const nestedKeys = parameters.filter(val => val.key === 'customEmailSubjectPrefix').pop()?.nestedParamKeys;

    if (!nestedKeys) return hasValues;

    nestedKeys.forEach(eventType => {
      const currentSubjectEvent = eventType.key;
      const currentSubjectMap = customEmailSubjectPrefixField.get(currentSubjectEvent) as
        | MapForm<CloseOpenMapForm>
        | MapForm<ChangeValueField>;

      if (currentSubjectMap.containsKey('closeValue')) {
        if (
          (currentSubjectMap as MapForm<CloseOpenMapForm>).get('openValue').value ||
          (currentSubjectMap as MapForm<CloseOpenMapForm>).get('closeValue').value
        )
          hasValues = true;
      } else if (currentSubjectMap.containsKey('changeValue')) {
        if ((currentSubjectMap as MapForm<ChangeValueField>).get('changeValue').value) hasValues = true;
      }
    });

    return hasValues;
  }
};

function emails(emails: List<string>): EmailValidationResult[] {
  if (emails.size === 0) {
    return [
      {
        type: 'no_mail',
        severity: 'error',
        message: t('in-settings:tabs.pleaseDefineAtLeastOneEmail')
      }
    ];
  }
  const errors = [] as EmailValidationResult[];
  for (let i = 0, length = emails.size; i < length; i++) {
    const email = emails.get(i);
    const error = notBlankValidator(email);
    if (error && error.length > 0) {
      errors.push({
        mailIndex: i,
        severity: 'error',
        message: error[0].message
      });
    }
  }
  return errors;
}

function Form({ form, onChange }: ComponentProps): JSX.Element {
  return (
    <fieldset style={{ paddingBottom: '0.4rem' }}>
      <Stack align="start">
        {form.get('name').map(field => (
          <div className={locals.inputContainer}>
            <Stack gap="xxsmall" direction="vertical">
              <Label htmlFor="name" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.name')}
              </Label>
              <Input
                id="name"
                className={locals.input}
                type="text"
                placeholder={t('in-settings:tabs.emailAlertChannel')}
                value={field.value}
                onChange={e => onChange('name', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} />
            </Stack>
          </div>
        ))}
        <div className={locals.inputContainer}>
          <Stack gap="xxsmall" direction="vertical">
            {form.get('emails').map(field => (
              <>
                <Label htmlFor="email" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.emails')}
                </Label>
                {field.touched
                  ? field.messages.map((message: EmailValidationResult, i: number) => {
                      if (message.type !== 'no_mail') {
                        return null;
                      }
                      return <ValidationBlock key={i}>{message.message}</ValidationBlock>;
                    })
                  : null}
              </>
            ))}
            {form.get('emails').map(field => {
              const emails = field.value;
              return emails.map((email, idx) => (
                <div key={idx} className={locals.input}>
                  <Stack direction="horizontal">
                    <Input
                      className={locals.input}
                      id={`email_${email}`}
                      type="email"
                      placeholder="ops@company.org"
                      value={email}
                      onChange={e => onChangeEmail(e, form, onChange, idx)}
                    />
                    {(idx as number) > 0 && (
                      <IconButton
                        type="lib_actions_delete"
                        size="compact"
                        kind="danger"
                        onClick={() => removeEmail(form, onChange, idx)}
                      />
                    )}
                  </Stack>
                  {field.touched
                    ? field.messages
                        .filter((msg: EmailValidationResult) => msg.mailIndex === idx)
                        .map((message, i) => <ValidationBlock key={i}>{message.message}</ValidationBlock>)
                    : null}
                </div>
              ));
            })}
          </Stack>
        </div>
        <Button kind="action" icon="lib_openclose_add" onClick={() => addEmail(form, onChange)}>
          {t('in-settings:tabs.addEmail')}
        </Button>
      </Stack>
    </fieldset>
  );
}

interface AdvancedFormProps {
  form: MapForm<EmailAlertChannelMapForm>;
  setForm: SetFormFunction;
}

function AdvancedFormSettings({ form, setForm }: AdvancedFormProps): JSX.Element {
  const customEmailSubjectPrefixField = form.get('customEmailSubjectPrefix');
  // Used to provide information to combo box dropdown and for marrying the values of our dropdown to the form field
  const fieldMetadata: FieldMetadata[] = [
    {
      value: 'incident',
      label: t('in-settings:tabs.incident'),
      isOpenClose: true,
      field: customEmailSubjectPrefixField.get('incident')
    },
    {
      value: 'issue',
      label: t('in-settings:tabs.issue'),
      isOpenClose: true,
      field: customEmailSubjectPrefixField.get('issue')
    },
    {
      value: 'change',
      label: t('in-settings:tabs.change'),
      isOpenClose: false,
      field: customEmailSubjectPrefixField.get('change')
    },
    {
      value: 'agentMonitoringIssue',
      label: t('in-settings:tabs.monitoringIssues'),
      isOpenClose: true,
      field: customEmailSubjectPrefixField.get('agentMonitoringIssue')
    }
  ];
  return (
    <fieldset>
      <Stack gap="large">
        <Typography variant="body-regular">{t('in-settings:tabs.advancedSettingsMessage')}</Typography>
        <EmailCustomPrefixParent fieldMetadata={fieldMetadata} form={form} setForm={setForm} />
        <Stack gap="xxsmall">
          <Typography variant="heading-100">{t('in-settings:tabs.preview')}</Typography>
          <EmailCustomPrefixPreviewSection fieldMetadata={fieldMetadata} />
        </Stack>
      </Stack>
    </fieldset>
  );
}

interface EmailCustomPrefixParentProps {
  fieldMetadata: FieldMetadata[];
  form: MapForm<EmailAlertChannelMapForm>;
  setForm: SetFormFunction;
}

interface DropdownItems {
  value: string;
  label: string;
  isDisabled?: boolean;
}

interface FieldMetadata extends DropdownItems {
  isOpenClose: boolean;
  field: MapForm<CloseOpenMapForm> | MapForm<ChangeValueField> | undefined;
}

function EmailCustomPrefixParent({ fieldMetadata, form, setForm }: EmailCustomPrefixParentProps) {
  const [dropdownStack, setDropdownStack] = useState<string[]>(DefaultArrayWithPrefixValuesThatExist(fieldMetadata));
  return (
    <Stack>
      <Stack direction="horizontal" distribution="spaceBetween">
        <Typography variant="heading-100">{t('in-settings:tabs.customSubjects')}</Typography>
        <Button
          kind="action"
          icon="lib_openclose_add"
          disabled={
            dropdownStack.includes(defaultNewValue) || dropdownStack.length >= Object.keys(fieldMetadata).length
          }
          onClick={() => setDropdownStack([defaultNewValue, ...dropdownStack])}
        >
          {t('in-settings:tabs.addCustomSubject')}
        </Button>
      </Stack>
      {/* Render dropdowns based on which ones are active and assign them the necessary field value */}
      {dropdownStack.map((selectedEventTypes, idx) => (
        <CustomEmailPrefixDropdown
          form={form}
          setForm={setForm}
          fieldMetadata={fieldMetadata}
          currentField={selectedEventTypes === defaultNewValue ? '' : selectedEventTypes}
          currentIdx={idx}
          dropdownStack={dropdownStack}
          setDropdownStack={setDropdownStack}
        />
      ))}
      {dropdownStack.filter(val => val !== defaultNewValue).length > 0 && (
        <Typography
          variant="body-regular"
          component={() => (
            <div className={locals.descriptionText}>{t('in-settings:tabs.customSubjectNotProvided')}</div>
          )}
        >
          {t('in-settings:tabs.customSubjectNotProvided')}
        </Typography>
      )}
    </Stack>
  );
}

function DefaultArrayWithPrefixValuesThatExist(fieldMetadata: FieldMetadata[]): string[] {
  return fieldMetadata
    .map(prefixFields => {
      if (prefixFields.isOpenClose) {
        if (
          (prefixFields.field?.get('openValue') as Field<string>).value ||
          (prefixFields.field?.get('closeValue') as Field<string>).value
        )
          return prefixFields.value;
      } else {
        if ((prefixFields.field?.get('changeValue') as Field<string>).value) return prefixFields.value;
      }

      return null;
    })
    .filter(val => val !== null) as string[];
}

interface CustomEmailPrefixDropdownProps {
  form: MapForm<EmailAlertChannelMapForm>;
  setForm: SetFormFunction;
  dropdownStack: string[];
  setDropdownStack: React.Dispatch<React.SetStateAction<string[]>>;
  fieldMetadata: FieldMetadata[];
  currentField: string;
  currentIdx: number;
}

function CustomEmailPrefixDropdown({
  form,
  setForm,
  dropdownStack,
  setDropdownStack,
  fieldMetadata,
  currentField,
  currentIdx
}: CustomEmailPrefixDropdownProps) {
  // Holds info about current field for given dropdown
  const currentMapField = fieldMetadata.find(eventfield => eventfield.value === currentField);
  return (
    <Stack>
      <Stack direction="horizontal">
        <CarbonDropdown
          items={fieldMetadata.filter(field => !dropdownStack.includes(field.value))}
          defaultValue={''}
          className={locals.emailsEventTypeDropdown}
          onChange={newVal => {
            const { selectedItem } = newVal;

            if (selectedItem) {
              setDropdownStack(dropdownStack.map((item, idx) => (idx === currentIdx ? selectedItem.value : item)));
            }
          }}
          id={`email-type-dropdown-${currentIdx}`}
          label=""
          key={currentIdx}
          selectedItem={
            currentField
              ? fieldMetadata[fieldMetadata.findIndex(val => val.value === currentField)]
              : { label: t('in-settings:tabs.selectEventType'), value: '' }
          }
          renderSelectedItem={item => (item ? item.label : t('in-settings:tabs.selectEventType'))}
          titleText={t('in-settings:tabs.selectEventType')}
        />
        <IconButton
          type="lib_actions_delete"
          kind="danger"
          size="compact"
          onClick={() => {
            setDropdownStack(dropdownStack.filter(val => val !== currentField));
            if (currentMapField && currentMapField.isOpenClose) {
              //@ts-expect-error
              let newForm = form.updateIn(['customEmailSubjectPrefix', currentField, 'openValue'], fieldUpdate =>
                (fieldUpdate as Field<string>).setValue('')
              );
              //@ts-expect-error
              newForm = newForm.updateIn(['customEmailSubjectPrefix', currentField, 'closeValue'], fieldUpdate =>
                (fieldUpdate as Field<string>).setValue('')
              );

              setForm(newForm);
            } else if (currentMapField && !currentMapField.isOpenClose) {
              setForm(
                //@ts-expect-error
                form.updateIn(['customEmailSubjectPrefix', currentField, 'changeValue'], fieldUpdate =>
                  (fieldUpdate as Field<string>).setValue('')
                )
              );
            }
          }}
        />
      </Stack>
      {currentField && (
        <>
          {fieldMetadata.find(eventField => eventField.value === currentField)?.isOpenClose ? (
            <Stack direction="horizontal">
              <Stack gap="xxsmall">
                <Label htmlFor="openVal">
                  {t('in-settings:tabs.openSubject', {
                    event_type: currentMapField?.label.toLowerCase()
                  })}
                </Label>
                <TextArea
                  id="openVal"
                  onChange={e =>
                    setForm(
                      //@ts-expect-error
                      form.updateIn(['customEmailSubjectPrefix', currentField, 'openValue'], fieldUpdate =>
                        (fieldUpdate as Field<string>).setValue((e.target as HTMLTextAreaElement).value)
                      )
                    )
                  }
                  value={
                    //@ts-expect-error
                    (form.getIn(['customEmailSubjectPrefix', currentField, 'openValue']) as Field<string>).value
                  }
                  rows={5}
                  className={locals.textAreaInput}
                />
              </Stack>
              <Stack gap="xxsmall">
                <Label htmlFor="closeVal">
                  {t('in-settings:tabs.closeSubject', {
                    event_type: currentMapField?.label.toLowerCase()
                  })}
                </Label>
                <TextArea
                  id="closeVal"
                  onChange={e =>
                    setForm(
                      //@ts-expect-error
                      form.updateIn(['customEmailSubjectPrefix', currentField, 'closeValue'], fieldUpdate =>
                        (fieldUpdate as Field<string>).setValue((e.target as HTMLTextAreaElement).value)
                      )
                    )
                  }
                  value={
                    //@ts-expect-error
                    (form.getIn(['customEmailSubjectPrefix', currentField, 'closeValue']) as Field<string>).value
                  }
                  rows={5}
                  className={locals.textAreaInput}
                />
              </Stack>
            </Stack>
          ) : (
            <Stack gap="xxsmall">
              <Label htmlFor="changeValue">{t('in-settings:tabs.changeSubject')}</Label>
              <TextArea
                id="changeValue"
                onChange={e =>
                  setForm(
                    //@ts-expect-error
                    form.updateIn(['customEmailSubjectPrefix', currentField, 'changeValue'], fieldUpdate =>
                      (fieldUpdate as Field<string>).setValue((e.target as HTMLTextAreaElement).value)
                    )
                  )
                }
                value={
                  //@ts-expect-error
                  (form.getIn(['customEmailSubjectPrefix', currentField, 'changeValue']) as Field<string>).value
                }
                className={locals.textAreaInput}
                rows={5}
              />
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}

interface EmailCustomPrefixPreviewProps {
  fieldMetadata: FieldMetadata[];
}

function EmailCustomPrefixPreviewSection({ fieldMetadata }: EmailCustomPrefixPreviewProps) {
  return (
    <Stack>
      <CarbonTabs>
        <CarbonTabList aria-label="list of types of email headers">
          {fieldMetadata.map((field, idx) => (
            <CarbonTab key={idx}>{field.label}</CarbonTab>
          ))}
        </CarbonTabList>
        <CarbonTabPanels>
          {fieldMetadata.map((field, idx) => (
            <CarbonTabPanel key={idx}>
              {field.isOpenClose ? (
                <Stack>
                  <Typography variant="body-regular">
                    {t('in-settings:tabs.openEventType', {
                      event_type: field.label
                    })}
                  </Typography>
                  <div className={locals.previewBox}>
                    <Stack gap="large">
                      <Stack gap="small">
                        <Typography variant="body-regular">{`[Instana] - ${
                          (field.field?.get('openValue') as Field<string>).value
                        } ${field.label} - Test Zone - HOST "Test Entity" - CPU Load is Too High`}</Typography>
                        <div className={locals.previewOpenStatus} />
                      </Stack>
                      <Stack align="center">
                        <Lettering className={locals.lettering} />
                      </Stack>
                    </Stack>
                  </div>
                  <Typography variant="body-regular">
                    {t('in-settings:tabs.closeEventType', {
                      event_type: field.label
                    })}
                  </Typography>
                  <div className={locals.previewBox}>
                    <Stack gap="large">
                      <Stack gap="small">
                        <Typography variant="body-regular">{`[Instana] - ${
                          (field.field?.get('closeValue') as Field<string>).value
                        } ${field.label} Closed - Test Zone - HOST "Test Entity" - CPU Load is Too High`}</Typography>
                        <div className={locals.previewClosedStatus} />
                      </Stack>
                      <Stack align="center">
                        <Lettering className={locals.lettering} />
                      </Stack>
                    </Stack>
                  </div>
                </Stack>
              ) : (
                <Stack>
                  <Typography variant="body-regular">{t('in-settings:tabs.changeEvent')}</Typography>
                  <div className={locals.previewBox}>
                    <Stack gap="large">
                      <Stack gap="small">
                        <Typography variant="body-regular">{`[Instana] - ${
                          (field.field?.get('changeValue') as Field<string>).value
                        } ${field.label.toUpperCase()} Online - JVM "sever" on "Test Entity"`}</Typography>
                        <div className={locals.previewChangeStatus} />
                      </Stack>
                      <Stack align="center">
                        <Lettering className={locals.lettering} />
                      </Stack>
                    </Stack>
                  </div>
                </Stack>
              )}
            </CarbonTabPanel>
          ))}
        </CarbonTabPanels>
      </CarbonTabs>
    </Stack>
  );
}

function onChangeEmail(
  e: React.ChangeEvent<HTMLInputElement>,
  form: MapForm<EmailAlertChannelMapForm>,
  onChange: OnEntityChange<EmailAlertChannelMapForm>,
  index: number | undefined
) {
  const emails = form.get('emails').value.setIn([index], e.target.value);
  onChange('emails', emails);
}

function addEmail(form: MapForm<EmailAlertChannelMapForm>, onChange: OnEntityChange<EmailAlertChannelMapForm>) {
  let emails = form.get('emails').value;
  emails = emails.push('');
  onChange('emails', emails);
}

function removeEmail(
  form: MapForm<EmailAlertChannelMapForm>,
  onChange: OnEntityChange<EmailAlertChannelMapForm>,
  index: number | undefined
) {
  const emails = form.get('emails').value.deleteIn([index]);
  onChange('emails', emails);
}

function prepareCustomEmailPrefixOptionsForSending(
  customEmailSubjectPrefixField: MapForm<CustomEmailSubjectPrefixMapForm>
): CustomEmailSubjectPrefix {
  const incidentSubject = customEmailSubjectPrefixField.get('incident');
  const issueSubject = customEmailSubjectPrefixField.get('issue');
  const monitoringIssueSubject = customEmailSubjectPrefixField.get('agentMonitoringIssue');
  const changeEventSubject = customEmailSubjectPrefixField.get('change');

  return {
    incident: {
      openValue: incidentSubject.get('openValue').value,
      closeValue: incidentSubject.get('closeValue').value
    },
    issue: {
      openValue: issueSubject.get('openValue').value,
      closeValue: issueSubject.get('closeValue').value
    },
    agentMonitoringIssue: {
      openValue: monitoringIssueSubject.get('openValue').value,
      closeValue: monitoringIssueSubject.get('closeValue').value
    },
    change: {
      changeValue: changeEventSubject.get('changeValue').value
    }
  };
}
