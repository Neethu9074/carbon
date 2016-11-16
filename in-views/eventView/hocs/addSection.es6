import irpt from 'react-immutable-proptypes';
import React from 'react';

import Section from 'in-views/eventView/components/Section';


export default function addSection(ComposedComponent, isPresent) {
  return React.createClass({

    displayName: 'AddSectionHoc',

    propTypes: {
      sectionized: React.PropTypes.bool,
      event: irpt.map.isRequired
    },

    render() {
      if (isPresent && !isPresent(this.props.event)) {
        return null;
      }

      if (this.props.sectionized) {
        return (
          <Section>
            <ComposedComponent {...this.props} />
          </Section>
        );
      }
      return (
        <ComposedComponent {...this.props} />
      );
    }
  });
}
