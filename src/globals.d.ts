// global.d.ts
export {};

declare global {
  interface Window {
    // These will only apply if not already in the DOM lib
    requestIdleCallback?(
      callback: (deadline: IdleDeadline) => void,
      options?: IdleRequestOptions
    ): number;

    cancelIdleCallback?(handle: number): void;
  }

  interface IdleDeadline {
    readonly didTimeout: boolean;
    timeRemaining(): DOMHighResTimeStamp;
  }

  interface IdleRequestOptions {
    timeout?: number;
  }
}
