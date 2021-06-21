# Support Matrix

## Web Browsers

Our web browser support matrix is defined and maintained through
[browserslist]. You can find the support rule definition within
the [.browserslistrc] file. To resolve these rules into
web browser names and versions execute `npx browserslist`
within the ui-client repository's root directory. At the time of
writing this article (2021-06-21), the command output is the following:

```
and_chr 90
chrome 89
chrome 88
chrome 87
edge 89
edge 88
firefox 86
firefox 78
ios_saf 14.0-14.5
ios_saf 13.4-13.7
ios_saf 13.3
safari 14
safari 13.1
samsung 13.0
```

## Device Types

The Instana user interface should be able usable on all types of devices
(relevant web browser and screen resolution restrictions apply).
Our primary usage audience are desktop users. This specifically means
that pointer and touch input devices must be supported.

## Screen Resolutions

Our primary target audience are desktop users. The minimum screen width
we are targeting is `1280px` ([usage statistics]).

Devices with smaller horizontal screen dimensions (especially phones and
tables) are supported through scaling, i.e., the UI content area has a
[fixed minimum width] of `1024px` and [web browser scaling is supported].

This specifically means that we do not leverage responsive design techniques
to support screen dimensions `<1280px`.

[browserslist]: https://github.com/browserslist/browserslist
[.browserslistrc]: ./.browserslistrc
[usage statistics]: https://instana.io/s/iG_dWhR-Sg-7Ja-Jtu0Yrg
[fixed minimum width]: https://github.com/instana/ui-client/blob/23bdff8df3e34a607306fb31f745ba8d1db9533b/packages/in-themes/foundation.less#L14-L17
[web browser scaling is supported]: https://github.com/instana/ui-client/blob/23bdff8df3e34a607306fb31f745ba8d1db9533b/packages/in-server/src/templates/index.hbs#L4-L6
