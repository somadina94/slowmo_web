import { TextDecoder, TextEncoder } from "util";
import "@testing-library/jest-dom";

Object.assign(globalThis, { TextEncoder, TextDecoder });

class MemoryStorage {
  store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

Object.defineProperty(window, "localStorage", { value: new MemoryStorage() });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {
      return undefined;
    },
    removeListener() {
      return undefined;
    },
    addEventListener() {
      return undefined;
    },
    removeEventListener() {
      return undefined;
    },
    dispatchEvent() {
      return false;
    },
  }),
});

class ResizeObserverStub {
  observe() {
    return undefined;
  }
  unobserve() {
    return undefined;
  }
  disconnect() {
    return undefined;
  }
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub });

if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {
    return undefined;
  };
}

if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:mock";
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => undefined;
}

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  Toaster: () => null,
}));
