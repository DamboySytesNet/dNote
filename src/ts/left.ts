interface ILeft {
    search: ILeftSearch;

    assignHandlers(): void;
    keyHandler(ev: KeyboardEvent): void
};

interface ILeftSearch {
    shown: boolean;

    toggle(): void;
    clear(): void;
}

const Left: ILeft = {
    search: {
        shown: false,

        toggle(): void {
            this.shown = !this.shown;

            if (this.shown) {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(0%)';

                $id('left-actions-searchBar-input').focus();
            } else {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(-105%)';

                $id('left-actions-searchBar-input').blur();
                (<HTMLInputElement>$id('left-actions-searchBar-input')).value = '';
            }
        },

        clear() {
            (<HTMLInputElement>$id('left-actions-searchBar-input')).value = '';
            $id('left-actions-searchBar-input').focus();
        }
    },

    assignHandlers(): void {
        // actions
        $id('left-actions-search')
            .addEventListener('click', () => Left.search.toggle());

        // search
        $id('left-actions-searchBar-clear')
            .addEventListener('click', () => Left.search.clear());

        $id('left-actions-searchBar-close')
            .addEventListener('click', () => Left.search.toggle());
    },

    keyHandler(ev) {
        if (ev.key === 'Escape') {
            //Toggle search
            if (this.search.shown)
                this.search.toggle();
        }
    }
}