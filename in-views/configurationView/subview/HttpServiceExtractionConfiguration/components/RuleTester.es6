import React from 'react';

import ExtractedServiceNamePresenter
  from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/ExtractedServiceNamePresenter';
import {createFormatter} from 'in-services/formatters/string';
import MatchPresenter
  from 'in-views/configurationView/subview/HttpServiceExtractionConfiguration/components/MatchPresenter';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {Row, Col} from 'in-components/Grid';
import Button from 'in-components/Button';

import './RuleTester.less';

const block = 'in-config-http-ex-rule-tester';

const hostMatchPrefix = 'host-';
const hostMatchesFormatter = createFormatter(hostMatchPrefix);
const pathMatchPrefix = 'path-';
const pathMatchesFormatter = createFormatter(pathMatchPrefix);

const formatter = (formatString, hostFormatParams, pathFormatParams) => {
  return pathMatchesFormatter(hostMatchesFormatter(formatString, hostFormatParams), pathFormatParams);
};

export default React.createClass({
  display: 'RuleTester',

  propTypes: {
    toggleRuleTesting: React.PropTypes.any,
    rule: React.PropTypes.any.isRequired
  },

  getInitialState() {
    return {
      host: '',
      path: ''
    };
  },

  render() {
    const rule = this.props.rule;

    const matchHostHeaderRegExp = new RegExp(rule.getIn(['matchSpecification', 'host']));
    const matchRequestPathRegExp = new RegExp(rule.getIn(['matchSpecification', 'path']));

    const hostMatch = this.state.host.match(matchHostHeaderRegExp);
    const pathMatch = this.state.path.match(matchRequestPathRegExp);

    return (
      <div className={block}>
        <h3>
          Rule Tester

          <Button kind='info'
                  size='sm'
                  className='pull-right'
                  onClick={this.props.toggleRuleTesting}>
            Hide Rule Tester
          </Button>
        </h3>

        <Row>
          <Col cols={6}>
            <FormGroup>
              <Label htmlFor='test-header-host'>Host Header</Label>
              <Input type='text'
                     id='test-header-host'
                     placeholder='example.com'
                     value={this.state.host}
                     onChange={e => this.setState({host: e.target.value})}
                     autoFocus/>
            </FormGroup>
          </Col>
          <Col cols={6}>
            <FormGroup>
              <Label htmlFor='test-request-path'>Request Path</Label>
              <Input type='text'
                     id='test-request-path'
                     value={this.state.path}
                     onChange={e => this.setState({path: e.target.value})}
                     placeholder='/shop'/>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col cols={6}>
            <MatchPresenter match={hostMatch}
                            prefix={hostMatchPrefix}/>
          </Col>
          <Col cols={6}>
            <MatchPresenter match={pathMatch}
                            prefix={pathMatchPrefix}/>
          </Col>
        </Row>

        <ExtractedServiceNamePresenter formatter={formatter}
                                       rule={rule}
                                       hostMatch={hostMatch}
                                       pathMatch={pathMatch} />
      </div>
    );
  }
});
