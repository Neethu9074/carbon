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
  auto: 0
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
const width = (element) => (element.right - element.left);
const height = (element) => (element.bottom - element.top);
const centerX = (element) => element.left + width(element) / 2;
const centerY = (element) => element.top + height(element) / 2;

const TooltipCalculator = {

  margin: 10,

  direction: {x: 0, y: 0 },

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
    let data = {
      left: null,
      top: null,
      bottom: null,
      right: null
    };
    const mask = this.retreiveMask(bounds, tooltip, reference);
    this.calculateInternally(data, mask, bounds, tooltip, reference);
    const clipped = this.clipMask(mask, data, bounds, tooltip);
    if (clipped !== mask) {
      data = {
        left: null,
        top: null,
        bottom: null,
        right: null
      };
      this.calculateInternally(data, clipped, bounds, tooltip, reference);
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
  retreiveMask(bounds, tooltip) {
    let mask = Bits.Bottom;
    if (tooltip.align === 'undefined' || tooltip.align === Align.Auto) {
      // TODO
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

  updateAttributes(mask) {
    // 'left' | 'right' alignment
    if (is(mask, l) || is(mask, t) && is(mask, ra) || is(mask, b) && is(mask, la)) {
      this.attr.x = 'right';
    } else {
      this.attr.x = 'left';
    }
    // 'top' | 'bottom' alignment
    if (is(mask, t) || is(mask, l) && is(mask, la) || is(mask, r) && is(mask, ra)) {
      this.attr.y = 'bottom';
    } else {
      this.attr.y = 'top';
    }
  },

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

  bindToBounds(data, bounds, tooltip) {
    const lowerBounds = [ 'left', 'top'];
    const upperBounds = [ 'right', 'bottom'];

    if (width(tooltip) > width(bounds)) {
      data.left = bounds.left;
      data.right = bounds.right;
    }
    if (height(tooltip) > height(bounds)) {
      data.top = bounds.top;
      data.bottom = bounds.bottom;
    }
    lowerBounds.forEach((value) => {
      if (data[value] !== null && data[value] < bounds[value]) {
        data[value] = bounds[value];
      }
    });
    upperBounds.forEach((value) => {
      if (data[value] !== null && data[value] > bounds[value]) {
        data[value] = bounds[value];
      }
    });
  },

  clipMask(mask, data, bounds, tooltip) {
    if (data.left !== null) {
      mask = this.clipInternally(mask, data.left, bounds.left, bounds.right, width(tooltip), l, r);
    }
    if (data.top !== null) {
      mask = this.clipInternally(mask, data.top, bounds.top, bounds.bottom, height(tooltip), t, b);
    }
    return mask;
  },

  clipInternally(mask, coord, clipLimit1, clipLimit2, size, align1, align2) {
    if (coord < clipLimit1 || coord + size > clipLimit2) {
      if (is(mask, align1) || is(mask, align2)) {
        mask = swap(mask, align1, align2);
        mask = swap(mask, la, ra);
      }
    }
    return mask;
  }
};

export default TooltipCalculator;
