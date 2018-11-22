import React from 'react';

import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import Header from 'in-websites/NewWebsiteFlow/Header';
import Frame from 'in-websites/NewWebsiteFlow/Frame';

export default function InputStep() {
  return (
    <Frame>
      <Header>Add Website</Header>

      <Paragraph>
        Get started with website monitoring to better understand how your website performance impacts user experience.
        Configuration is simple!
      </Paragraph>
    </Frame>
  );
}
