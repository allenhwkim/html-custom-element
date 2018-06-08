import 'document-register-element';
export declare class HTMLCustomElement extends HTMLElement {
    template: any;
    css: any;
    styleEl: any;
    static define(tagName: any, klass: any): void;
    constructor(self: any);
    init(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): Promise<{}>;
}
