/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getTagsThatFitIntoMaxWidth, getTagsThatFitAfterResize } from 'in-components/TagsList/utils';
import { TagsType } from 'in-components/TagsList/DynamicTagList';

const mockTags = [
  {
    text: 'First tag',
    width: 65
  },
  {
    text: 'A very long tag that might be hidden 1',
    width: 239
  },
  {
    text: 'A very long tag that might be hidden 2',
    width: 241
  },
  {
    text: 'A very long tag that might be hidden 3',
    width: 243
  },
  {
    text: 'Another tag',
    width: 86
  },
  {
    text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
    width: 876
  }
];

const mockTargetWidth1 = 600;
const mockTargetWidth2 = 1000;
const mockTargetWidth3 = 3000;
const mockTargetWidth4 = 50;
const mockTargetWidth5 = 406;
const mockTargetWidth6 = 405;

const mockDisplayedTags1 = [
  {
    text: 'First tag',
    width: 65
  },
  {
    text: 'A very long tag that might be hidden 1',
    width: 239
  },
  {
    text: 'A very long tag that might be hidden 2',
    width: 241
  },
  { text: 'A very long tag that might be hidden 3', width: 243 }
];

const mockHiddenTags1 = [
  { text: 'Another tag', width: 86 },
  {
    text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
    width: 876
  }
];

const mockDisplayedTags2 = [
  {
    text: 'First tag',
    width: 65
  },
  {
    text: 'A very long tag that might be hidden 1',
    width: 239
  },
  {
    text: 'A very long tag that might be hidden 2',
    width: 241
  },
  { text: 'A very long tag that might be hidden 3', width: 243 },
  { text: 'Another tag', width: 86 },
  {
    text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
    width: 876
  }
];

const mockHiddenTags2: TagsType = [];

describe('in-custom-dashboards/widgets/SloLegacy/components/TagsList/utils', () => {
  describe('getTagsThatFitIntoMaxWidth', () => {
    it('returns correct values for different target widths', () => {
      expect(getTagsThatFitIntoMaxWidth(mockTags, mockTargetWidth1)).toEqual({
        tagsThatDontFit: [
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ],
        tagsThatFit: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 }
        ]
      });

      expect(getTagsThatFitIntoMaxWidth(mockTags, mockTargetWidth2)).toEqual({
        tagsThatDontFit: [
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ],
        tagsThatFit: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 }
        ]
      });

      expect(getTagsThatFitIntoMaxWidth(mockTags, mockTargetWidth3)).toEqual({
        tagsThatDontFit: [],
        tagsThatFit: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ]
      });

      expect(getTagsThatFitIntoMaxWidth(mockTags, mockTargetWidth4)).toEqual({
        tagsThatDontFit: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ],
        tagsThatFit: []
      });

      expect(getTagsThatFitIntoMaxWidth(mockTags, mockTargetWidth5)).toEqual({
        tagsThatDontFit: [
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ],
        tagsThatFit: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'Another tag', width: 86 }
        ]
      });

      expect(getTagsThatFitIntoMaxWidth(mockTags, mockTargetWidth6)).toEqual({
        tagsThatDontFit: [
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ],
        tagsThatFit: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 }
        ]
      });
    });
  });

  describe('getTagsThatFitAfterResize', () => {
    it('returns correct values for different target widths', () => {
      expect(
        getTagsThatFitAfterResize({
          displayedTags: mockDisplayedTags1,
          hiddenTags: mockHiddenTags1,
          targetWidth: 850
        })
      ).toEqual({
        displayedTags: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 }
        ],
        hiddenTags: [
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ]
      });

      expect(
        getTagsThatFitAfterResize({
          displayedTags: mockDisplayedTags1,
          hiddenTags: mockHiddenTags1,
          targetWidth: 905
        })
      ).toEqual({
        displayedTags: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 }
        ],
        hiddenTags: [
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ]
      });

      expect(
        getTagsThatFitAfterResize({
          displayedTags: mockDisplayedTags1,
          hiddenTags: mockHiddenTags1,
          targetWidth: 906
        })
      ).toEqual({
        displayedTags: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 }
        ],
        hiddenTags: [
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ]
      });

      expect(
        getTagsThatFitAfterResize({
          displayedTags: mockDisplayedTags1,
          hiddenTags: mockHiddenTags1,
          targetWidth: 812
        })
      ).toEqual({
        displayedTags: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 }
        ],
        hiddenTags: [
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ]
      });

      expect(
        getTagsThatFitAfterResize({
          displayedTags: mockDisplayedTags1,
          hiddenTags: mockHiddenTags1,
          targetWidth: 811
        })
      ).toEqual({
        displayedTags: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 }
        ],
        hiddenTags: [
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ]
      });

      expect(
        getTagsThatFitAfterResize({
          displayedTags: mockDisplayedTags2,
          hiddenTags: mockHiddenTags2,
          targetWidth: 2000
        })
      ).toEqual({
        displayedTags: [
          { text: 'First tag', width: 65 },
          { text: 'A very long tag that might be hidden 1', width: 239 },
          { text: 'A very long tag that might be hidden 2', width: 241 },
          { text: 'A very long tag that might be hidden 3', width: 243 },
          { text: 'Another tag', width: 86 },
          {
            text: 'This one will be very long on purpose, because I need to test hiding stuff with these tags and this one needs to be hidden for sure. I hope. Lets see',
            width: 876
          }
        ],
        hiddenTags: []
      });
    });
  });
});
