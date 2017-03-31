import { get_cpu_arch } from '../cpu';
import { pad_left, to_hex } from '../util';

/**
 * Parses out any information regarding binary images. The output
 * of this function is of the following format:
 *
 *    0x3537d000 - 0x3549efff  CoreGraphics armv7  <65f6c8701b563542820a26b0dfc4f6a4> /System/Library/Frameworks/CoreGraphics.framework/CoreGraphics
 *
 * @param report the JSON report we're dealing with.
 * @returns {string[]} an array of rows to output.
 */
export function parseImages(report) {
  var rows = ['', 'Binary Images:'];
  var sys = report['system'] || {};

  var exe_path = sys['CFBundleExecutablePath'];
  var images = report['binary_images'] || [];

  images.forEach(function(image) {
    // for arch
    var cpu = image['cpu_type'];
    var cpu_sub = image['cpu_subtype'];
    var arch = get_cpu_arch(cpu, cpu_sub);

    // for paths
    var path = image['name'];
    var name = path.substr(path.lastIndexOf('/') + 1, path.length);
    var is_base = path === exe_path ? '+' : ' ';

    // for uuid
    var uuid = lower_and_replace(image['uuid']);

    // for addresses
    var addr = image['image_addr'];
    var size = image['image_size'];
    var ad_hex = '0x' + to_hex(addr);
    var end_hex = '0x' + to_hex(addr + size - 1);
    var p_addr = pad_left(ad_hex, ' ', 10);
    var e_addr = pad_left(end_hex, ' ', 10);

    // output
    rows.push(`${p_addr} - ${e_addr} ${is_base}${name} ${arch}  <${uuid}> ${path}`);
  });

  return rows;
}

/*
  Private functions.
 */

function lower_and_replace(uuid) {
  if (!uuid) {
    return '(null)';
  }
  return uuid.toLowerCase().replace(/-/g, '');
}
