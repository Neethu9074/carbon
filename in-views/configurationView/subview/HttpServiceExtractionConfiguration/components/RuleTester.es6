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
  display: 'RuleTester',

  propTypes: {
    toggleRuleTesting: React.PropTypes.any,
    rule: React.PropTypes.any.isRequired,
    allMatchesCompile: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {};
  },

  render() {
    if (!this.props.allMatchesCompile) {
      return (
        <div className={block}>
          {this.getHeader()}

          <p>All regular expressions must compile in order for rules to be tested.</p>
        </div>
      );
    }

    const rule = this.props.rule;
    const id = rule.get('id');

    const matchKeys = rule.get('matchSpecification').keySeq().toArray().sort();
    const matches = {};
    matchKeys.forEach(key => {
      matches[key] = (this.state[key] || '').match(new RegExp(rule.getIn(['matchSpecification', key])));
    });

    return (
      <div className={block}>
        {this.getHeader()}

        <Row>
          {matchKeys.map((key, i) =>
            <Col cols={6}
                 key={key}>
              <FormGroup>
                <Label htmlFor={`${id}-test-${key}`}>{options[key].titleName}</Label>
                <Input type='text'
                       id={`${id}-test-${key}`}
                       placeholder={options[key].testPlaceholder}
                       value={this.state[key] || ''}
                       onChange={e => this.setState({[key]: e.target.value})}
                       autoFocus={i === 0}/>
              </FormGroup>

              <MatchPresenter match={matches[key]}
                              prefix={`${key}-`}/>
            </Col>
          )}
        </Row>

        <ExtractedServiceNamePresenter rule={rule}
                                       matches={matches}/>
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
