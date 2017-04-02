class InventorySlot {
    constructor(){
        this.itemCollection = null;
    }

    isEmpty(){
        return this.itemCollection == null;
    }

    isFull(){
        return this.itemCollection.isFull();
    }

    setCollection(itemCollection){
        this.itemCollection = itemCollection;
        if(this.itemCollection){
            this.itemCollection.inventorySlot = this;
        }
    }

    addItem(item){
        return this.itemCollection.addItem(item);
    }

    removeItem(){
        if(!this.itemCollection) return false;

        if(this.itemCollection.stacks <= 1){
            this.setCollection(null);
            return true;
        }

        return this.itemCollection.removeItem();
    }
}