import React from 'react/addons';
import _ from 'lodash';

import * as viewStore from 'in-stores/view';

import enhance from '../hoc/enhance';
import Tag from '../Tag';

import './TagListAll.less';

const rpt = React.PropTypes;

const TagListAll = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    tags: rpt.array
  },

  statics: {
    createObservables() {
      return {
        tags: viewStore.viewStructure.map(viewStructure => {
          return viewStructure.map(nodeStructure => nodeStructure.node);
        })
        .map(snapshots => {
          let tags = [];
          snapshots.forEach(snapshot => {
            const t = snapshot.get('tags');
            if (t) {
              tags = tags.concat(t.toArray());
            }
          });
          return _.uniq(tags);
        })
      };
    }
  },

  render() {
    let tags = this.props.tags;
    if (!tags || tags.length === 0) {
      return (
        <div className={'in-tag-list-all__no-tags'}>
          There are no tags defined
        </div>
      );
    }

    tags = tags.sort();
    return (
      <div>
        {tags.map((tag) =>
          <Tag key={tag}
               tag={tag}
               isDark={true}/>
        )}
      </div>
    );
  }

});

export default enhance(TagListAll);
