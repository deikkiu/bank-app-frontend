import ChildComponent from '@/core/component/child.component';
import renderService from '@/core/services/render.service';

import template from './contacts.template.html';
import styles from './contacts.module.scss';
import { TransferField } from './transfer-field/transfer-field.component';
import { Heading } from '@/components/ui/heading/heading.component';
import { Store } from '@/core/store/store';
import { UserService } from '@/api/user.service';
import { $R } from '@/core/rquery/rquery.lib';
import { UserItem } from '@/components/ui/user-item/user-item.component';
import { formatCardNumberWithDashes } from '@/utils/format/format-card-number';
import { LOADER_SELECTOR, Loader } from '@/components/ui/loader/loader.component';

export class Contacts extends ChildComponent {

    constructor() {
        super();

        this.store = Store.getInstance();
        this.userService = new UserService();
    }

    fetchData() {
        this.userService.getAll(null, (data) => {
            if(!data) return;

            this.element.querySelector(LOADER_SELECTOR).remove();
            data.forEach((user) => {
                $R(this.element)
                    .find('#contacts-list')
                    .append(
                        new UserItem(user, true, () => {
                            $R('input[name="card-number"]').value(formatCardNumberWithDashes(user.card.number));
                        })
                    .render());


                    $R(this.element)
                    .find('#contacts-list')
                    .findAll('button')
                    .forEach(contactsElement => {
                        contactsElement.addClass('fade-in');
                    });
            });

        });
    }

    render() {
        this.element = renderService.htmlToElement(template, [new Heading('Transfer money'), TransferField], styles);

        if(this.store.state.user) {
            $R(this.element)
                .find('#contacts-list')
                .html(new Loader().render().outerHTML);

            setTimeout(() => this.fetchData(), 500);
        }

        return this.element;
    }
}