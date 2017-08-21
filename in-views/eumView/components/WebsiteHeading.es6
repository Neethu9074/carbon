import React from 'react';

import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';

export default function WebsiteHeading({ numWebsites = 0 }) {
  return <FullscreenViewHeading iconType="globe" count={numWebsites}>Websites</FullscreenViewHeading>;
}
