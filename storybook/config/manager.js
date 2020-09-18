import { create } from '@storybook/theming/create';
import { addons } from '@storybook/addons';

const theme = create({
  brandTitle: 'Instana'
});

addons.setConfig({
  panelPosition: 'bottom',
  theme
});
