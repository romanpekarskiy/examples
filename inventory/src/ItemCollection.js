class ItemCollection {
    constructor(item){
        this.item = item;
        this.inventorySlot = null;
        this.maxStacks = item.maxStacks;
        this.stacks = 1;
    }

    isFull(){
        return this.stacks == this.maxStacks;
    }

    getOptions(){
        var options = {
            sell: false,
            equip: false,
            use: false,
            drop: false,

            price: this.item.price,
            fullprice: this.item.price * this.stacks
        };

        if(this.item.equippable){
            options.equip = true;
        }

        if(this.item.usable){
            options.use = true;
        }

        if(this.item.price != 0){
            options.sell = true;
        }

        if(this.item.quest){
            options.sell = false;
            options.quest = true;
        }

        if(!this.item.quest){
            options.drop = true;
        }

        return options;
    }

    drop(){
        if(this.getOptions().drop){
            return this.removeItem();
        }

        return false;
    }

    sell(){
        if(this.getOptions().sell){
            return this.drop();
        }

        return false;
    }

    use(){
        if(this.getOptions().use){
            if(this.item.consumeOnUse){
                if(!this.removeItem()){
                    return false;
                }
            }
            // trigger item effects

            return true;
        }

        return false;
    }

    // поидее тут должен быть персонаж, но это уже за рамками тз
    equip(targetInventory){
        if(this.getOptions().equip){
            if(targetInventory.equipItem(this)){
                return true;
            }
        }

        return false;
    }

    addItem(item){
        if(this.isFull()){
            return false;
        }

        if(item && this.item.id != item.id){
            return false;
        }

        this.stacks++;

        return true;
    }

    removeItem(){
        console.log('collection remove',this.stacks);
        if(this.stacks == 1){
            return this.inventorySlot.removeItem();
        }

        this.stacks--;

        return true;
    }
}