import React from 'react';

import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import Button from 'in-components/Button';

import './NoWebsiteLandingScreen.less';

const block = 'in-website-no-website-landing-screen';

export default function NoWebsiteLandingScreen() {
  return (
    <div className={block}>
      <WebsiteHeading />
      <p className={`${block}__description`}>
        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind
        texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean
      </p>
      <Button>
        CONFIGURE
      </Button>
    </div>
  );
}
