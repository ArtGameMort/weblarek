import { Component } from '../base/Component';

export class Page extends Component<{}> {
    constructor(container: HTMLElement) {
        super(container);
    }

    lockScroll(): void {
        this.container.classList.add('page_no-scroll');
    }

    unlockScroll(): void {
        this.container.classList.remove('page_no-scroll');
    }
}