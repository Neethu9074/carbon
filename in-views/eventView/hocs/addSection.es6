import React from 'react';

import Section from 'in-views/eventView/components/Section';

export default function addSection(ComposedComponent, isPresent) {
  return function AddSectionHoc(props) {
    if (isPresent && !isPresent(props.event)) {
      return null;
    }

    if (props.sectionized) {
      return (
        <Section>
          <ComposedComponent {...props} />
        </Section>
      );
    }
    return <ComposedComponent {...props} />;
  };
}
