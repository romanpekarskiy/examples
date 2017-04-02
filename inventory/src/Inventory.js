class Inventory {
    constructor() {
        this.inventorySlots = [];
        this.equipmentSlots = [];

        // вообще ячейки можно добавлять динамически, предположим можно сделать инвертарь для 4х рукого и 2х голового персонажа %)
        for (let i = 0; i < 16; i++) {
            this.inventorySlots.push(new InventorySlot());
        }

        this.equipmentSlots.push(new EquipmentSlot('body'));
        this.equipmentSlots.push(new EquipmentSlot('hand'));
        this.equipmentSlots.push(new EquipmentSlot('hand'));
    }

    sort(getValue) {
        quickSort(this.inventorySlots, 0, this.inventorySlots.length - 1,
            (slots, a, b) => {
                if (slots[a].itemCollection) {
                    this.swapSlots(slots[a], slots[b]);
                } else {
                    this.swapSlots(slots[b], slots[a]);
                }
            },getValue);

        this.update();
    }

    getEmptyInventorySlots() {
        return this.inventorySlots.filter(slot => {
            return slot.itemCollection == null;
        });
    }

    getEmptyEquipmentSlots(type) {
        return this.equipmentSlots.filter(slot => {
            return slot.itemCollection == null && slot.type == type;
        });
    }

    moveItemFromSlotToSlot(slotA, slotB) {
        var itemInSlotA = slotA.itemCollection;
        if(!itemInSlotA) return false;
        itemInSlotA = itemInSlotA.item;

        if (this.putItemInSlot(itemInSlotA, slotB)) {
            if(slotA.removeItem()){
                return true;
            }
        }

        return false;
    }

    moveAllItemsFromSlotToSlot(slotA, slotB) {
        var itemInSlotA = slotA.itemCollection;
        if(!itemInSlotA) return false;

        while(!slotA.isEmpty()){
            if(!this.moveItemFromSlotToSlot(slotA, slotB)) break;
        }
    }

    getEmptyInventorySlot() {
        var emptySlots = this.getEmptyInventorySlots();

        if (!emptySlots.length) return false;

        return emptySlots[0]
    }

    getSlotWithCollection(itemColletion){
        return this.inventorySlots.concat(this.equipmentSlots).filter(slot => {
            return slot.itemCollection == itemCollection;
        })[0];
    }

    hasItemCount(id, count) {
        var findedInventoryCollections = this.getInventoryItemCollections(id);
        var findedEquipmentCollections = this.getEquipmentItemCollections(id);

        var itemCount = findedInventoryCollections.reduce((ourCount, itemCollection) => {
            return ourCount + itemCollection.count;
        }, 0);

        itemCount = findedInventoryCollections.reduce((ourCount, itemCollection) => {
            return ourCount + itemCollection.count;
        }, itemCount);

        return itemCount >= count;
    }

    hasItem(id) {
        return this.hasItemCount(id,1);
    }

    equipItemToEmptySlot(itemCollection) {
        var emptySlot = this.getEmptyEquipmentSlots(itemCollection.item.equippable)[0];

        var slotWithItem = itemCollection.inventorySlot;

        if (emptySlot) {
            if (slotWithItem && this.swapSlots(slotWithItem, emptySlot)) {
                return true;
            }

            return this.putItemInSlot(itemCollection.item, emptySlot);
        }

        return false;
    }

    equipItem(itemCollection) {
        if (this.equipItemToEmptySlot(itemCollection)) {
            return true;
        }

        var slotWithItem = itemCollection.inventorySlot;
        var equipmentSlot = this.equipmentSlots.filter((slot) => {
            return slot.type == itemCollection.item.equippable && slot != slotWithItem;
        })[0];

        if(equipmentSlot){
            this.swapSlots(slotWithItem, equipmentSlot);
            return true;
        }

        return false;
    }

    getEquipmentItemCollections(id) {
        var findedCollections = [];

        this.equipmentSlots.map(slot => {
            if (slot.itemCollection && slot.itemCollection.item.id == id) {
                findedCollections.push(slot.itemCollection);
            }
        });

        return findedCollections;
    }

    getInventoryItemCollections(id) {
        var findedCollections = [];

        this.inventorySlots.map(slot => {
            if (slot.itemCollection && slot.itemCollection.item.id == id) {
                findedCollections.push(slot.itemCollection);
            }
        });

        return findedCollections;
    }

    putItemInSlot(item, targetSlot) {
        if (targetSlot) {
            if (targetSlot.itemCollection == null) {
                targetSlot.setCollection(new ItemCollection(item));
                this.update();

                return true;
            }

            if(targetSlot.type && targetSlot.type != item.equippable){
                return false;
            }

            if (targetSlot.itemCollection.addItem(item)) {
                this.update();

                return true;
            }

            return false;
        }

        return false;
    }

    putItem(item) {
        var emptyInventorySlot = this.getEmptyInventorySlot();
        var currentInventoryCollectionWithItem = this.getInventoryItemCollections(item.id).sort((collectionA, collectionB) => {
            return (collectionA.stacks > collectionB.stacks)? 1 : 0;
        })[0];
        var currentEquipmentCollectionWithItem = this.getEquipmentItemCollections(item.id).sort((collectionA, collectionB) => {
            return (collectionA.stacks > collectionB.stacks)? 1 : 0;
        })[0];

        if(item.quest){
            if(currentInventoryCollectionWithItem){
                if(!currentInventoryCollectionWithItem.isFull()){
                    currentInventoryCollectionWithItem.addItem();
                    this.update();
                    return true;
                }
                return false;
            }

            if(currentEquipmentCollectionWithItem){
                if(!currentEquipmentCollectionWithItem.isFull()){
                    currentEquipmentCollectionWithItem.addItem();
                    this.update();
                    return true;
                }
                return false;
            }

            if(emptyInventorySlot){
                emptyInventorySlot.setCollection(new ItemCollection(item));
                this.update();
            }

            return false;
        }

        if(currentEquipmentCollectionWithItem && !currentEquipmentCollectionWithItem.isFull()){
            currentEquipmentCollectionWithItem.addItem();
            this.update();
            return true;
        }

        if(currentInventoryCollectionWithItem && !currentInventoryCollectionWithItem.isFull()){
            currentInventoryCollectionWithItem.addItem();
            this.update();
            return true;
        }

        if(emptyInventorySlot){
            emptyInventorySlot.setCollection(new ItemCollection(item));
            this.update();
        }

        return false;
    }

    removeItem(id) {
        if (!this.hasItem(id)) return false;

        var currentInventoryCollectionWithItem = this.getInventoryItemCollections(id)[0];
        var currentEquipmentCollectionWithItem = this.getEquipmentItemCollections(id)[0];

        if(currentInventoryCollectionWithItem){
            currentEquipmentCollectionWithItem.removeItem();
            return true;
        }

        if(currentEquipmentCollectionWithItem){
            currentEquipmentCollectionWithItem.removeItem();
            return true;
        }

        return false;
    }

    removeItemFromSlot(slot, count) {
        if(slot.itemCollection.stacks == count){
            return this.clearSlot(slot);
        }
        if(slot.itemCollection.stacks < count){
            return false
        }
        for(let times = 0; times< count; times++){
            slot.removeItem();
        }
        return true;
    }

    clearSlot(slot) {
        slot.setCollection(null);
        this.update();
        return true;
    }

    removeItemCount(id, _count) {
        var count = (typeof _count == "number")? _count: 1;
        if (!this.hasItemCount(id, count)) return false;

        for(let time = 0; time < count; time++){
            this.removeItem(id);
        }
    }

    swapSlots(fromSlot, toSlot) {
        console.log('fromSlot',fromSlot,'toSlot',toSlot);

        if (!fromSlot.itemCollection) return false;

        if (toSlot.itemCollection) {
            if (fromSlot instanceof EquipmentSlot && !fromSlot.canHandle(toSlot.itemCollection.item)) return false;
        }

        if (toSlot instanceof EquipmentSlot && !toSlot.canHandle(fromSlot.itemCollection.item)) return false;

        var tempCollection = fromSlot.itemCollection;
        fromSlot.setCollection(toSlot.itemCollection);
        toSlot.setCollection(tempCollection);

        this.update();

        return true;
    }

    update() {
        if (this.view) {
            this.view.render();
        }
    }
}