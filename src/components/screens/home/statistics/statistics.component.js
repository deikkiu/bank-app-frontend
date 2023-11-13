import ChildComponent from '@/core/component/child.component';
import renderService from '@/core/services/render.service';

import template from './statistics.template.html';
import styles from './statistics.module.scss';
import { Heading } from '@/components/ui/heading/heading.component';
import { Store } from '@/core/store/store';
import { StatisticService } from '@/api/statistic.service';
import { $R } from '@/core/rquery/rquery.lib';
import { formatToCurrency } from '@/utils/format/format-to-currency';
import { TRANSACTION_COMPLETED } from '@/constants/event.constants';
import { LOADER_SELECTOR, Loader } from '@/components/ui/loader/loader.component';
import { StatisticsItem } from './statistic-item/statistic-item.component';
import { CircleChart } from './circle-chart/circle-chart.component';

export class Statistics extends ChildComponent {

    constructor() {
        super();

        this.store = Store.getInstance();
        this.statisticService = new StatisticService();

        this.element = renderService.htmlToElement(template, [
            new Heading('Statistics')
        ], styles);

        this.#addListeners();
    }

    #addListeners() {
        document.addEventListener(TRANSACTION_COMPLETED, this.#onTransactionCompleted);
    }

    #removeListeners() {
        document.removeEventListener(TRANSACTION_COMPLETED, this.#onTransactionCompleted);
    }

    #onTransactionCompleted = () => {
        this.fetchData();
    }

    destroy() {
        this.#removeListeners();
    }

    renderChart(income, expense) {
        const total = income + expense;
        let incomePercent = (income * 100) / total;
        let expensePercent = 100 - incomePercent;

        if(income && !expense) {
            incomePercent = 100;
            expensePercent = 0.1;
        }

        if(!income && expense) {
            expensePercent = 100;
            incomePercent = 0.1;
        }

        return new CircleChart(incomePercent, expensePercent).render();
    }

    fetchData() {
        this.statisticService.main((data) => {
            if(!data) return;

            const loaderElement = this.element.querySelector(LOADER_SELECTOR);
            if(loaderElement) loaderElement.remove();

            const statisticsItemsElement = $R(this.element).find('#statistics-items');
            statisticsItemsElement.text('');

            const circleChatElement = $R(this.element).find('#circle-chart');
            circleChatElement.text('');

            for (const statistic of data) {
                const variant = statistic.label === 'Income' ? 'green' : 'purple';
                statisticsItemsElement.append(new StatisticsItem(statistic.label + ':', formatToCurrency(statistic.value || 0), variant).render());
            }

            circleChatElement.append(this.renderChart(data[0].value, data[1].value));
        });
    }

    render() {
        if(this.store.state.user) {
            $R(this.element)
                .find('#statistics-items')
                .html(new Loader().render().outerHTML);

            setTimeout(() => this.fetchData(), 500);
        }

        return this.element;
    }
}