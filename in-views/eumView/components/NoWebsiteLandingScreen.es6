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
        {`You are not currently monitoring a website. Website monitoring is useful in order to understand end-user
          impact! Configuration and usage of website monitoring only takes a few minutes. You should try it!`}
      </p>
      <Button href={eumKeysViewLink}>
        CONFIGURE
      </Button>
    </div>
  );
});
