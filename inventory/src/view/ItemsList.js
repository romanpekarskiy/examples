class ItemsList {
    constructor(){
        this.$el = document.createElement('div');
        this.$el.className = 'items-list';

        for(var itemId in ItemDatabase.database){
            this.$el.appendChild(new ItemView(ItemDatabase.createItem(itemId)).$el);
        }

        document.body.appendChild(this.$el);
    }
}
