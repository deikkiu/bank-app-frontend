import ChildComponent from '@/core/component/child.component';
import renderService from '@/core/services/render.service';

import template from './auth-required-message.template.html';
import styles from './auth-required-message.module.scss';

export class AuthRequiredMessage extends ChildComponent {
    render() {
        this.element = renderService.htmlToElement(template, [], styles);
        return this.element;
    }
}