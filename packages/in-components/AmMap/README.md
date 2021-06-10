# AmCharts

## How to update the Maps

1.  `ls node_modules/ammap3/ammap/maps/js/ | grep "Low.js" | pbcopy`
2.  Paste this into the file `mapLoaders.js`
3.  remove continents only map (search for continents)
4.  remove `usaLow.js` (we use usa2Low)
5.  remove all world files as we are loading worldLow separately in `amMap.js`.
6.  Modify the file using multiple cursors to that the file content looks like this (do this in Visual Studio Code for multiple cursor performance):

```
import angolaLowLoader from 'promise-loader?global,ammapAngolaLow!ammap3/ammap/maps/js/angolaLow.js';
export const angolaLow = angolaLowLoader;
```
