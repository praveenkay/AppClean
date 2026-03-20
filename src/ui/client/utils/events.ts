/**
 * Simple Event Emitter for Reactive State Management
 * Provides publish/subscribe pattern for state changes
 */

export type EventListener<T = any> = (data: T) => void;

export class EventEmitter<T = any> {
  private listeners: EventListener<T>[] = [];

  on(listener: EventListener<T>): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  once(listener: EventListener<T>): void {
    const unsubscribe = this.on((data: T) => {
      listener(data);
      unsubscribe();
    });
  }

  emit(data: T): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    });
  }

  clear(): void {
    this.listeners = [];
  }

  getListenerCount(): number {
    return this.listeners.length;
  }
}

/**
 * Base Store class with reactive updates
 */
export abstract class Store<T> {
  protected state: T;
  protected stateChanged = new EventEmitter<T>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.stateChanged.emit(this.state);
  }

  subscribe(listener: EventListener<T>): () => void {
    return this.stateChanged.on(listener);
  }

  protected updateState(updater: (state: T) => T): void {
    this.state = updater(this.state);
    this.stateChanged.emit(this.state);
  }
}
