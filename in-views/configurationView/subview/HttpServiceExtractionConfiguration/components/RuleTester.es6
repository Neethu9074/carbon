import React from 'react';

import ExtractedServiceNamePresenter
  from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/ExtractedServiceNamePresenter';
import MatchPresenter
  from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/MatchPresenter';
import options from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/options';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {Row, Col} from 'in-components/Grid';
import Button from 'in-components/Button';

import './RuleTester.less';

const block = 'in-config-http-ex-rule-tester';

export default React.createClass({
  displayName: 'RuleTester',

  propTypes: {
    toggleRuleTesting: React.PropTypes.any,
    ruleForm: React.PropTypes.any.isRequired
  },

  getInitialState() {
    return {};
  },

  render() {
    const ruleForm = this.props.ruleForm;
    if (!ruleForm.valid) {
      return (
        <div className={block}>
          {this.getHeader()}

          <p>
            At least one match must be added and all regular expressions must compile in order for rules to be tested.
          </p>
        </div>
      );
    }

    const id = ruleForm.getItem('id').value;
    const matchSpecificationForm = ruleForm.getItem('matchSpecification');
    const matchKeys = matchSpecificationForm.keys().sort();
    const matches = {};
    matchKeys.forEach(key => {
      // require a full match in order to have the same matching behavior on client and server side
      const regex = new RegExp(`^${matchSpecificationForm.getItem(key).value}$`);
      matches[key] = (this.state[key] || '').match(regex);
    });

    return (
      <div className={block}>
        {this.getHeader()}

        <Row>
          {matchKeys.map(key =>
            <Col cols={6}
                 key={key}>
              <FormGroup>
                <Label htmlFor={`${id}-test-${key}`}>{options[key].titleName}</Label>
                <Input type='text'
                       id={`${id}-test-${key}`}
                       placeholder={options[key].testPlaceholder}
                       value={this.state[key] || ''}
                       onChange={e => this.setState({[key]: e.target.value})} />
              </FormGroup>

              <MatchPresenter match={matches[key]}
                              prefix={`${key}-`} />
            </Col>
          )}
        </Row>

        <ExtractedServiceNamePresenter ruleForm={ruleForm}
                                       matches={matches} />
      </div>
    );
  },

  getHeader() {
    return (
      <h3>
        Rule Tester

        <Button kind='info'
                size='sm'
                className='pull-right'
                onClick={this.props.toggleRuleTesting}>
          Hide Rule Tester
        </Button>
      </h3>
    );
  }
});
