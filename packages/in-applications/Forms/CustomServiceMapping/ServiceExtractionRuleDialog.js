/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, notBlankValidator } from 'formalistic';
import React from 'react';

import EditConfigDialog from 'in-applications/Forms/components/EditConfigDialog';
import { customServiceMappingTagKeys, getTagType } from 'in-applications/tags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';

import locals from './ServiceExtractionRuleDialog.mless';

export default function ServiceExtractionRuleDialog(props) {
  return <EditConfigDialog title="Custom Service Rule" content={<BasicDialog {...props} />} />;
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
            <DescriptionText>
              Define a custom rule by selecting a series of tags below. If all tags are present on a call, it will be
              mapped to that service.
            </DescriptionText>
          </div>
          {serviceConfiguration.get('name').map(field => (
            <FormGroup>
              <Label htmlFor={'name'}>Name Rule</Label>
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
                        AND
                      </Pill>
                    </div>
                  )}
                </div>
                <div className={locals.matchSpecification}>
                  {matchSpecification.get('key').map(field => (
                    <FormGroup className={locals.matchSpecificationGroupKey}>
                      <Label htmlFor={`match-${matchSpecificationIndex}-key`} hasError={!field.valid && field.touched}>
                        Tag
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
                            Key
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
                    <Tooltip content="Remove this match condition">
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
                        aria-label="Remove this match condition"
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
              Add Tag
            </Button>
          </div>
        </div>

        <div className={locals.preview}>
          <div className={locals.label}>Preview</div>
          <div className={locals.render}>{getPreview(serviceConfiguration)}</div>
        </div>
        <div className={locals.footer}>
          <Button kind="create" type="submit" disabled={!form.get(serviceConfigIndex).hierarchyValid}>
            OK
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
              Delete Rule
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
  return [{ value: '', label: 'Please select' }]
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
