<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import Plotly from 'plotly.js-dist-min'

// MARK: constants

const DEBUG = import.meta.env.DEV

// MARK: state management

const rootRef = ref<HTMLDivElement | null>(null)
let plotlyHTMLElement: Plotly.PlotlyHTMLElement | null = null
let isDirty: boolean = false

const setDirty = () => {
  if (!isDirty) {
    isDirty = true
    nextTick(() => {
      setupPlot()
    })
  }
}

// MARK: properties

const props = defineProps<{
  data?: Plotly.Data[]
  layout?: Partial<Plotly.Layout>
  config?: Partial<Plotly.Config>
}>()

// MARK: types

type CancellableEventResult = { cancelDefault: boolean }

// MARK: exposed functions

const validateRootRef = (): HTMLDivElement => {
  if (!rootRef.value) {
    throw new Error('root element is not set')
  }
  return rootRef.value
}

function relayout(layout: Partial<Plotly.Layout>): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.relayout(validateRootRef(), layout)
}

function redraw(): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.redraw(validateRootRef())
}

function purge(): void {
  Plotly.purge(validateRootRef())
}

function restyle(aobj: Plotly.Data, traces?: number[] | number): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.restyle(validateRootRef(), aobj, traces)
}

function update(
  traceUpdate: Plotly.Data,
  layoutUpdate: Partial<Plotly.Layout>,
  traces?: number[] | number,
): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.update(validateRootRef(), traceUpdate, layoutUpdate, traces)
}

function addTraces(
  traces: Plotly.Data | Plotly.Data[],
  newIndices?: number[] | number,
): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.addTraces(validateRootRef(), traces, newIndices)
}

function deleteTraces(indices: number[] | number): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.deleteTraces(validateRootRef(), indices)
}

function moveTraces(
  currentIndices: number[] | number,
  newIndices?: number[] | number,
): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.moveTraces(validateRootRef(), currentIndices, newIndices)
}

function extendTraces(
  update: Plotly.Data | Plotly.Data[],
  indices: number | number[],
  maxPoints?: number,
): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.extendTraces(validateRootRef(), update, indices, maxPoints)
}

function prependTraces(
  update: Plotly.Data | Plotly.Data[],
  indices: number | number[],
): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.prependTraces(validateRootRef(), update, indices)
}

function toImage(opts?: Plotly.ToImgopts): Promise<string> {
  return Plotly.toImage(validateRootRef(), opts)
}

function downloadImage(opts: Plotly.DownloadImgopts): Promise<string> {
  return Plotly.downloadImage(validateRootRef(), opts)
}

function addFrames(frames: Array<Partial<Plotly.Frame>>): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.addFrames(validateRootRef(), frames)
}

function deleteFrames(frames: number[]): Promise<Plotly.PlotlyHTMLElement> {
  return Plotly.deleteFrames(validateRootRef(), frames)
}

function animate(
  frameOrGroupNameOrFrameList?:
    | string
    | string[]
    | Partial<Plotly.Frame>
    | Array<Partial<Plotly.Frame>>,
  opts?: Partial<Plotly.AnimationOpts>,
): Promise<void> {
  return Plotly.animate(validateRootRef(), frameOrGroupNameOrFrameList, opts)
}

defineExpose({
  relayout,
  redraw,
  purge,
  restyle,
  update,
  addTraces,
  deleteTraces,
  moveTraces,
  extendTraces,
  prependTraces,
  toImage,
  downloadImage,
  addFrames,
  deleteFrames,
  animate,
})

// MARK: events

const emit = defineEmits<{
  click: [event: Plotly.PlotMouseEvent]
  unhover: [event: Plotly.PlotMouseEvent]
  hover: [event: Plotly.PlotHoverEvent]
  selecting: [event: Plotly.PlotSelectionEvent]
  selected: [event: Plotly.PlotSelectionEvent]
  restyle: [event: Plotly.PlotRestyleEvent]
  relayout: [event: Plotly.PlotRelayoutEvent]
  relayouting: [event: Plotly.PlotRelayoutEvent]
  'click-annotation': [event: Plotly.ClickAnnotationEvent]
  'animating-frame': [event: Plotly.FrameAnimationEvent]
  'legend-click': [event: Plotly.LegendClickEvent, returnValues: CancellableEventResult]
  'legend-double-click': [event: Plotly.LegendClickEvent, returnValues: CancellableEventResult]
  'slider-change': [event: Plotly.SliderChangeEvent]
  'slider-end': [event: Plotly.SliderEndEvent]
  'slider-start': [event: Plotly.SliderStartEvent]
  'sunburst-click': [event: Plotly.SunburstClickEvent]
  event: [data: any]
  'before-plot': [event: Plotly.BeforePlotEvent, returnValues: CancellableEventResult]
  'after-export': []
  'after-plot': []
  animated: []
  'animation-interrupted': []
  autosize: []
  'before-export': []
  deselect: []
  'double-click': []
  framework: []
  redraw: []
  transitioning: []
  'transition-interrupted': []
}>()

// MARK: private functions

const debugLog = DEBUG
  ? (message: string, ...args: any[]) => {
      console.debug(message, ...args)
    }
  : (message: string, ...args: any[]) => {}

