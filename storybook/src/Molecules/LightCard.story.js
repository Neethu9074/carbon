import React from 'react';

import LightCard from 'in-new-components/Card/LightCardV2';

export default {
  title: 'Molecules/Cards/LightCard',
  component: LightCard
};

const content =
  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat beatae doloremque sit odit officia consectetur neque aut magnam sint? Eos laborum magni quidem debitis sequi voluptates, magnam fuga incidunt sed?';

export const standard = () => <LightCard title="Title">{content}</LightCard>;

export const withIcon = () => (
  <LightCard title="Title" icon="lib_infrastructure_inverted">
    {content}
  </LightCard>
);

export const withLeftHeader = () => (
  <LightCard title="Title" icon="lib_infrastructure_inverted" leftHeaderContent={<div>Left Header Content</div>}>
    {content}
  </LightCard>
);

export const withRightHeader = () => (
  <LightCard title="Title" icon="lib_infrastructure_inverted" rightHeaderContent={<div>Right Header Content</div>}>
    {content}
  </LightCard>
);

export const withoutHeader = () => <LightCard>{content}</LightCard>;

export const useMaxAvailableHeight = () => (
  <div style={{ height: '400px' }}>
    <LightCard title="Title" useMaxAvailableHeight>
      {content}
    </LightCard>
  </div>
);
