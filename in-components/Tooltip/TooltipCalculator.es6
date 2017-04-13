const Bits = {
  LeftAlignment: 0b100000,
  RightAlignment: 0b010000,
  Right: 0b001000,
  Bottom: 0b000100,
  Left: 0b000010,
  Top: 0b000001,
  Auto: 0b000000
};

const Align = {
  leftBottom: Bits.Left | Bits.LeftAlignment,
  leftMiddle: Bits.Left,
  leftTop: Bits.Left | Bits.RightAlignment,
  topLeft: Bits.Top | Bits.LeftAlignment,
  topMiddle: Bits.Top,
  topRight: Bits.Top | Bits.RightAlignment,
  rightTop: Bits.Right | Bits.LeftAlignment,
  rightMiddle: Bits.Right,
  rightBottom: Bits.Right | Bits.RightAlignment,
  bottomRight: Bits.Bottom | Bits.LeftAlignment,
  bottomMiddle: Bits.Bottom,
  bottomLeft: Bits.Bottom | Bits.RightAlignment,
  auto: Bits.Auto
};

// Indexing
const la = 5;
const ra = 4;
const r = 3;
const b = 2;
const l = 1;
const t = 0;

// Bit operation utilities
const bit = (mask, digit) => (mask >> digit) & 1;
const is = (mask, digit) => bit(mask, digit) === 1;
const set = (mask, digit) => mask | (1 << digit);
const unset = (mask, digit) => mask & ~(1 << digit);
const swap = (mask, digitA, digitB) => {
  const bitA = bit(mask, digitA);
  const bitB = bit(mask, digitB);
  mask = bitB === 1 ? set(mask, digitA) : unset(mask, digitA);
  return bitA === 1 ? set(mask, digitB) : unset(mask, digitB);
};

// Dimension utilities
const width = element => element.right - element.left;
const height = element => element.bottom - element.top;
const centerX = element => element.left + width(element) / 2;
const centerY = element => element.top + height(element) / 2;

const createElement = () => {
  return {
    left: null,
    top: null,
    bottom: null,
    right: null
  };
};

// Resolves auto-alignments for tooltips according to
// the following pattern. The center point of reference
// is chosen for making a decision:
//
// +--+--+--+
// |BL|BM|BR| (X% of screen height)
// +----+---+
// | RM | LM| (Y% of screen height)
// +----+---+
// |TL|TM|TR| (X% of screen height)
// +--+--+--+
// X% Y% X% (of screen width)
const AutoAlignmentResolver = {
  // X% percentage of screen space for the corners
  cornerFactor: 0.2, // 20%

  isLeft(center, bounds) {
    return center.x < width(bounds) * this.cornerFactor;
  },

  isRight(center, bounds) {
    return center.x > width(bounds) - width(bounds) * this.cornerFactor;
  },

  isTop(center, bounds) {
    return center.y < height(bounds) * this.cornerFactor;
  },

  isBottom(center, bounds) {
    return center.y > height(bounds) - height(bounds) * this.cornerFactor;
  },

  resolve(bounds, tooltip, reference) {
    const center = {
      x: centerX(reference),
      y: centerY(reference)
    };
    // Top
    if (this.isTop(center, bounds)) {
      // Left
      if (this.isLeft(center, bounds)) {
        return Align.bottomLeft;
        // Right
      } else if (this.isRight(center, bounds)) {
        return Align.bottomRight;
      }
      // Middle
      return Align.bottomMiddle;
      // Bottom
    } else if (this.isBottom(center, bounds)) {
      // Left
      if (this.isLeft(center, bounds)) {
        return Align.topLeft;
        // Right
      } else if (this.isRight(center, bounds)) {
        return Align.topRight;
      }
      // Middle
      return Align.topMiddle;
    }
    if (center.x < width(bounds) / 2) {
      return Align.rightMiddle;
    }
    // Middle
    return Align.leftMiddle;
  }
};

