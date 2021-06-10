/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import EditConfigDialog from 'in-applications/Forms/components/EditConfigDialog';
import { customServiceMappingTagKeys, getTagType } from 'in-applications/tags';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './ServiceExtractionRuleDialog.mless';

export default function ServiceExtractionRuleDialog(props) {
  return <EditConfigDialog title={t('in-applications:titleCustomServiceRule')} content={<BasicDialog {...props} />} />;
}

export function getPreview(serviceConfig) {
  return serviceConfig
    .get('matchSpecification')
    .items.filter(matchSpecification => matchSpecification.get('key').value)
    .map(matchSpecification => {
      const key = matchSpecification.get('key').value;
      const secondLevel = matchSpecification.get('secondLevelName');
      return secondLevel && secondLevel.value ? `{${key}.${secondLevel.value}}` : `{${key}}`;
    })
    .join('-');
}

class BasicDialog extends React.Component {
  static displayName = 'BasicDialog';

  constructor(props) {
    super(props);
    this.state = { form: props.form };
  }

  render() {
    const { serviceConfigIndex, onRemove, addMatchSpecification, removeMatchSpecification, updateForm } = this.props;
    const { form } = this.state;
    const serviceConfiguration = form.get(serviceConfigIndex);

    return (
      <form onSubmit={e => this.onSubmit(e, form, serviceConfigIndex)}>
        <div className={locals.queryFormSection}>
          <div className={locals.description}>
            <DescriptionText>{t('in-applications:forms.customService.descriptionCustomServiceRule')}</DescriptionText>
          </div>
          {serviceConfiguration.get('name').map(field => (
            <FormGroup>
              <Label htmlFor={'name'}>{t('in-applications:labelNameRule')}</Label>
              <Input
                type="text"
                id="name"
                value={field.value}
                onChange={e => this.onChangeIn([serviceConfigIndex, 'name'], e.target.value)}
                hasError={!field.valid}
                autoComplete="off"
                autoFocus
              />
            </FormGroup>
          ))}
          {serviceConfiguration.get('matchSpecification').map((matchSpecification, matchSpecificationIndex) => {
            return (
              <div key={matchSpecificationIndex}>
                <div>
                  {matchSpecificationIndex > 0 && (
                    <div>
                      <Pill className={locals.operatorPill} color={theme.lib.colors.N400}>
                        {t('in-applications:forms.and')}
                      </Pill>
                    </div>
                  )}
                </div>
                <div className={locals.matchSpecification}>
                  {matchSpecification.get('key').map(field => (
                    <FormGroup className={locals.matchSpecificationGroupKey}>
                      <Label htmlFor={`match-${matchSpecificationIndex}-key`} hasError={!field.valid && field.touched}>
                        {t('in-applications:labelTag')}
                      </Label>
                      <Select
                        id={`match-${matchSpecificationIndex}-key`}
                        value={field.value}
                        onChange={e => {
                          let updatedForm = this.state.form.updateIn(
                            [serviceConfigIndex, 'matchSpecification', matchSpecificationIndex, 'key'],
                            field => field.setValue(e.target.value).setTouched(true)
                          );

                          if (isKeyValuePairOrJvmArgs(e.target.value)) {
                            updatedForm = updatedForm.updateIn(
                              [serviceConfigIndex, 'matchSpecification', matchSpecificationIndex],
                              field =>
                                field
                                  .put(
                                    'secondLevelName',
                                    createField({
                                      value: '',
                                      validator: notBlankValidator
                                    })
                                  )
                                  .setTouched(true)
                            );
                          } else {
                            updatedForm = updatedForm.updateIn(
                              [serviceConfigIndex, 'matchSpecification', matchSpecificationIndex],
                              field => field.remove('secondLevelName').setTouched(true)
                            );
                          }
                          this.setState({ form: updatedForm });
                        }}
                        autoComplete="off"
                        hasError={!field.valid && field.touched}
                      >
                        {getCustomServiceMappingTagValuesAsOptions()}
                      </Select>
                      <TouchedMessages field={field} />
                    </FormGroup>
                  ))}

                  {matchSpecification.get('secondLevelName') &&
                    matchSpecification.get('secondLevelName').map(field => {
                      const key = matchSpecification.get('key').value;
                      if (!isKeyValuePairOrJvmArgs(key)) {
                        return null;
                      }
                      return (
                        <FormGroup className={locals.matchSpecificationGroupValue}>
                          <Label
                            htmlFor={`match-${matchSpecificationIndex}-secondLevelName`}
                            hasError={!field.valid && field.touched}
                          >
                            {t('in-applications:labelKey')}
                          </Label>
                          <Input
                            type="text"
                            id={`match-${matchSpecificationIndex}-secondLevelName`}
                            value={field.value}
                            onChange={e => {
                              this.onChangeIn(
                                [serviceConfigIndex, 'matchSpecification', matchSpecificationIndex, 'secondLevelName'],
                                e.target.value
                              );
                            }}
                            autoComplete="off"
                            hasError={!field.valid && field.touched}
                          />
                          <TouchedMessages field={field} />
                        </FormGroup>
                      );
                    })}

                  {serviceConfiguration.get('matchSpecification').size > 1 && (
                    <Tooltip content={t('in-applications:forms.customService.tooltipRemoveCondition')}>
                      <SvgIcon
                        className={locals.removeMatchRuleIcon}
                        type="lib_openclose_cancel"
                        onClick={() =>
                          this.setState({
                            form: removeMatchSpecification(
                              matchSpecificationIndex,
                              form,
                              serviceConfigIndex,
                              updateForm
                            )
                          })
                        }
                        tabIndex={0}
                        aria-label={t('in-applications:forms.customService.tooltipRemoveCondition')}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
          <div className={locals.addMatchSpecificationButton}>
            <Button
              kind="action"
              onClick={() =>
                this.setState({
                  form: addMatchSpecification(form, serviceConfigIndex, updateForm)
                })
              }
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-applications:buttonAddTag')}
            </Button>
          </div>
        </div>

        <div className={locals.preview}>
          <div className={locals.label}>{t('in-applications:labelPreview')}</div>
          <div className={locals.render}>{getPreview(serviceConfiguration)}</div>
        </div>
        <div className={locals.footer}>
          <Button kind="create" type="submit" disabled={!form.get(serviceConfigIndex).hierarchyValid}>
            {t('in-applications:buttonOK')}
          </Button>
          {onRemove && (
            <Button
              style={{ marginLeft: 0 }}
              kind="subtle"
              size="compact"
              icon="lib_actions_delete"
              onClick={() => {
                close();
                onRemove();
              }}
            >
              {t('in-applications:buttonDeleteRule')}
            </Button>
          )}
        </div>
      </form>
    );
  }

  onSubmit(e, form, serviceConfigIndex) {
    e.preventDefault();

    if (!form.get(serviceConfigIndex).hierarchyValid) {
      this.setState({ form: this.state.form.setTouched(true, { recurse: true }) });
      return;
    }

    close();

    this.props.onSave(form);
  }

  onChange = (fieldName, value) => {
    this.onChangeIn([fieldName], value);
  };

  onChangeIn = (path, value) => {
    this.setState({
      form: this.state.form.updateIn(path, field => field.setValue(value).setTouched(true))
    });
  };
}

function getCustomServiceMappingTagValuesAsOptions() {
  return [{ value: '', label: t('in-applications:labelPleaseSelect') }]
    .concat(customServiceMappingTagKeys.sort().map(key => ({ label: key, value: key })))
    .map(tag => (
      <option key={tag.label} value={tag.value}>
        {tag.label}
      </option>
    ));
}

function isKeyValuePairOrJvmArgs(key) {
  return getTagType(key) === 'KEY_VALUE_PAIR' || key === 'jvm.args';
}
