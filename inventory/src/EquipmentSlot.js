class EquipmentSlot extends InventorySlot{
    constructor(type){
        super();
        this.type = type;
    }

    canHandle(item){
        return this.type == item.equippable;
    }
}