import React from 'react';

import MatchSpecificationSelector
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/MatchSpecificationSelector';
import RuleTester from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/RuleTester';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { evaluateClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Helpify from 'in-components/form/Helpify';
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
  commentPath = this.props.prePath.concat(['comment']);

  render() {
    const {
      onChangeIn,
      ruleForm,
      helpTexts,
      matchSpecificationOptionsTree,
      matchSpecificationOptions
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
                this.onChangeMatchOption(e, matchSpecificationOptions, this.matchSpecificationPath)}
            />
          }

          {ruleForm.get('matchSpecification').reduce((acc, cur, key) => acc.concat(key), []).sort().map(key => {
            const field = ruleForm.get('matchSpecification').get(key);

            return (
              <FormGroup key={key}>
                <Label htmlFor={`${id}-${key}`} hasError={!field.valid}>
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
                    hasError={!field.valid}
                  />
                  {field.valid
                    ? null
                    : <ValidationBlock hasError>
                        {field.messages.map(e => e.message)}
                      </ValidationBlock>}
                </Helpify>
              </FormGroup>
            );
          })}

          {ruleForm.get('label').map(labelField => (
            <FormGroup>
              <Label htmlFor={`${id}-service-name`}>Service Name</Label>
              <Helpify helpText={helpTexts.serviceNameHelp}>
                <Input
                  type="text"
                  id={`${id}-service-name`}
                  className={`${block}__helpfified_input`}
                  placeholder="Shop"
                  value={labelField.value}
                  onChange={e => onChangeIn(this.labelPath, e.target.value)}
                />
              </Helpify>
            </FormGroup>
          ))}

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
            {!this.state.isTesting
              ? <Button kind="info" size="sm" onClick={this.toggleTesting}>
                  Test Rule
                </Button>
              : null}
            {' '}
          </div>

          {this.state.isTesting
            ? <RuleTester
                toggleRuleTesting={this.toggleTesting}
                ruleForm={ruleForm}
                matchSpecificationOptions={matchSpecificationOptions}
              />
            : null}
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
