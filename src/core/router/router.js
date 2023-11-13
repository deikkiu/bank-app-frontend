import { NotFound } from "@/components/screens/notFound/not-found.component";
import { ROUTES } from "./routes.data";
import { Layout } from "@/components/layout/layout.component";
import { $R } from "../rquery/rquery.lib";

export class Router {
    #routes = ROUTES;
    #currentRoute = null;
    #layout = null;

    constructor() {
        this.#routes = ROUTES;
        this.#currentRoute = null;

        window.addEventListener('popstate', () => {
            this.#handleRouteChange();
        });

        this.#handleRouteChange();
        this.#handleLinks();
    }

    #handleLinks() {
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a');

            if(target) {
                event.preventDefault();

                this.navigate(target.href);
            }
        })
    }

    navigate(path) {
        if(path !== this.getCurrentPath()) {
            window.history.pushState({}, '', path);
            this.#handleRouteChange();
        }
    }

    getCurrentPath() {
        return window.location.pathname;
    }

    #handleRouteChange() {
        const path = this.getCurrentPath() || '/';
        let route = this.#routes.find((route) => route.path === path);

        if(!route) {
            route = {
                component: NotFound
            }
        }

        this.#currentRoute = route;
        this.#render();
    }

    #render() {
        const component = new this.#currentRoute.component().render();

        if(!this.#layout) {
            this.#layout = new Layout({
                router: this,
                children: component
            }).render();

            $R('#app').html('').append(this.#layout);
        } else {
            $R('.content').html('').append(component);
        }
    }
}