export declare function createCustomEvent(eventName: string, options: any): CustomEvent;

export declare class HTMLCustomElement extends HTMLElement {
  static define(tagName: any, klass: any): void;
  disconnectedCallback(): void;
  renderWith(template?: any, css?: any): Promise<any>;
  detectChanges(): void;
}
