"use strict";
const NoteInfo = {
    initialized: false,
    shown: false,
    allowClose: true,
    init() {
        // Assign listeners
        $id('noteInfo').addEventListener('click', () => {
            NoteInfo.checkClose();
        });
        $id('noteInfo-content').addEventListener('mousedown', () => {
            NoteInfo.allowClose = false;
        });
        $id('noteInfo-dialogButton-abort').addEventListener('click', () => {
            NoteInfo.close();
        });
    },
    open(el) {
        if (el === null)
            return;
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }
        this.fill(el);
        this.shown = true;
        $id('noteInfo').style.display = 'flex';
        setTimeout(() => {
            $id('noteInfo-content').style.opacity = '1';
            $id('noteInfo-content').style.transform = 'translateY(0px)';
        }, 100);
    },
    fill(el) {
        $id('noteInfo-name').innerHTML = el.name;
        $id('noteInfo-words').innerHTML = Left.notes.words.toString();
        $id('noteInfo-chars').innerHTML = Left.notes.chars.toString();
        $id('noteInfo-pinned').innerHTML = el.pinned ? 'Yes' : 'No';
        $id('noteInfo-protect').innerHTML = el.protection.active ? 'Yes' : 'No';
        $id('noteInfo-mDate').innerHTML = el.dateModified;
        $id('noteInfo-cDate').innerHTML = el.dateCreated;
        $id('noteInfo-tags').innerHTML = '';
        for (let tag of el.tags) {
            let parent = document.createElement('span');
            parent.onclick = () => {
                $id('left-notesSearch-input').value = tag;
                Left.search.applySearch();
                NoteInfo.close();
            };
            parent.innerHTML = tag;
            $id('noteInfo-tags').appendChild(parent);
        }
    },
    keyHandler(ev) {
        if (ev.key === 'Escape') {
            if (this.shown)
                this.close();
        }
    },
    checkClose() {
        if (this.allowClose)
            this.close();
        else
            this.allowClose = true;
    },
    clear() {
        $id('noteInfo-name').innerHTML = '';
        $id('noteInfo-words').innerHTML = '';
        $id('noteInfo-chars').innerHTML = '';
        $id('noteInfo-pinned').innerHTML = '';
        $id('noteInfo-protect').innerHTML = '';
        $id('noteInfo-mDate').innerHTML = '';
        $id('noteInfo-cDate').innerHTML = '';
        $id('noteInfo-tags').innerHTML = '';
    },
    close() {
        this.shown = false;
        this.clear();
        $id('noteInfo').style.display = 'none';
        $id('noteInfo-content').style.opacity = '0';
        $id('noteInfo-content').style.transform = 'translateY(-20px)';
    }
};
