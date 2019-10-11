interface ICategories {
    stack: Category[];

    init(data: any): void;
    remove(category: Category): void;
};

const Categories: ICategories = {
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
    },

    remove(searchedCategory) {
        this.stack.find((category, index) => {
            if (searchedCategory === category) {
                category.prepRemove();
                this.stack.splice(index, 1);
                Main.saveContent();
                return true;
            }
            return false;
        });
    }
}