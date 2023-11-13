import ChildComponent from '@/core/component/child.component';
import renderService from '@/core/services/render.service';

import template from './transfer-field.template.html';
import styles from './transfer-field.module.scss';
import { CardService } from '@/api/card.service';
import { Store } from '@/core/store/store';
import { NotificationService } from '@/core/services/notification.service';
import { $R } from '@/core/rquery/rquery.lib';
import validationService from '@/core/services/validation.service';
import { BALANCE_UPDATED, TRANSACTION_COMPLETED } from '@/constants/event.constants';
import { Field } from '@/components/ui/field/field.component';
import { Button } from '@/components/ui/button/button.component';

export class TransferField extends ChildComponent {

    constructor() {
        super();

        this.cardService = new CardService();
        this.store = Store.getInstance();
        this.notificationService = new NotificationService();
    }

    handleTransfer = (event) => {
        event.preventDefault();

        if(!this.store.state.user) {
            this.notificationService.show('error', 'You need to be login!');
        }

        $R(event.target).text('Sending...').attr('disabled', true);

        const inputElement = $R(this.element).find('input[name="card-number"]');
        const toCardNumber = inputElement.value().replaceAll('-', '');

        const reset = () => {
            $R(event.target).removeAttr('disabled').text('Send');
        }

        const amountElement = $R(this.element).find('input[name="transfer-amount"]');
        const amount = amountElement.value();

        if(!amount) {
            validationService.showError($R(this.element).find('#transfer-amount label'), 2000);
            reset();
            return;
        }

        if(!toCardNumber) {
            validationService.showError($R(this.element).find('#transfer-card label'), 2000);
            reset();
            return;
        }

        this.cardService.transfer({ amount, toCardNumber}, () => {
            inputElement.value('');
            amountElement.value('');

            document.dispatchEvent(new Event(TRANSACTION_COMPLETED));
            document.dispatchEvent(new Event(BALANCE_UPDATED));

            reset();
        })
    }

    render() {
        this.element = renderService.htmlToElement(template, [
            new Field({
                placeholder: 'xxxx-xxxx-xxxx-xxxx',
                name: 'card-number',
                variant: 'credit-card'
            }),
            new Button({
                children: 'Send',
                variant: 'purple',
                onClick: this.handleTransfer
            })
        ], styles);

        $R(this.element).find('#transfer-amount').append(
                new Field({
                    placeholder: 'Enter amount:',
                    type: 'number',
                    name: 'transfer-amount',
                }).render()
            )

        return this.element;
    }
}