import 'document-register-element';
export declare class HTMLCustomElement extends HTMLElement {
    static define(tagName: any, klass: any): void;
    disconnectedCallback(): void;
    render(): Promise<any>;
}
