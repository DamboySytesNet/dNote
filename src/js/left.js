"use strict";
;
const Left = {
    search: {
        shown: false,
        toggle() {
            this.shown = !this.shown;
            if (this.shown) {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(0%)';
                $id('left-actions-searchBar-input').focus();
            }
            else {
                $id('left-actions-searchBar')
                    .style.transform = 'translateY(-105%)';
                $id('left-actions-searchBar-input').blur();
                $id('left-actions-searchBar-input').value = '';
            }
        },
        clear() {
            $id('left-actions-searchBar-input').value = '';
            $id('left-actions-searchBar-input').focus();
        }
    },
    assignHandlers() {
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
};
