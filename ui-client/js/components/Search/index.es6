'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';

import Icon from 'instana-ui-components/Icon';
import * as mapFilters from 'instana-ui-services/stores/mapFilters';

import enhance from '../enhance';

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
  'acceptor',
  'hadoop',
  'kafka',
  'redis',
  'cassandra',
  'nginx'
];

const Search = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    predicates: irpt.list.isRequired
  },

  statics: {
    createObservables: () => {
      return {
        predicates: mapFilters.filters
      };
    }
  },

  getInitialState() {
    return {
      input: ''
    };
  },

  render() {
    return (
      <div className={block}>
        <ul>
          {this.props.predicates.map(predicate =>
            <li key={predicate.get('label')}
                onClick={() => this.removePredicate(predicate)}>
              <Icon type={predicate.get('icon')}/>
              {predicate.get('label')}
            </li>
          ).toArray()}
        </ul>

        <input type='text'
               value={this.state.input}
               onKeyUp={this.onKeyUp}
               onChange={this.onChange}/>

        {this.props.predicates.size > 0 || this.state.input.length > 0 ?
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
          <li onClick={() => this.addNewTagPredicate(completion)}
              key={completion}>
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
    mapFilters.set(this.props.predicates.push(predicate));
  },

  removePredicate(predicate) {
    const newPredicates = this.props.predicates.filter(p => p !== predicate);
    mapFilters.set(newPredicates);
  },

  clear() {
    mapFilters.clear();
    this.setState({
      input: ''
    });
  }
});

export default enhance(Search);

function buildTagPredicate(tag) {
  return Immutable.Map({
    label: tag,
    icon: 'timeline',
    predicate: snapshot => {
      if (snapshot.contains('tags')) {
        return snapshot.get('tags').contains(tag);
      }
      return false;
    }
  });
}
