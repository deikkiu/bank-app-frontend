import { RedQuery } from '@/core/red-query/red-query.lib';
import { NotificationService } from '@/core/services/notification.service';
import { Store } from '@/core/store/store';

export class CardService {
	#BASE_URL = '/cards';

	constructor() {
		this.store = Store.getInstance();
		this.notificationService = new NotificationService();
	}

	byUser(onSuccess) {
		return RedQuery({
			path: `${this.#BASE_URL}/by-user`,
			onSuccess
		});
	}

	/**
	 * Updates the user's balance with the specified amount and type.
	 *
	 * @param {number} amount - The amount to be added or withdrawn from the user's balance.
	 * @param {'top-up' | 'withdrawal'} type - The type of the transaction, either "top-up" or "withdrawal".
	 * @param {function} onSuccess - The callback function to be executed when the balance update is successful.
	 * @returns {Promise} A Promise object that resolves to the response from the API.
	 */
	updateBalance(amount, type, onSuccess) {
		return RedQuery({
			path: `${this.#BASE_URL}/balance/${type}`,
			method: 'PATCH',
			body: { amount: +amount },
			onSuccess: () => {
				this.notificationService.show(
					'success',
					'Balance successfully changed!'
				);
				onSuccess();
			}
		});
	}

	/**
	 * Transfers money between two card numbers.
	 *
	 * @function
	 * @param {Object} body The transfer details.
	 * @param {number} body.amount The amount to be transferred.
	 * @param {string} body.toCardNumber The recipient's card number.
	 * @param {function} onSuccess The callback to be executed when the transfer is successful.
	 * @returns {Promise} A Promise that resolves with the RedQuery response.
	 */
	transfer({ amount, toCardNumber }, onSuccess) {
		return RedQuery({
			path: `${this.#BASE_URL}/transfer-money`,
			method: 'PATCH',
			body: {
				amount: +amount,
				fromCardNumber: this.store.state.user.card.number,
				toCardNumber
			},
			onSuccess: () => {
				this.notificationService.show(
					'success',
					'Transfer successfully completed!'
				);
				onSuccess();
			}
		});
	}
}