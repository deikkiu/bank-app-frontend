import renderService from "@/core/services/render.service";
import { BaseScreen } from "@/core/component/base-screen.component";

import template from './about.template.html';
import styles from './about.module.scss';

export class About extends BaseScreen {
    constructor() {
        super({title: 'About - Red Bank | Vanila JS'});
    }

    render() {
        const element = renderService.htmlToElement(template, [], styles);
        return element;
    }
}