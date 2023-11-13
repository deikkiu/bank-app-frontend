import { $R } from "../rquery/rquery.lib";
import styles from '@/components/layout/notification/notification.module.scss';

/**
 * NotificationService is a utility class to handle displaying notifications
*/

export class NotificationService {
    #timeout;

    constructor() {
        this.#timeout = null;
    }

    #setTimeout(callback, duration) {
        if(this.#timeout) {
            clearTimeout(this.#timeout);
        }

        this.#timeout = setTimeout(callback, duration);
    }

    /**
     *
     * @param {string} message The message to be displayed in the notification
     * @param {('success'|'error')} type The type of the notification, only 'success' or 'error' are accepted
     */
    show(type, message) {
        if(!['success', 'error'].includes(type)) {
            throw new Error('The type can be only "success" or "error"!');
        }

        const classNames = {
            success: styles.success,
            error: styles.error
        }

        const notificationElement = $R('#notification');
        const className = classNames[type];

        notificationElement.text(message).addClass(className);

        this.#setTimeout(() => {
            notificationElement.removeClass(className);
        }, 5000);
    }
}