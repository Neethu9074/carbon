import rpt from 'prop-types';
import React from 'react';

import ExtractedServiceNamePresenter
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/ExtractedServiceNamePresenter';
import MatchPresenter
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/components/MatchPresenter';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { Row, Col } from 'in-components/Grid';
import Button from 'in-components/Button';

import './RuleTester.less';

const block = 'in-config-generic-ex-rule-tester';

export default class extends React.Component {
  static displayName = 'RuleTester';

  static propTypes = {
    toggleRuleTesting: rpt.any,
    ruleForm: rpt.any.isRequired,
    matchSpecificationOptions: rpt.object.isRequired
  };

  state = {};

  render() {
    const ruleForm = this.props.ruleForm;
    if (!ruleForm.hierarchyValid) {
      return (
        <div className={block}>
          {this.getHeader()}

          <p>
            At least one match must be added and all regular expressions must compile in order for rules to be tested.
          </p>
        </div>
      );
    }

    const id = ruleForm.get('id').value;
    const matchSpecificationForm = ruleForm.get('matchSpecification');
    const matchKeys = matchSpecificationForm.reduce((acc, cur, key) => acc.concat(key), []).sort();
    const matches = {};
    matchKeys.forEach(key => {
      // require a full match in order to have the same matching behavior on client and server side
      const regex = new RegExp(`^${matchSpecificationForm.get(key).value}$`);
      matches[key] = (this.state[key] || '').match(regex);
    });

    return (
      <div className={block}>
        {this.getHeader()}

        <Row>
          {matchKeys.map(key => (
            <Col cols={6} key={key}>
              <FormGroup>
                <Label htmlFor={`${id}-test-${key}`}>{this.props.matchSpecificationOptions[key].titleName}</Label>
                <Input
                  type="text"
                  id={`${id}-test-${key}`}
                  placeholder={this.props.matchSpecificationOptions[key].testPlaceholder}
                  value={this.state[key] || ''}
                  onChange={e => this.setState({ [key]: e.target.value })}
                />
              </FormGroup>

              <MatchPresenter match={matches[key]} prefix={`${key}-`} />
            </Col>
          ))}
        </Row>

        <ExtractedServiceNamePresenter ruleForm={ruleForm} matches={matches} />
      </div>
    );
  }

  getHeader = () => {
    return (
      <h3>
        Rule Tester

        <Button kind="info" size="sm" className="pull-right" onClick={this.props.toggleRuleTesting}>
          Hide Rule Tester
        </Button>
      </h3>
    );
  };
}
