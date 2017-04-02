class ItemView {
    constructor(item){
        this.item = item;
        this.$el = new ItemCollectionView(new ItemCollection(item)).$el;
        this.$el.view = 'item-template';
        this.$el.onclick = () => {
            inventory.putItem(ItemDatabase.createItem(this.item.id));
        }
    }
}