import React from 'react/addons';
import _ from 'lodash';

import * as viewStore from 'in-services/stores/view';

import enhance from '../hoc/enhance';
import Tag from '../Tag';

import './TagListAll.less';

const rpt = React.PropTypes;
const block = 'in-tag-list-all';

const TagListAll = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshots: rpt.array.isRequired
  },

  statics: {
    createObservables() {
      return {
        snapshots: viewStore.viewStructure.map(viewStructure => {
          return viewStructure.map(nodeStructure => nodeStructure.node);
        })
      };
    }
  },

  render() {
    const tags = this.getAllTags().sort();

    return (
      <div className={block}>
        {tags.map((tag) =>
          <Tag key={tag}
               tag={tag}
               isDark={true}/>
        )}
      </div>
    );
  },

  getAllTags() {
    let tags = [];
    if (!this.props.snapshots) {
      return tags;
    }

    this.props.snapshots.forEach(snapshot => {
      const t = snapshot.get('tags');
      if (t) {
        tags = tags.concat(t.toArray());
      }
    });

    return _.uniq(tags);
  }
});

export default enhance(TagListAll);
