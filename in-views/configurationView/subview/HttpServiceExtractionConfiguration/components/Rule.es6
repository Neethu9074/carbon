import React from 'react';

import {
  matchesHelp,
  serviceNameHelp,
  commentHelp
} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/helpTexts';
import {
  setValue,
  addMatchSpecification,
  removeMatchSpecification,
  moveRuleUp,
  moveRuleDown,
  removeRule
} from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/stores/ruleForms';
import RuleTester from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/RuleTester';
import options from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/options';
import ValidationBlock from 'in-components/form/ValidationBlock';
import {evaluateClassNames} from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import HelpBlock from 'in-components/form/HelpBlock';
import TextArea from 'in-components/form/TextArea';
import Toggle from 'in-components/form/Toggle';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import './Rule.less';

const block = 'in-config-http-ex-rule';

export default React.createClass({
  displayName: 'HttpRule',

  propTypes: {
    ruleForm: React.PropTypes.any.isRequired,
    path: React.PropTypes.any
  },

  getInitialState() {
    return {
      isExpanded: false,
      isTesting: false
    };
  },

  componentWillMount() {
    if (!this.props.ruleForm.valid) {
      this.setState({isExpanded: true});
    }
  },

  render() {
    const ruleForm = this.props.ruleForm;
    const id = ruleForm.getItem('id').value;
    const path = this.props.path;

    return (
      <div>
        <div className={`${block}__actions-wrapper`}>
          <div className={evaluateClassNames({
                 [`${block}__actions`]: true,
                 [`${block}__actions--has-error`]: !ruleForm.valid
               })}>
            <SvgIcon type='chevron_up'
                     width={12}
                     className={`${block}__up`}
                     onClick={() => moveRuleDown(path)}/>
            <SvgIcon type='chevron_down'
                     width={12}
                     className={`${block}__down`}
                     onClick={() => moveRuleUp(path)}/>
            <SvgIcon type={this.state.isExpanded ? 'timeline_close' : 'timeline_open'}
                     width={12}
                     className={`${block}__toggle`}
                     onClick={this.toggleExpanded}/>
          </div>
        </div>

        <div className={evaluateClassNames({
               [block]: true,
               [`${block}--has-error`]: !ruleForm.valid
             })}>
          <div className={`${block}__header`}>
            {ruleForm.getItem('name').map(nameField =>
              <FormGroup className={evaluateClassNames({
                           [`${block}__name-group`]: true,
                           [`${block}__without-bottom-margin`]: !this.state.isExpanded
                         })}>
                <Label htmlFor={`${id}-rule-name`}>Rule Name</Label>
                <Input type='text'
                       id={`${id}-rule-name`}
                       value={nameField.value}
                       onChange={e => setValue([...path, 'name'], e.target.value)}/>
              </FormGroup>
            )}

            {ruleForm.getItem('enabled').map(enabledField =>
              <FormGroup className={evaluateClassNames({
                           [`${block}__without-bottom-margin`]: !this.state.isExpanded
                         })}>
                <Label htmlFor={`${id}-enabled`}>Enabled</Label>
                <Toggle id={`${id}-enabled`}
                        checked={enabledField.value}
                        onChange={e => setValue([...path, 'enabled'], e.target.checked)}/>
              </FormGroup>
            )}
          </div>

          {this.state.isExpanded ? (
            <div>
              {ruleForm.getItem('matchSpecification').mapItem(matchSpecificationForm =>
                <FormGroup>
                  <Label htmlFor={`${id}-select-match-rule`}>Match</Label>
                  <Select id={`${id}-select-match-rule`}
                          onChange={this.onChangeMatchOption}>
                    <option value=''>Please Select</option>

                    <optgroup label='Headers'>
                      <option value='host'
                              disabled={matchSpecificationForm.containsKey('host')}>
                        Host
                      </option>
                    </optgroup>

                    <option value='path'
                            disabled={matchSpecificationForm.containsKey('path')}>
                      Request Path
                    </option>
                  </Select>
                  {matchSpecificationForm.error ?
                    <ValidationBlock hasError={true}>
                      {matchSpecificationForm.error}
                    </ValidationBlock>
                  : null}
                  <HelpBlock>
                    {matchesHelp}
                  </HelpBlock>
                </FormGroup>
              )}

              {ruleForm.getItem('matchSpecification').keys().sort().map(key => {
                const field = ruleForm.getItem(['matchSpecification', key]);

                return (
                  <FormGroup key={key}>
                    <Label htmlFor={`${id}-${key}`}
                           hasError={!field.valid}>
                      Match: {options[key].titleName}

                      <a href='#'
                         onClick={e => this.removeMatch(e, key)}
                         className={`${block}__remove-match`}>
                        Remove
                      </a>
                    </Label>
                    <Input type='text'
                           id={`${id}-${key}`}
                           placeholder={options[key].placeholder}
                           value={field.value}
                           onChange={e => setValue([...path, 'matchSpecification', key], e.target.value)}
                           hasError={!field.valid}/>
                    {field.error ?
                      <ValidationBlock hasError={true}>
                        {field.error}
                      </ValidationBlock>
                    : null}
                    <HelpBlock>
                      {options[key].help}
                    </HelpBlock>
                  </FormGroup>
                );
              })}

              {ruleForm.getItem('label').map(labelField =>
                <FormGroup>
                  <Label htmlFor={`${id}-service-name`}>Service Name</Label>
                  <Input type='text'
                         id={`${id}-service-name`}
                         placeholder='Shop'
                         value={labelField.value}
                         onChange={e => setValue([...path, 'label'], e.target.value)}/>
                  <HelpBlock>
                    {serviceNameHelp}
                  </HelpBlock>
                </FormGroup>
              )}

              {ruleForm.getItem('comment').map(commentField =>
                <FormGroup>
                  <Label htmlFor={`${id}-comment`}>Comment</Label>
                  <TextArea rows='3'
                            id={`${id}-comment`}
                            value={commentField.value}
                            onChange={e => setValue([...path, 'comment'], e.target.value)}/>
                  <HelpBlock>
                    {commentHelp}
                  </HelpBlock>
                </FormGroup>
              )}

              <div className={`${block}__buttons`}>
                {!this.state.isTesting ?
                  <Button kind='info'
                          size='sm'
                          onClick={this.toggleTesting}>
                    Test Rule
                  </Button>
                : null}
                {' '}
                <Button kind='danger'
                        size='sm'
                        onClick={() => removeRule(path)}>
                  Remove Rule
                </Button>
              </div>

              {this.state.isTesting ?
                <RuleTester toggleRuleTesting={this.toggleTesting}
                            ruleForm={ruleForm} />
                            : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  },

  toggleExpanded() {
    this.setState({
      isExpanded: !this.state.isExpanded,
      isTesting: false
    });
  },

  toggleTesting() {
    this.setState({
      isTesting: !this.state.isTesting
    });
  },

  onChangeMatchOption(e) {
    const newRuleName = e.target.value;
    if (!newRuleName) {
      return;
    }

    // reset selection to "Please Select"
    e.target.value = '';

    addMatchSpecification(this.props.path, newRuleName, options[newRuleName].initialValue || '');
  },

  removeMatch(e, key) {
    e.preventDefault();
    removeMatchSpecification(this.props.path, key);
  }
});
