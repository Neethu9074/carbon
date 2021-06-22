# Hyphenation and word breaks

It happens here and there that proper hyphenation or line–wrapping is not applied to boxes containing text. Especially if the text can be of arbitrary length, please do apply correct hyphenation and test the component with different text length.

We have a mixin which applies correct hyphenation (for the respective language) and has also a fallback for older browsers. [Click to learn more about mixins in less](https://lesscss.org/features/#mixins-feature).

File: `in-themes/mixins.less`
Mixin: `.breakWord()`

Be aware when using props like `word-break: break-word;` which is [considered legacy](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break) and doesn’t work the same in all browsers. Again the aforementioned mixin takes care of this.

## When should I be careful using the mixin:

Since the hyphenation takes the client language into account, it can have a strange wrapping when you have e. g. technical long strings or URLs. Here you should test the behavior before and maybe apply your own wrapping.

You can apply the mixing it like that.

```
@import in-themes/mixins.less

.myTextContainer {
.breakWord();
…
}
```

## Some useful links:

- [A look at CSS hyphenation in 2019](https://justmarkup.com/articles/2019-01-28-a-look-at-css-hyphenation-in-2019/)
- [Handling Long Words and URLs (Forcing Breaks, Hyphenation, Ellipsis, etc)](https://css-tricks.com/snippets/css/prevent-long-urls-from-breaking-out-of-container/)
- [MDN Docs for overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)
- [MDN Docs for word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)