async function setupPlot() {
  if (isDirty && rootRef.value && props.data) {
    isDirty = false
    debugLog('setupPlot', rootRef.value, props.data)
    const element = await Plotly.react(rootRef.value, props.data, props.layout, props.config)
    if (plotlyHTMLElement !== element) {
      plotlyHTMLElement = element
      plotlyHTMLElement.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
        debugLog('plotly_click', event)
        emit('click', event)
      })
      plotlyHTMLElement.on('plotly_unhover', (event: Plotly.PlotMouseEvent) => {
        debugLog('plotly_unhover', event)
        emit('unhover', event)
      })
      plotlyHTMLElement.on('plotly_hover', (event: Plotly.PlotHoverEvent) => {
        debugLog('plotly_hover', event)
        emit('hover', event)
      })
      plotlyHTMLElement.on('plotly_selecting', (event: Plotly.PlotSelectionEvent) => {
        debugLog('plotly_selecting', event)
        emit('selecting', event)
      })
      plotlyHTMLElement.on('plotly_selected', (event: Plotly.PlotSelectionEvent) => {
        debugLog('plotly_selected', event)
        emit('selected', event)
      })
      plotlyHTMLElement.on('plotly_restyle', (event: Plotly.PlotRestyleEvent) => {
        debugLog('plotly_restyle', event)
        emit('restyle', event)
      })
      plotlyHTMLElement.on('plotly_relayout', (event: Plotly.PlotRelayoutEvent) => {
        debugLog('plotly_relayout', event)
        emit('relayout', event)
      })
      plotlyHTMLElement.on('plotly_relayouting', (event: Plotly.PlotRelayoutEvent) => {
        debugLog('plotly_relayouting', event)
        emit('relayouting', event)
      })
      plotlyHTMLElement.on('plotly_clickannotation', (event: Plotly.ClickAnnotationEvent) => {
        debugLog('plotly_clickannotation', event)
        emit('click-annotation', event)
      })
      plotlyHTMLElement.on('plotly_animatingframe', (event: Plotly.FrameAnimationEvent) => {
        debugLog('plotly_animatingframe', event)
        emit('animating-frame', event)
      })
      plotlyHTMLElement.on('plotly_legendclick', (event: Plotly.LegendClickEvent) => {
        const returnValues: CancellableEventResult = { cancelDefault: false }
        debugLog('plotly_legendclick', event)
        emit('legend-click', event, returnValues)
        return !returnValues.cancelDefault
      })
      plotlyHTMLElement.on('plotly_legenddoubleclick', (event: Plotly.LegendClickEvent) => {
        const returnValues: CancellableEventResult = { cancelDefault: false }
        debugLog('plotly_legenddoubleclick', event)
        emit('legend-double-click', event, returnValues)
        return !returnValues.cancelDefault
      })
      plotlyHTMLElement.on('plotly_sliderchange', (event: Plotly.SliderChangeEvent) => {
        debugLog('plotly_sliderchange', event)
        emit('slider-change', event)
      })
      plotlyHTMLElement.on('plotly_sliderend', (event: Plotly.SliderEndEvent) => {
        debugLog('plotly_sliderend', event)
        emit('slider-end', event)
      })
      plotlyHTMLElement.on('plotly_sliderstart', (event: Plotly.SliderStartEvent) => {
        debugLog('plotly_sliderstart', event)
        emit('slider-start', event)
      })
      plotlyHTMLElement.on('plotly_sunburstclick', (event: Plotly.SunburstClickEvent) => {
        debugLog('plotly_sunburstclick', event)
        emit('sunburst-click', event)
      })
      plotlyHTMLElement.on('plotly_event', (event: any) => {
        debugLog('plotly_event', event)
        emit('event', event)
      })
      plotlyHTMLElement.on('plotly_beforeplot', (event: Plotly.BeforePlotEvent) => {
        const returnValues: CancellableEventResult = { cancelDefault: false }
        debugLog('plotly_beforeplot', event)
        emit('before-plot', event, returnValues)
        return !returnValues.cancelDefault
      })
      plotlyHTMLElement.on('plotly_afterexport', () => {
        debugLog('plotly_afterexport')
        emit('after-export')
      })
      plotlyHTMLElement.on('plotly_afterplot', () => {
        debugLog('plotly_afterplot')
        emit('after-plot')
      })
      plotlyHTMLElement.on('plotly_animated', () => {
        debugLog('plotly_animated')
        emit('animated')
      })
      plotlyHTMLElement.on('plotly_animationinterrupted', () => {
        debugLog('plotly_animationinterrupted')
        emit('animation-interrupted')
      })
      plotlyHTMLElement.on('plotly_autosize', () => {
        debugLog('plotly_autosize')
        emit('autosize')
      })
      plotlyHTMLElement.on('plotly_beforeexport', () => {
        debugLog('plotly_beforeexport')
        emit('before-export')
      })
      plotlyHTMLElement.on('plotly_deselect', () => {
        debugLog('plotly_deselect')
        emit('deselect')
      })
      plotlyHTMLElement.on('plotly_doubleclick', () => {
        debugLog('plotly_doubleclick')
        emit('double-click')
      })
      plotlyHTMLElement.on('plotly_framework', () => {
        debugLog('plotly_framework')
        emit('framework')
      })
      plotlyHTMLElement.on('plotly_redraw', () => {
        debugLog('plotly_redraw')
        emit('redraw')
      })
      plotlyHTMLElement.on('plotly_transitioning', () => {
        debugLog('plotly_transitioning')
        emit('transitioning')
      })
      plotlyHTMLElement.on('plotly_transitioninterrupted', () => {
        debugLog('plotly_transitioninterrupted')
        emit('transition-interrupted')
      })
    }
  }
}

watch(rootRef, async () => {
  debugLog('watch rootRef', rootRef.value)
  setDirty()
})

watch(props, async () => {
  debugLog('watch props', props)
  setDirty()
})
</script>

<template>
  <div ref="rootRef" />
</template>

<style scoped></style>
