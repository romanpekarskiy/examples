class InventorySlotView {
    constructor(inventorySlot){
        this.inventorySlot = inventorySlot;

        this.$el = document.createElement('div');
        this.$el.className = 'inventory-slot';

        this.$el.view = this;
    }

    render(){
        this.$el.innerHTML = '';

        if(this.inventorySlot.itemCollection){
            var collectionView = new ItemCollectionView(this.inventorySlot.itemCollection);
            this.$el.appendChild(collectionView.$el);
            collectionView.render();
        }
    }
}