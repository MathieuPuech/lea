[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Tabs

`lea-tabs` implements tabs view to allow users to quickly move between a small number of equally important views.

```js script
import { LitElement } from 'lit-element';
import { html } from 'lit-html';
import './lea-tabs.js';
import './lea-tab.js';
import './lea-tab-panel.js';

export default {
  title: 'Navigation/Tabs',
};
```

```js preview-story
export const main = () => html`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel">
      Info page with lots of information about us.
    </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel">
      Work page that showcases our work.
    </lea-tab-panel>
  </lea-tabs>
`;
```

## How to use

### Installation

```bash
npm i --save @lea/tabs;
```

```js
import { LeaTabs, LeaTab, LeaTabPanel } from '@lea/tabs';
// or
import '@lea/tabs/lea-tabs.js';
import '@lea/tabs/lea-tab.js';
import '@lea/tabs/lea-tab-panel.js';
```

### Usage

```html
<lea-tabs>
  <lea-tab slot="tab">Info</lea-tab>
  <lea-tab-panel slot="panel">
    Info page with lots of information about us.
  </lea-tab-panel>
  <lea-tab slot="tab">Work</lea-tab>
  <lea-tab-panel slot="panel">
    Work page that showcases our work.
  </lea-tab-panel>
</lea-tabs>
```

## Examples

### Selected Index

You can set the `selectedIndex` to select a certain tab.

```js preview-story
export const selectedIndex = () => html`
  <lea-tabs .selectedIndex=${1}>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel">
      Info page with lots of information about us.
    </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel">
      Work page that showcases our work.
    </lea-tab-panel>
  </lea-tabs>
`;
```

### Slots Order

The tab and panel slots are ordered by DOM order.

This means you can switch the grouping in your `lea-tabs` from tab + panel to all tabs first or all panels first.

```js preview-story
export const slotsOrder = () => html`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel">
      Info page with lots of information about us.
    </lea-tab-panel>
    <lea-tab-panel slot="panel">
      Work page that showcases our work.
    </lea-tab-panel>
  </lea-tabs>
`;
```

### Distribute New Elements

Below, we demonstrate on how you could dynamically add new tab + panels.

```js preview-story
export const distributeNewElement = () => {
  const tagName = 'demo-tabs-add-dynamically';
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends LitElement {
        static get properties() {
          return {
            __collection: { type: Array },
          };
        }
        render() {
          return html`
            <h3>Append</h3>
            <lea-tabs id="appendTabs">
              <lea-tab slot="tab">tab 1</lea-tab>
              <lea-tab-panel slot="panel">panel 1</lea-tab-panel>
              <lea-tab slot="tab">tab 2</lea-tab>
              <lea-tab-panel slot="panel">panel 2</lea-tab-panel>
            </lea-tabs>
            <button @click="${this.__handleAppendClick}">
              Append
            </button>
            <hr />
            <h3>Push</h3>
            <lea-tabs id="pushTabs">
              <lea-tab slot="tab">tab 1</lea-tab>
              <lea-tab-panel slot="panel">panel 1</lea-tab-panel>
              <lea-tab slot="tab">tab 2</lea-tab>
              <lea-tab-panel slot="panel">panel 2</lea-tab-panel>
              ${this.__collection.map(
                item => html`
                  <lea-tab slot="tab">${item.button}</lea-tab>
                  <lea-tab-panel slot="panel">${item.panel}</lea-tab-panel>
                `,
              )}
            </lea-tabs>
            <button @click="${this.__handlePushClick}">
              Push
            </button>
          `;
        }
        constructor() {
          super();
          this.__collection = [];
        }
        __handleAppendClick() {
          const tabsElement = this.shadowRoot.querySelector('#appendTabs');
          const c = 2;
          const n = Math.floor(tabsElement.children.length / 2);
          for (let i = n + 1; i < n + c; i += 1) {
            const tab = document.createElement('lea-tab');
            tab.setAttribute('slot', 'tab');
            tab.innerText = `tab ${i}`;
            const panel = document.createElement('lea-tab-panel');
            panel.setAttribute('slot', 'panel');
            panel.innerText = `panel ${i}`;
            tabsElement.append(tab);
            tabsElement.append(panel);
          }
        }
        __handlePushClick() {
          const tabsElement = this.shadowRoot.querySelector('#pushTabs');
          const i = Math.floor(tabsElement.children.length / 2) + 1;
          this.__collection = [
            ...this.__collection,
            {
              button: `tab ${i}`,
              panel: `panel ${i}`,
            },
          ];
        }
      },
    );
  }
  return html` <demo-tabs-add-dynamically></demo-tabs-add-dynamically> `;
};
```

One way is by creating the DOM elements and appending them as needed.

Inside your `lea-tabs` extension, an example for appending nodes on a certain button click:

```js
__handleAppendClick() {
  const tabsAmount = this.children.length / 2;
  const tab = document.createElement('lea-tab');
  tab.setAttribute('slot', 'tab');
  tab.innerText = `tab ${tabsAmount + 1}`;
  const panel = document.createElement('lea-tab-panel');
  panel.setAttribute('slot', 'panel');
  panel.innerText = `panel ${tabsAmount + 1}`;
  this.append(tab);
  this.append(panel);
}
```

The other way is by adding data to a Lit property where you loop over this property in your template.
You then need to ensure this causes a re-render.

```js
__handlePushClick() {
  const tabsAmount = this.children.length;
  myCollection = [
    ...myCollection,
    {
      button: `tab ${tabsAmount + 1}`,
      panel: `panel ${tabsAmount + 1}`,
    },
  ];
  renderMyCollection();
}
```

Make sure your template re-renders when myCollection is updated.

```html
<lea-tabs id="pushTabs">
  ${myCollection.map(item => html`
  <lea-tab slot="tab">${item.button}</lea-tab>
  <lea-tab-panel slot="panel">${item.panel}</lea-tab-panel>
  `)}
</lea-tabs>
```

## Rationale

### No separate active/focus state when using keyboard

We will immediately switch content as all our content comes from light dom (e.g. no latency)

See Note at <https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-19>

> It is recommended that tabs activate automatically when they receive focus as long as their
> associated tab panels are displayed without noticeable latency. This typically requires tab
> panel content to be preloaded.

### Panels are not focusable

Focusable elements should have a means to interact with them. Tab panels themselves do not offer any interactiveness.
If there is a button or a form inside the tab panel then these elements get focused directly.