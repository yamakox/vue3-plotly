# @yamakox/vue3-plotly

A Vue 3 wrapper component for [Plotly.js](https://plotly.com/javascript/) charts

[![npm](https://img.shields.io/npm/v/@yamakox/vue3-plotly)](https://www.npmjs.com/package/@yamakox/vue3-plotly)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Features

- Lightweight Vue 3 wrapper for Plotly.js
  - Full TypeScript support with type definitions
  - Compatible with Plotly.js v3+
  - Supports Plotly.js methods and events
  - Reactive data binding with Vue 3's Composition API
  - Easy integration with existing Vue 3 projects
  - Zero additional dependencies (Plotly.js is peer dependency)

---

## Installation

```bash
npm install --save @yamakox/vue3-plotly plotly.js-dist-min
```

`plotly.js-dist-min` is required as a peer dependency.

For TypeScript users, you can install type definitions for `plotly.js-dist-min`:

```bash
npm install --save-dev @types/plotly.js
```

---

## Usage

### Basic Example

App.vue:

```vue
<script setup lang="ts">
import Plot from '@yamakox/vue3-plotly'
import Plotly from 'plotly.js-dist-min'
import { useTemplateRef, onMounted } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const plot1 = useTemplateRef<ComponentExposed<typeof Plot>|null>('plot1')

const data: Partial<Plotly.Data>[] = [
  { x: [1, 2, 3], y: [10, 20, 30], type: 'scatter', mode: 'lines+markers', name: 'Sample' }
]

const layout: Partial<Plotly.Layout> = {
  title: { text: 'My First Plotly Chart', font: { size: 20 } }, width: 600, height: 400
}

onMounted(async () => {
  setTimeout(async () => {
    try {
      const data2: Partial<Plotly.Data>[] = [
        { x: [4, 5, 6], y: [40, 50, 60], type: 'scatter', mode: 'lines+markers', name: 'Sample2' }
      ]
      plot1.value?.addTraces(data2)
    } catch(error) {console.log(error)}
  }, 1000)
})
</script>

<template>
  <plot ref="plot1" :data="data" :layout="layout" />
</template>
```

types/plotly.d.ts:

```plotly.d.ts
declare module 'plotly.js-dist-min' {
  import Plotly from 'plotly.js'
  export default Plotly
}
```

---

## Props

| Prop       | Type                  | Required | Description                        |
|------------|-----------------------|----------|------------------------------------|
| `data`     | `Plotly.Data[]`       | Yes      | The trace data to plot             |
| `layout`   | `Partial<Layout>`     | No       | Plotly layout config               |
| `config`   | `Partial<Config>`     | no       | Plotly config options              |

All prop types are derived from [@types/plotly.js](https://www.npmjs.com/package/@types/plotly.js).

---

## Events

| Event                  | Plotly.js event               |
|------------------------|-------------------------------|
| click                  | plotly_click                  |
| unhover                | plotly_unhover                |
| hover                  | plotly_hover                  |
| selecting              | plotly_selecting              |
| selected               | plotly_selected               |
| restyle                | plotly_restyle                |
| relayout               | plotly_relayout               |
| relayouting            | plotly_relayouting            |
| click-annotation       | plotly_clickannotation        |
| animating-frame        | plotly_animatingframe         |
| legend-click           | plotly_legendclick            |
| legend-double-click    | plotly_legenddoubleclick      |
| slider-change          | plotly_sliderchange           |
| slider-end             | plotly_sliderend              |
| slider-start           | plotly_sliderstart            |
| sunburst-click         | plotly_sunburstclick          |
| event                  | plotly_event                  |
| before-plot            | plotly_beforeplot             |
| after-export           | plotly_afterexport            |
| after-plot             | plotly_afterplot              |
| animated               | plotly_animated               |
| animation-interrupted  | plotly_animationinterrupted   |
| autosize               | plotly_autosize               |
| before-export          | plotly_beforeexport           |
| deselect               | plotly_deselect               |
| double-click           | plotly_doubleclick            |
| framework              | plotly_framework              |
| redraw                 | plotly_redraw                 |
| transitioning          | plotly_transitioning          |
| transition-interrupted | plotly_transitioninterrupted  |

All events are defined by [@types/plotly.js](https://www.npmjs.com/package/@types/plotly.js).

---

## Exposed

```typescript
declare function relayout(layout: Partial<Plotly.Layout>): Promise<Plotly.PlotlyHTMLElement>;
declare function redraw(): Promise<Plotly.PlotlyHTMLElement>;
declare function purge(): void;
declare function restyle(aobj: Plotly.Data, traces?: number[] | number): Promise<Plotly.PlotlyHTMLElement>;
declare function update(traceUpdate: Plotly.Data, layoutUpdate: Partial<Plotly.Layout>, traces?: number[] | number): Promise<Plotly.PlotlyHTMLElement>;
declare function addTraces(traces: Plotly.Data | Plotly.Data[], newIndices?: number[] | number): Promise<Plotly.PlotlyHTMLElement>;
declare function deleteTraces(indices: number[] | number): Promise<Plotly.PlotlyHTMLElement>;
declare function moveTraces(currentIndices: number[] | number, newIndices?: number[] | number): Promise<Plotly.PlotlyHTMLElement>;
declare function extendTraces(update: Plotly.Data | Plotly.Data[], indices: number | number[], maxPoints?: number): Promise<Plotly.PlotlyHTMLElement>;
declare function prependTraces(update: Plotly.Data | Plotly.Data[], indices: number | number[]): Promise<Plotly.PlotlyHTMLElement>;
declare function toImage(opts?: Plotly.ToImgopts): Promise<string>;
declare function downloadImage(opts: Plotly.DownloadImgopts): Promise<string>;
declare function addFrames(frames: Array<Partial<Plotly.Frame>>): Promise<Plotly.PlotlyHTMLElement>;
declare function deleteFrames(frames: number[]): Promise<Plotly.PlotlyHTMLElement>;
declare function animate(frameOrGroupNameOrFrameList?: string | string[] | Partial<Plotly.Frame> | Array<Partial<Plotly.Frame>>, opts?: Partial<Plotly.AnimationOpts>): Promise<void>;
```

---

## Development

Install dependencies:

```bash
npm install
```

Build the package with TypeScript declaration files:

```bash
npm run build
```

Generate only TypeScript declaration files:

```bash
npm run build:types
```

 _Normally, you only need `npm run build`, which generates both the compiled code and the type definitions._

Publish to npm:

```bash
npm publish --access public
```

---

## License

MIT © 2025 [@yamakox](https://github.com/yamakox)
