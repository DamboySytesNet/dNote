interface IContent {
    assignListeners(): void;
}

const Content: IContent = {


    assignListeners() {
        $id('main-actions-info').onclick = () => {
            NoteInfo.open(Left.notes.curr);
        }
        
        $id('main-actions-delete').onclick = () => {
            Left.notes.promptRemove(Left.notes.curr);
        }
    }
}