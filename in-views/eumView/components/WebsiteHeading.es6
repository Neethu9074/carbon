import React from 'react';

import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';

export default function WebsiteHeading({ numWebsites, className }) {
  return (
    <FullscreenViewHeading className={className} iconType="globe" count={numWebsites}>Websites</FullscreenViewHeading>
  );
}
