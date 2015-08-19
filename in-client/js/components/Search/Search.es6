import irpt from 'react-immutable-proptypes';
import {IntlMixin} from 'react-intl';
import React from 'react/addons';
import _ from 'lodash';

import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import * as mapFilters from 'in-services/stores/mapFilters';
import {create} from 'in-services/conveyer';
import Icon from 'in-components/Icon';

import enhance from 'in-components/hoc/enhance';

import './Search.less';

const block = 'in-search';

const comma = 188;
const enter = 13;

const addFilterControls = [enter, comma];

const Search = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    predicates: irpt.list.isRequired,
    snapshots: irpt.list
  },

  statics: {
    createObservables: () => {
      return {
        predicates: mapFilters.filters,
        snapshots: create(SnapshotConveyer, {
          pluginId: 'com.instana.forge.infrastructure.os.OS'
        })
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

    const completions = this.getAllTags()
      .filter(tag => tag.indexOf(this.state.input) !== -1);

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

  getAllTags() {
    if (!this.props.snapshots) {
      return [];
    }

    let tags = [];

    this.props.snapshots.forEach(snapshot => {
      const t = snapshot.get('tags');
      if (t) {
        tags = tags.concat(t.toArray());
      }
    });

    return _.uniq(tags);
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
    mapFilters.addTagFilter(text);
    this.setState({
      input: ''
    });
  },

  addNewPredicate(predicate) {
    mapFilters.set(this.props.predicates.push(predicate));
  },

  removePredicate(predicate) {
    mapFilters.remove(predicate);
  },

  clear() {
    mapFilters.clear();
    this.setState({
      input: ''
    });
  }
});

export default enhance(Search);
