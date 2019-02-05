import rpt from 'prop-types';
import React from 'react';

import ExtractedServiceNamePresenter from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtractionRuleConfig/components/ExtractedServiceNamePresenter';
import MatchPresenter from 'in-views/configurationView/tabs/TeamSettings/pages/legacyServiceExtraction/ServiceExtractionRuleConfig/components/MatchPresenter';
import FormGroup from 'in-views/configurationView/components/FormGroup';
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
    const matchesWithResolvedKeys = {};
    let isMatching = true;
    matchKeys.forEach(matchKey => {
      const fieldType = this.props.matchSpecificationOptions[matchKey].type;
      if (fieldType === 'kv') {
        const key = matchSpecificationForm
          .get(matchKey)
          .get(0)
          .get('key').value;
        const value = matchSpecificationForm
          .get(matchKey)
          .get(0)
          .get('value').value;

        const [givenKey, givenValue] = (this.state[matchKey] || '').split(/:|=/, 2);
        if (givenKey === key) {
          const regex = new RegExp(`^${value}$`);
          matchesWithResolvedKeys[`${matchKey}-${key}-`] = matches[matchKey] = (givenValue || '').match(regex);
        } else {
          matchesWithResolvedKeys[`${matchKey}-${key}-`] = matches[matchKey] = null;
        }
      } else {
        // require a full match in order to have the same matching behavior on client and server side
        const regex = new RegExp(`^${matchSpecificationForm.get(matchKey).value}$`);
        matchesWithResolvedKeys[`${matchKey}-`] = matches[matchKey] = (this.state[matchKey] || '').match(regex);
      }
    });

    return (
      <div className={block}>
        {this.getHeader()}

        <Row>
          {matchSpecificationForm.reduce((acc, item, matchKey) => {
            const matchOpts = this.props.matchSpecificationOptions[matchKey];
            const matchPrefix =
              matchOpts.type === 'kv' ? `${matchKey}-${item.get(0).get('key').value}-` : `${matchKey}-`;
            acc.push(
              <Col cols={6} key={matchKey}>
                <FormGroup>
                  <Label htmlFor={`${id}-test-${matchKey}`}>
                    {this.props.matchSpecificationOptions[matchKey].titleName}
                  </Label>
                  <Input
                    type="text"
                    id={`${id}-test-${matchKey}`}
                    placeholder={this.props.matchSpecificationOptions[matchKey].testPlaceholder}
                    value={this.state[matchKey] || ''}
                    onChange={e => this.setState({ [matchKey]: e.target.value })}
                  />
                </FormGroup>

                <MatchPresenter match={matches[matchKey]} prefix={matchPrefix} />
              </Col>
            );
            return acc;
          }, [])}
        </Row>

        <ExtractedServiceNamePresenter ruleForm={ruleForm} matches={matchesWithResolvedKeys} isMatching={isMatching} />
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
