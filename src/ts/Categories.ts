import { ICategories } from './interfaces/ICategories';

import { Category } from './dataTypes/Category';
import { Note } from './dataTypes/Note';
import { UserSettings } from './dataTypes/UserSettings';

import { Main } from './Main';

import { $id } from './utils';

export const Categories: ICategories = {
    stack: [],

    init(categories) {
        // For every category from file
        const categoriesLength = categories.length;
        for (let i = 0; i < categoriesLength; i++) {
            // Parse its notes
            let parsedNotes = []
            const notesLength = categories[i].notes.length;
            for (let j = 0; j < notesLength; j++) {
                parsedNotes.push(
                    new Note(
                        categories[i].notes[j].id,
                        categories[i].notes[j].name,
                        categories[i].notes[j].content,
                        categories[i].notes[j].pinned,
                        categories[i].notes[j].protection,
                        categories[i].notes[j].tags,
                        categories[i].notes[j].dateCreated,
                        categories[i].notes[j].dateModified
                    )
                );
            }

            // Parse it into js class object
            this.stack.push(
                new Category(
                    categories[i].id,
                    categories[i].name,
                    categories[i].color,
                    parsedNotes
                )
            );
        }

        this.sort();
    },

    sort() {
        this.stack.sort((a: Category, b: Category) => {
            let sign = UserSettings.general.sort.asc === true ? 1 : -1;

            if (UserSettings.general.sort.type === 1) {
                return a.name.localeCompare(b.name) * sign;
            } else {
                return (a.id - b.id) * sign;
            }
        });
    },

    rebuild() {
        $id('left-categories').innerHTML = '';
        const limit = this.stack.length;
        for (let i = 0; i < limit; i++)
            $id('left-categories').appendChild(this.stack[i].leftHTML);
    },

    add(category: Category) {
        this.stack.push(category);

        this.checkState();
    },

    remove(searchedCategory) {
        this.stack.find((category: Category, index: number) => {
            if (searchedCategory === category) {
                category.prepRemove();
                this.stack.splice(index, 1);
                Main.saveContent();
                return true;
            }
            return false;
        });

        this.checkState();
    },

    checkState() {
        if (this.stack.length === 0)
            $id('left-noCategories').style.display = 'block';
        else
            $id('left-noCategories').style.display = 'none';
    }
}
