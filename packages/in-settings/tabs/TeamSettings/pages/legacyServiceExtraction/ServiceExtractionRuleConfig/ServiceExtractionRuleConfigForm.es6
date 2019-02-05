import React from 'react';

import MatchSpecificationSelector from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtractionRuleConfig/components/MatchSpecificationSelector';
import RuleTester from 'in-settings/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtractionRuleConfig/components/RuleTester';
import FormGroup from 'in-settings/components/FormGroup';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { evaluateClassNames } from 'in-services/util/classnames';
import TextArea from 'in-components/form/TextArea';
import Helpify from 'in-components/form/Helpify';
import Toggle from 'in-components/form/Toggle';
import { Row, Col } from 'in-components/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Button from 'in-components/Button';

import './ServiceExtractionRuleConfigForm.less';

const block = 'in-config-service-extraction-rule-form';

export default class extends React.Component {
  static displayName = 'Rule';

  state = {
    isTesting: false
  };

  namePath = this.props.prePath.concat(['name']);
  matchSpecificationPath = this.props.prePath.concat(['matchSpecification']);
  labelPath = this.props.prePath.concat(['label']);
  ignoreServicePath = this.props.prePath.concat(['ignoreService']);
  commentPath = this.props.prePath.concat(['comment']);

  render() {
    const {
      onChangeIn,
      ruleForm,
      helpTexts,
      matchSpecificationOptionsTree,
      matchSpecificationOptions,
      resultingEntityNameTitle,
      resultingEntityTooltipText
    } = this.props;
    const id = ruleForm.get('id').value;
    return (
      <div
        className={evaluateClassNames({
          [block]: true,
          [`${block}--has-error`]: !ruleForm.hierarchyValid
        })}
      >
        <div className={`${block}__header`}>
          {ruleForm.get('name').map(nameField => (
            <FormGroup className={`${block}__name-group`}>
              <Label htmlFor={`${id}-rule-name`}>Rule Name</Label>
              <Input
                type="text"
                id={`${id}-rule-name`}
                value={nameField.value}
                onChange={e => onChangeIn(this.namePath, e.target.value)}
              />
              <TouchedMessages field={nameField} />
            </FormGroup>
          ))}
        </div>
        <div>
          {
            <MatchSpecificationSelector
              id={id}
              matchSpecificationForm={ruleForm.get('matchSpecification')}
              matchSpecificationOptionsTree={matchSpecificationOptionsTree}
              helpTexts={helpTexts}
              onChangeMatchOption={e =>
                this.onChangeMatchOption(e, matchSpecificationOptions, this.matchSpecificationPath)
              }
            />
          }

          {ruleForm
            .get('matchSpecification')
            .reduce((acc, cur, key) => acc.concat(key), [])
            .sort()
            .map(key => {
              const field = ruleForm.get('matchSpecification').get(key);
              const path = this.matchSpecificationPath.concat([key]);
              const fieldConfig = matchSpecificationOptions[key];

              if (fieldConfig.type === 'kv') {
                return (
                  <div key={key} className={`${block}__double-input`}>
                    <em className={`${block}__double-input-title`}>
                      Match Expression: {matchSpecificationOptions[key].titleName}
                      <a
                        href="#"
                        onClick={e => this.removeMatch(e, key, this.matchSpecificationPath)}
                        className={`${block}__remove-match`}
                      >
                        Remove
                      </a>
                    </em>

                    <Row key={key}>
                      <Col cols={6}>
                        {field
                          .get(0)
                          .get('key')
                          .map(keyField => (
                            <FormGroup>
                              <Label htmlFor={`${id}-${key}-key`} hasError={!keyField.valid && keyField.touched}>
                                Key
                              </Label>
                              <Helpify helpText={fieldConfig.typeArgs.key.help}>
                                <Input
                                  type="text"
                                  id={`${id}-${key}-key`}
                                  className={`${block}__helpfified_input`}
                                  placeholder={fieldConfig.typeArgs.key.placeholder}
                                  value={keyField.value}
                                  onChange={e => onChangeIn(path.concat([0, 'key']), e.target.value)}
                                  hasError={!keyField.valid && keyField.touched}
                                />
                                <TouchedMessages field={keyField} />
                              </Helpify>
                            </FormGroup>
                          ))}
                      </Col>
                      <Col cols={6}>
                        {field
                          .get(0)
                          .get('value')
                          .map(valueField => (
                            <FormGroup>
                              <Label htmlFor={`${id}-${key}-value`} hasError={!valueField.valid && valueField.touched}>
                                Value
                              </Label>
                              <Helpify helpText={fieldConfig.typeArgs.value.help}>
                                <Input
                                  type="text"
                                  id={`${id}-${key}-value`}
                                  className={`${block}__helpfified_input`}
                                  placeholder={fieldConfig.typeArgs.value.placeholder}
                                  value={valueField.value}
                                  onChange={e => onChangeIn(path.concat([0, 'value']), e.target.value)}
                                  hasError={!valueField.valid && valueField.touched}
                                />
                                <TouchedMessages field={valueField} />
                              </Helpify>
                            </FormGroup>
                          ))}
                      </Col>
                    </Row>
                  </div>
                );
              }

              return (
                <FormGroup key={key}>
                  <Label htmlFor={`${id}-${key}`} hasError={!field.valid && field.touched}>
                    Match Expression: {matchSpecificationOptions[key].titleName}
                    <a
                      href="#"
                      onClick={e => this.removeMatch(e, key, this.matchSpecificationPath)}
                      className={`${block}__remove-match`}
                    >
                      Remove
                    </a>
                  </Label>
                  <Helpify helpText={matchSpecificationOptions[key].help}>
                    <Input
                      type="text"
                      id={`${id}-${key}`}
                      className={`${block}__helpfified_input`}
                      placeholder={matchSpecificationOptions[key].placeholder}
                      value={field.value}
                      onChange={e => onChangeIn(this.matchSpecificationPath.concat([key]), e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </Helpify>
                </FormGroup>
              );
            })}

          {ruleForm.get('ignoreService').map(ignoreField => (
            <FormGroup>
              <Label htmlFor={`${id}-ingore-service-label`}>Mark as ignored service</Label>
              <Helpify helpText="When enabled, no services will be extracted. Also any traces matching this service definition will be discarded.">
                <Toggle
                  className={`${block}__toggle`}
                  checked={ignoreField.value}
                  onChange={e => onChangeIn(this.ignoreServicePath, e.target.checked)}
                />
              </Helpify>
            </FormGroup>
          ))}

          {ruleForm.get('ignoreService').map(
            ignoreField =>
              ignoreField.value === true
                ? null
                : ruleForm.get('label').map(labelField => (
                    <FormGroup>
                      <Label htmlFor={`${id}-service-name`}>{resultingEntityNameTitle}</Label>
                      <Helpify helpText={resultingEntityTooltipText}>
                        <Input
                          type="text"
                          id={`${id}-service-name`}
                          className={`${block}__helpfified_input`}
                          placeholder="Shop"
                          value={labelField.value}
                          onChange={e => onChangeIn(this.labelPath, e.target.value)}
                        />
                        <TouchedMessages field={labelField} />
                      </Helpify>
                    </FormGroup>
                  ))
          )}

          {ruleForm.get('comment').map(commentField => (
            <FormGroup>
              <Label htmlFor={`${id}-comment`}>Comment</Label>
              <Helpify helpText={helpTexts.commentHelp}>
                <TextArea
                  rows="3"
                  id={`${id}-comment`}
                  className={`${block}__helpfified_input`}
                  value={commentField.value}
                  onChange={e => onChangeIn(this.commentPath, e.target.value)}
                />
              </Helpify>
            </FormGroup>
          ))}

          <div className={`${block}__buttons`}>
            {!this.state.isTesting ? (
              <Button kind="info" size="sm" onClick={this.toggleTesting}>
                Test Rule
              </Button>
            ) : null}{' '}
          </div>

          {this.state.isTesting ? (
            <RuleTester
              toggleRuleTesting={this.toggleTesting}
              ruleForm={ruleForm}
              matchSpecificationOptions={matchSpecificationOptions}
            />
          ) : null}
        </div>
      </div>
    );
  }

  toggleTesting = () => {
    this.setState({
      isTesting: !this.state.isTesting
    });
  };

  onChangeMatchOption = (e, matchSpecificationOptions, path) => {
    const newRuleName = e.target.value;
    if (!newRuleName) {
      return;
    }

    // reset selection to "Please Select"
    e.target.value = '';

    this.props.addMatchSpecification(path, newRuleName, matchSpecificationOptions[newRuleName].initialValue || '');
  };

  removeMatch = (e, key, path) => {
    e.preventDefault();
    this.props.removeMatchSpecification(key, path);
  };
}
