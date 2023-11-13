import renderService from "@/core/services/render.service";
import { BaseScreen } from "@/core/component/base-screen.component";

import template from './not-found.template.html';
import styles from './not-found.module.scss';

export class NotFound extends BaseScreen {
    constructor() {
        super({title: 'Not found - Red Bank | Vanila JS'});
    }

    render() {
        const element = renderService.htmlToElement(template, [], styles);
        return element;
    }
}