```js script
import '../lea-tab.js';
import '../lea-tab-panel.js';
```

```js ::replaceFrom(':root')
module.exports.replaceSection = node => {
  if (node.value) {
    node.value = node.value.replace(/lion/g, 'lea').replace(/Lion/g, 'Lea');
  }
  return node;
};
```
```
::replaceFrom(':root')
module.exports.replaceSection = node => {
  if (node.type !== 'code' && node.value) {
    let newCode = node.value;
    newCode = newCode.replace(/lion-tab/g, 'lea-tab');
    node.value = newCode;
  }
  return node;
};
```

```
::removeFrom('heading:has([value=Distribute New Elements])')
```