import { ICategories } from './interfaces/ICategories';

import { Category } from './dataTypes/Category';
import { Note } from './dataTypes/Note';
import { UserSettings } from './dataTypes/UserSettings';

import { Left } from './Left';
import { Main } from './Main';

import { $id } from './utils';

export const Categories: ICategories = {
    stack: [],

    init(categories) {
        // For every category from file
        for (let category of categories) {
            // Parse its notes
            let parsedNotes = []
            for (let note of category.notes) {
                parsedNotes.push(
                    new Note(
                        note.id,
                        note.name,
                        note.content,
                        note.pinned,
                        note.protection,
                        note.tags,
                        note.dateCreated,
                        note.dateModified
                    )
                );
            }

            // Push category to stack
            this.stack.push(
                new Category(
                    category.id,
                    category.name,
                    category.color,
                    parsedNotes
                )
            );
        }

        this.checkState();
        this.sort();
    },

    sort() {
        // Sort stack
        this.stack.sort((a: Category, b: Category) => {
            // Check if sorting asc or desc
            let sign = UserSettings.general.sort.asc === true ? 1 : -1;

            // Sort by category name or by ID (creation order)
            if (UserSettings.general.sort.type === 1)
                return a.name.localeCompare(b.name) * sign;
            else
                return (a.id - b.id) * sign;
        });
    },

    rebuild() {
        // Clear content
        Left.categories.clear();

        // Append categories from stack
        for (let category of this.stack)
            $id('left-categories').appendChild(category.leftHTML);
    },

    add(category) {
        // Add
        this.stack.push(category);

        // Select
        category.choose();

        // Check
        this.checkState();
    },

    remove(searchedCategory) {
        // Find index of search category
        const index = this.stack.findIndex((category: Category) => {
            return searchedCategory === category;
        });

        // If found
        if (index > -1) {
            this.stack[index].prepRemove();
            this.stack.splice(index, 1);

            this.checkState();

            Main.saveContent();
        }
    },

    checkState() {
        if (this.stack.length === 0)
            $id('left-noCategories').style.display = 'block';
        else
            $id('left-noCategories').style.display = 'none';
    }
}