// Calculates 'top', 'left', 'right' and 'bottom' attributes
// for DOM tooltips and other elements.
const TooltipCalculator = {
  margin: 10,

  direction: { x: 0, y: 0 },

  offset: { x: 0, y: 0 },

  attr: {
    x: 'left',
    y: 'top'
  },

  // Calculates an updates position for the tooltip and its arrow by considering
  // a six digit bitmask.
  //
  // LA RA | R B L T
  // 6  5    4 3 2 1 (Bit number)
  // LA: Left alignment
  // RA: Right alignment
  // R: Right
  // B: Bottom
  // L: Left
  // T: Top
  calculate(bounds, tooltip, reference) {
    let data = createElement();
    const mask = this.retreiveMask(bounds, tooltip, reference);
    this.calculateInternally(data, mask, bounds, tooltip, reference);
    const clipped = this.clipMask(mask, data, bounds, tooltip);
    if (clipped !== mask) {
      data = createElement();
      this.calculateInternally(data, clipped, bounds, tooltip, reference);
      if (tooltip.align !== 'undefined') {
        tooltip.align = this.retrieveAlignment(clipped, Align[tooltip.align]);
      }
    }
    this.bindToBounds(data, bounds, tooltip);
    return data;
  },

  // Calculates the tooltip position (left, top) and the arrow alignment
  calculateInternally(data, mask, bounds, tooltip, reference) {
    this.updateDirection(mask, reference);
    this.updateAttributes(mask);
    this.updateOffset(mask, tooltip, reference);

    // Set the data values
    data[this.attr.x] = centerX(reference) + this.direction.x + this.offset.x;
    data[this.attr.y] = centerY(reference) + this.direction.y + this.offset.y;
  },

  // Calculates the bitmask for tooltip alignment
  retreiveMask(bounds, tooltip, reference) {
    let mask = Bits.Bottom;
    if (tooltip.align === 'undefined' || Align[tooltip.align] === Align.auto) {
      mask = AutoAlignmentResolver.resolve(bounds, tooltip, reference);
      tooltip.align = this.retrieveAlignment(mask, Align.auto);
    } else {
      mask = Align[tooltip.align];
    }
    return mask;
  },

  // Aligns the direction vector to the direction of the positioning. The
  // direction vector is half of the length of the reference element
  updateDirection(mask, reference) {
    this.direction.x = (bit(mask, r) ^ -bit(mask, l)) * (width(reference) / 2 + this.margin);
    this.direction.y = (bit(mask, b) ^ -bit(mask, t)) * (height(reference) / 2 + this.margin);
  },

  // Decides which attributes (left, right, top, bottom) should be touched
  // for alignment, depending on the current mask
  updateAttributes(mask) {
    // 'left' | 'right' alignment
    if (is(mask, l) || (is(mask, t) && is(mask, ra)) || (is(mask, b) && is(mask, la))) {
      this.attr.x = 'right';
    } else {
      this.attr.x = 'left';
    }
    // 'top' | 'bottom' alignment
    if (is(mask, t) || (is(mask, l) && is(mask, la)) || (is(mask, r) && is(mask, ra))) {
      this.attr.y = 'bottom';
    } else {
      this.attr.y = 'top';
    }
  },

  // Updates the local offset of the popup (starting from the center of the reference)
  updateOffset(mask, tooltip, reference) {
    this.offset.x = 0;
    this.offset.y = 0;
    if (is(mask, la)) {
      this.offset.x -= bit(mask, t) * width(reference) / 2;
      this.offset.x += bit(mask, b) * width(reference) / 2;
      this.offset.y -= bit(mask, r) * height(reference) / 2;
      this.offset.y += bit(mask, l) * height(reference) / 2;
    } else if (is(mask, ra)) {
      this.offset.x += bit(mask, t) * width(reference) / 2;
      this.offset.x -= bit(mask, b) * width(reference) / 2;
      this.offset.y += bit(mask, r) * height(reference) / 2;
      this.offset.y -= bit(mask, l) * height(reference) / 2;
    } else {
      this.offset.x -= (bit(mask, t) | bit(mask, b)) * (width(tooltip) / 2);
      this.offset.y -= (bit(mask, l) | bit(mask, r)) * (height(tooltip) / 2);
    }
  },

  // Checks if the tooltip leaves the bounds and shrinks it accordingly
  bindToBounds(data, bounds, tooltip) {
    const lowerBounds = ['left', 'top'];
    const upperBounds = ['right', 'bottom'];

    if (width(tooltip) > width(bounds)) {
      data.left = bounds.left;
      data.right = bounds.right;
    }
    if (height(tooltip) > height(bounds)) {
      data.top = bounds.top;
      data.bottom = bounds.bottom;
    }
    lowerBounds.forEach(value => {
      if (data[value] !== null && data[value] < bounds[value]) {
        data[value] = bounds[value];
      }
    });
    upperBounds.forEach(value => {
      if (data[value] !== null && data[value] > bounds[value]) {
        data[value] = bounds[value];
      }
    });
  },

  // Provides a clipped mask which contains a better alignment to avoid
  // any bound collision
  clipMask(mask, data, bounds, tooltip) {
    Object.keys(data).filter(key => data[key] != null).forEach(key => {
      if (key === 'left' || key === 'right') {
        mask = this.clipInternally(key, mask, data[key], bounds.left, bounds.right, width(tooltip), l, r);
      } else {
        mask = this.clipInternally(key, mask, data[key], bounds.top, bounds.bottom, height(tooltip), t, b);
      }
    });
    return mask;
  },

  // Helper method to clip internally a mask on bit layer
  clipInternally(key, mask, coord, clipLimit1, clipLimit2, size, align1, align2) {
    let clippingA = coord < clipLimit1;
    let clippingB = coord + size > clipLimit2;

    // Switch the clipping condition accordingly since
    // the coordinate system changes for right and bottom alignment
    if ((key === 'right' && this.attr.x === 'right') || (key === 'bottom' && this.attr.y === 'bottom')) {
      clippingA = coord - size < clipLimit1;
      clippingB = coord > clipLimit2;
    }
    // Flip the mask when clipping occurs
    if (clippingA || clippingB) {
      if (is(mask, align1) || is(mask, align2)) {
        mask = swap(mask, align1, align2);
        mask = swap(mask, la, ra);
      }
    }
    return mask;
  },

  // Retrieves the actual alignment of the mask
  retrieveAlignment(mask, align) {
    Object.keys(Align).forEach(key => {
      if (Align[key] === mask) {
        align = key;
      }
    });
    return align;
  }
};

export default TooltipCalculator;
