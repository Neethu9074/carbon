import React from 'react';

import WebsiteHeading from 'in-views/eumView/components/WebsiteHeading';
import { eumKeysViewLink$ } from 'in-stores/navigation/configuration';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './NoWebsiteLandingScreen.less';

const block = 'in-website-no-website-landing-screen';

export default connectTo({ eumKeysViewLink: eumKeysViewLink$ }, function NoWebsiteLandingScreen({ eumKeysViewLink }) {
  return (
    <div className={block}>
      <div className={`${block}__image`} />
      <WebsiteHeading />
      <p className={`${block}__description`}>
        {`Get started with website monitoring to better understand how your website performance impacts user experience.
          Configuration is simple – give it a try!`}
      </p>
      <Button href={eumKeysViewLink}>
        CONFIGURE
      </Button>
    </div>
  );
});
