import ChildComponent from '@/core/component/child.component';
import renderService from '@/core/services/render.service';

import template from './actions.template.html';
import styles from './actions.module.scss';
import { Field } from '@/components/ui/field/field.component';
import { CardService } from '@/api/card.service';
import { Store } from '@/core/store/store';
import { NotificationService } from '@/core/services/notification.service';
import { $R } from '@/core/rquery/rquery.lib';
import { Button } from '@/components/ui/button/button.component';
import validationService from '@/core/services/validation.service';
import { BALANCE_UPDATED } from '@/constants/event.constants';

export class Actions extends ChildComponent {

    constructor() {
        super();

        this.cardService = new CardService();
        this.store = Store.getInstance();
        this.notificationService = new NotificationService();
    }

    /**
     *
     * @param {Event} event - The event object from the button click event.
     * @param {'top-up'|'withdrawal'} type The type of the transition.
     */
    updateBalance(event, type) {
        event.preventDefault();

        if(!this.store.state.user) {
            this.notificationService.show('error', 'You need to be login!');
        }

        $R(event.target).text('Sending...').attr('disabled', true);

        const inputElement = $R(this.element).find('input');
        const amount = inputElement.value();


        if(!amount) {
            validationService.showError($R(this.element).find('label'));
            return;
        }

        this.cardService.updateBalance(amount, type, () => {
            inputElement.value('');

            const balanceUpdatedEvent = new Event(BALANCE_UPDATED);
            document.dispatchEvent(balanceUpdatedEvent);
        });

        $R(event.target).removeAttr('disabled').text(type);
    }

    render() {
        this.element = renderService.htmlToElement(template, [
            new Field({
                placeholder: 'Enter amount:',
                type: 'number',
                name: 'amount',
            })
        ], styles);

        $R(this.element)
            .find('#action-buttons')
            .append(
                new Button({
                    children: 'Top-up',
                    onClick: e => this.updateBalance(e, 'top-up'),
                    variant: 'green'
                }).render())
            .append(
                new Button({
                    children: 'Withdrawal',
                    onClick: e => this.updateBalance(e, 'withdrawal'),
                    variant: 'purple'
                }).render());

        return this.element;
    }
}