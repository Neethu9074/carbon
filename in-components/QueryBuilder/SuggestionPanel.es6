

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import classnames from 'in-services/util/classnames';

import './SuggestionPanel.less';

const block = 'in-query-builder__suggestion-panel';
const rpt = React.PropTypes;
const SuggestionPanel = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    suggestions: irpt.list.isRequired,
    activeFilters: irpt.list,
    onSuggestionClick: rpt.func.isRequired,
    selectedSuggestion: rpt.number.isRequired
  },

  render() {
    const suggestions = this.props.suggestions;
    return (
      <ul className={block}>
        {suggestions.map((suggestion, i) =>
          <li key={suggestion.get('type') + suggestion.get('label')}
              onClick={this.props.onSuggestionClick.bind(null, suggestion)}
              className={classnames({
                [block + '-suggestion']: true,
                [block + '-suggestion--active']: i === this.props.selectedSuggestion
              })}>
            {suggestion.get('label')}
          </li>
        )}
      </ul>
    );
  }
});

export default SuggestionPanel;
