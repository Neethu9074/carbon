'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';

import Icon from 'instana-ui-components/Icon';

const block = 'in-search';
import './index.less';

const comma = 188;
const enter = 13;

const addFilterControls = [enter, comma];

const tags = [
  'ui-backend',
  'ui-client',
  'groundskeeper',
  'issue-tracker',
  'processor',
  'accept',
  'hadoop',
  'kafka',
  'redis',
  'cassandra',
  'nginx'
];

const Search = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  getInitialState() {
    return {
      predicates: [],
      input: ''
    };
  },

  render() {
    return (
      <div className={block}>
        <ul>
          {this.state.predicates.map(predicate =>
            <li key={predicate.label}
                onClick={() => this.removePredicate(predicate)}>
              {predicate.label}
            </li>
          )}
        </ul>

        <input type='text'
               value={this.state.input}
               onKeyUp={this.onKeyUp}
               onChange={this.onChange}/>

        {this.state.predicates.length > 0 || this.state.input.length > 0 ?
          <Icon type='x' onClick={this.clear}/>
        : null}

        {this.getCompletions()}
      </div>
    );
  },

  getCompletions() {
    if (this.state.input.length === 0) {
      return null;
    }

    const completions = tags.filter(tag => tag.indexOf(this.state.input) !== -1);

    if (completions.length === 0) {
      return null;
    }

    return (
      <ul>
        {completions.map(completion =>
          <li onClick={() => this.addNewTagPredicate(completion)}>
            {completion}
          </li>
        )}
      </ul>
    );
  },

  onKeyUp(e) {
    if (addFilterControls.indexOf(e.keyCode) !== -1) {
      this.addNewTagPredicate(this.state.input);
      e.preventDefault();
    }
  },

  onChange(e) {
    this.setState({
      input: e.target.value
    });
  },

  addNewTagPredicate(text) {
    this.addNewPredicate(buildTagPredicate(text));
    this.setState({
      input: ''
    });
  },

  addNewPredicate(predicate) {
    this.setState({
      predicates: this.state.predicates.concat(predicate)
    });
  },

  removePredicate(predicate) {
    const newPredicates = this.state.predicates.slice();
    newPredicates.splice(newPredicates.indexOf(predicate), 1);
    this.setState({
      predicates: newPredicates
    });
  },

  clear() {
    this.setState({
      predicates: [],
      input: ''
    });
  }
});

export default Search;

function buildTagPredicate(tag) {
  return {
    label: tag,
    icon: 'timeline',
    predicate: snapshot => {
      if (snapshot.contains('tags')) {
        return snapshot.get('tags').contains(tag);
      }
      return false;
    }
  };
}
