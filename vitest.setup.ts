import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement ResizeObserver; LikertSlider observes its own
// layout to position tick marks, which is irrelevant to component tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
