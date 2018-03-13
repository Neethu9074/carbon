import { ResponsiveHeatMap } from '@nivo/heatmap';
import { defaultProps } from 'recompose';
import React from 'react';

import locals from './HeatMap.mless';

export default defaultProps({
  height: 300
})(HeatMap);

function HeatMap({ height }) {
  return (
    <div style={{ height }} className={locals.heatMap}>
      <ResponsiveHeatMap
        data={[
          {
            country: 'AD',
            'hot dog': 53,
            'hot dogColor': 'hsl(283, 70%, 50%)',
            burger: 98,
            burgerColor: 'hsl(58, 70%, 50%)',
            sandwich: 96,
            sandwichColor: 'hsl(24, 70%, 50%)',
            kebab: 76,
            kebabColor: 'hsl(133, 70%, 50%)',
            fries: 44,
            friesColor: 'hsl(47, 70%, 50%)',
            donut: 53,
            donutColor: 'hsl(155, 70%, 50%)',
            junk: 82,
            junkColor: 'hsl(298, 70%, 50%)',
            sushi: 71,
            sushiColor: 'hsl(98, 70%, 50%)',
            ramen: 100,
            ramenColor: 'hsl(181, 70%, 50%)',
            curry: 89,
            curryColor: 'hsl(317, 70%, 50%)',
            udon: 48,
            udonColor: 'hsl(232, 70%, 50%)'
          },
          {
            country: 'AE',
            'hot dog': 12,
            'hot dogColor': 'hsl(75, 70%, 50%)',
            burger: 40,
            burgerColor: 'hsl(18, 70%, 50%)',
            sandwich: 61,
            sandwichColor: 'hsl(225, 70%, 50%)',
            kebab: 41,
            kebabColor: 'hsl(200, 70%, 50%)',
            fries: 88,
            friesColor: 'hsl(275, 70%, 50%)',
            donut: 96,
            donutColor: 'hsl(32, 70%, 50%)',
            junk: 78,
            junkColor: 'hsl(212, 70%, 50%)',
            sushi: 53,
            sushiColor: 'hsl(223, 70%, 50%)',
            ramen: 59,
            ramenColor: 'hsl(10, 70%, 50%)',
            curry: 0,
            curryColor: 'hsl(90, 70%, 50%)',
            udon: 24,
            udonColor: 'hsl(179, 70%, 50%)'
          },
          {
            country: 'AF',
            'hot dog': 77,
            'hot dogColor': 'hsl(328, 70%, 50%)',
            burger: 10,
            burgerColor: 'hsl(30, 70%, 50%)',
            sandwich: 11,
            sandwichColor: 'hsl(81, 70%, 50%)',
            kebab: 100,
            kebabColor: 'hsl(9, 70%, 50%)',
            fries: 10,
            friesColor: 'hsl(200, 70%, 50%)',
            donut: 22,
            donutColor: 'hsl(254, 70%, 50%)',
            junk: 9,
            junkColor: 'hsl(177, 70%, 50%)',
            sushi: 68,
            sushiColor: 'hsl(17, 70%, 50%)',
            ramen: 41,
            ramenColor: 'hsl(344, 70%, 50%)',
            curry: 86,
            curryColor: 'hsl(21, 70%, 50%)',
            udon: 100,
            udonColor: 'hsl(143, 70%, 50%)'
          },
          {
            country: 'AG',
            'hot dog': 88,
            'hot dogColor': 'hsl(149, 70%, 50%)',
            burger: 51,
            burgerColor: 'hsl(185, 70%, 50%)',
            sandwich: 30,
            sandwichColor: 'hsl(61, 70%, 50%)',
            kebab: 91,
            kebabColor: 'hsl(49, 70%, 50%)',
            fries: 80,
            friesColor: 'hsl(306, 70%, 50%)',
            donut: 77,
            donutColor: 'hsl(109, 70%, 50%)',
            junk: 1,
            junkColor: 'hsl(91, 70%, 50%)',
            sushi: 0,
            sushiColor: 'hsl(201, 70%, 50%)',
            ramen: 11,
            ramenColor: 'hsl(12, 70%, 50%)',
            curry: 85,
            curryColor: 'hsl(221, 70%, 50%)',
            udon: 67,
            udonColor: 'hsl(13, 70%, 50%)'
          },
          {
            country: 'AI',
            'hot dog': 40,
            'hot dogColor': 'hsl(147, 70%, 50%)',
            burger: 16,
            burgerColor: 'hsl(219, 70%, 50%)',
            sandwich: 60,
            sandwichColor: 'hsl(189, 70%, 50%)',
            kebab: 56,
            kebabColor: 'hsl(108, 70%, 50%)',
            fries: 42,
            friesColor: 'hsl(48, 70%, 50%)',
            donut: 39,
            donutColor: 'hsl(11, 70%, 50%)',
            junk: 59,
            junkColor: 'hsl(209, 70%, 50%)',
            sushi: 60,
            sushiColor: 'hsl(287, 70%, 50%)',
            ramen: 72,
            ramenColor: 'hsl(71, 70%, 50%)',
            curry: 53,
            curryColor: 'hsl(204, 70%, 50%)',
            udon: 24,
            udonColor: 'hsl(37, 70%, 50%)'
          },
          {
            country: 'AL',
            'hot dog': 20,
            'hot dogColor': 'hsl(155, 70%, 50%)',
            burger: 87,
            burgerColor: 'hsl(34, 70%, 50%)',
            sandwich: 9,
            sandwichColor: 'hsl(283, 70%, 50%)',
            kebab: 30,
            kebabColor: 'hsl(277, 70%, 50%)',
            fries: 0,
            friesColor: 'hsl(127, 70%, 50%)',
            donut: 31,
            donutColor: 'hsl(355, 70%, 50%)',
            junk: 77,
            junkColor: 'hsl(223, 70%, 50%)',
            sushi: 23,
            sushiColor: 'hsl(293, 70%, 50%)',
            ramen: 4,
            ramenColor: 'hsl(257, 70%, 50%)',
            curry: 95,
            curryColor: 'hsl(178, 70%, 50%)',
            udon: 83,
            udonColor: 'hsl(199, 70%, 50%)'
          },
          {
            country: 'AM',
            'hot dog': 33,
            'hot dogColor': 'hsl(296, 70%, 50%)',
            burger: 2,
            burgerColor: 'hsl(289, 70%, 50%)',
            sandwich: 89,
            sandwichColor: 'hsl(263, 70%, 50%)',
            kebab: 29,
            kebabColor: 'hsl(25, 70%, 50%)',
            fries: 0,
            friesColor: 'hsl(190, 70%, 50%)',
            donut: 24,
            donutColor: 'hsl(332, 70%, 50%)',
            junk: 53,
            junkColor: 'hsl(356, 70%, 50%)',
            sushi: 94,
            sushiColor: 'hsl(263, 70%, 50%)',
            ramen: 71,
            ramenColor: 'hsl(337, 70%, 50%)',
            curry: 29,
            curryColor: 'hsl(120, 70%, 50%)',
            udon: 84,
            udonColor: 'hsl(130, 70%, 50%)'
          },
          {
            country: 'AO',
            'hot dog': 42,
            'hot dogColor': 'hsl(131, 70%, 50%)',
            burger: 63,
            burgerColor: 'hsl(254, 70%, 50%)',
            sandwich: 73,
            sandwichColor: 'hsl(305, 70%, 50%)',
            kebab: 88,
            kebabColor: 'hsl(157, 70%, 50%)',
            fries: 10,
            friesColor: 'hsl(29, 70%, 50%)',
            donut: 17,
            donutColor: 'hsl(223, 70%, 50%)',
            junk: 83,
            junkColor: 'hsl(359, 70%, 50%)',
            sushi: 32,
            sushiColor: 'hsl(258, 70%, 50%)',
            ramen: 21,
            ramenColor: 'hsl(338, 70%, 50%)',
            curry: 70,
            curryColor: 'hsl(22, 70%, 50%)',
            udon: 68,
            udonColor: 'hsl(112, 70%, 50%)'
          },
          {
            country: 'AQ',
            'hot dog': 66,
            'hot dogColor': 'hsl(274, 70%, 50%)',
            burger: 77,
            burgerColor: 'hsl(326, 70%, 50%)',
            sandwich: 10,
            sandwichColor: 'hsl(150, 70%, 50%)',
            kebab: 77,
            kebabColor: 'hsl(77, 70%, 50%)',
            fries: 85,
            friesColor: 'hsl(219, 70%, 50%)',
            donut: 64,
            donutColor: 'hsl(206, 70%, 50%)',
            junk: 67,
            junkColor: 'hsl(313, 70%, 50%)',
            sushi: 26,
            sushiColor: 'hsl(61, 70%, 50%)',
            ramen: 92,
            ramenColor: 'hsl(319, 70%, 50%)',
            curry: 99,
            curryColor: 'hsl(304, 70%, 50%)',
            udon: 99,
            udonColor: 'hsl(259, 70%, 50%)'
          }
        ]}
        keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut', 'junk', 'sushi', 'ramen', 'curry', 'udon']}
        indexBy="country"
        margin={{
          top: 60,
          right: 0,
          bottom: 0,
          left: 60
        }}
        forceSquare
        axisTop={{
          orient: 'top',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: '',
          legendOffset: 36
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'country',
          legendPosition: 'center',
          legendOffset: -40
        }}
        cellOpacity={1}
        cellBorderColor="inherit:darker(0.4)"
        labelTextColor="inherit:darker(1.8)"
        defs={[
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(0, 0, 0, 0.1)',
            rotation: -45,
            lineWidth: 4,
            spacing: 7
          }
        ]}
        fill={[
          {
            id: 'lines'
          }
        ]}
        animate
        motionStiffness={80}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
      />
    </div>
  );
}
