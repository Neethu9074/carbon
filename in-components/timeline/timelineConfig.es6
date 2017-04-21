// Be warned (ben @ 2016-10-04): Safari 10 cannot use font sizes in rem with varying
// text alignments. This used to work with Safari 9 (and all other browsers).
export const font = '10px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';

export const darkColorTransparent = 'rgba(45, 64, 72, 0)';
export const darkColor = '#2d4048'; // 'rgba(45, 64, 72, 1)';
export const lightColor = '#92a5ae';
export const midColor = '#43565e';

// Time range constants
const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 31;

export const slices = [
  minute,
  minute * 5,
  minute * 10,
  minute * 15,
  minute * 30,
  hour,
  hour * 2,
  hour * 6,
  hour * 12,
  day,
  day * 2,
  day * 7,
  day * 14,
  month
];
