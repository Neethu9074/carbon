import React from 'react';

import TechnologyIndicator from 'in-applications/components/TechnologyIndicator';
import getElementDimensions from 'in-hoc/getElementDimensions';

import locals from './TechnologyIndicatorList.mless';

export default getElementDimensions(
  class extends React.Component {
    static displayName = 'TechnologyIndicatorList';

    state = {
      showTechnologyLabel: true
    };

    UNSAFE_componentWillUpdate(nextProps) {
      if (!nextProps.width) {
        return;
      }

      const responsive = nextProps.responsive === undefined ? true : nextProps.responsive;
      const shouldShowTechnologyLabel = !responsive || (responsive && (!nextProps.width || nextProps.width < 144));
      if (!this.props.width) {
        if (this.state.showTechnologyLabel !== shouldShowTechnologyLabel) {
          this.setState({
            showTechnologyLabel: shouldShowTechnologyLabel
          });
        }
      }
    }

    render() {
      const { technologies } = this.props;
      if (!technologies || technologies.length === 0) {
        // always return a valid dom element, the getClientDimension hoc can attach to
        return <div />;
      }

      return (
        <ul className={locals.list}>
          {technologies
            .slice()
            .sort()
            .map(pluginOrGroupType => (
              <TechnologyIndicator
                key={pluginOrGroupType}
                pluginOrGroupType={pluginOrGroupType}
                showTechnologyLabel={this.state.showTechnologyLabel}
              />
            ))}
        </ul>
      );
    }
  }
);
