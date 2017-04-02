class InventoryView {
    constructor(inventory){
        this.inventory = inventory;
        this.inventory.view = this;
        this.$el = document.createElement('div');
        this.$el.className = 'inventory-window';

        this.$inventory = document.createElement('div');
        this.$inventory.className = 'inventory';
        this.$equipment = document.createElement('div');
        this.$equipment.className = 'equipment';

        this.$buttons = document.createElement('div');
        this.$buttons.className = 'buttons';

        this.$sortByType = document.createElement('button');
        this.$sortByType.textContent = 'по типу';
        this.$sortByPrice = document.createElement('button');
        this.$sortByPrice.textContent = 'по цене';

        this.$sortByType.onclick = () => {
            return this.inventory.sort((slot) => {
                if (!slot.itemCollection) return Infinity;

                let options = slot.itemCollection.getOptions();
                let cost = 0;

                if (options.equip) {
                    cost += 100;
                }

                if (options.use) {
                    cost += 10;
                }

                if (options.quest) {
                    cost += 1;
                }

                return -cost;
            });
        };

        this.$sortByPrice.onclick = () => {
            return this.inventory.sort((slot) => {
                if (!slot.itemCollection) return Infinity;

                let options = slot.itemCollection.getOptions();
                let cost = 0;
                if (options.fullprice) {
                    cost = options.fullprice;
                }

                return -cost;
            });
        };

        this.$buttons.appendChild(this.$sortByType);
        this.$buttons.appendChild(this.$sortByPrice);


        this.$el.appendChild(this.$equipment);
        this.$el.appendChild(this.$inventory);
        this.$el.appendChild(this.$buttons);
    }

    render(){
        this.$equipment.innerHTML = '';
        this.$inventory.innerHTML = '';

        this.inventory.inventorySlots.map(slot => {
            var slotView = new InventorySlotView(slot);
            this.$inventory.appendChild(slotView.$el);
            slotView.render();
        });

        this.inventory.equipmentSlots.map(slot => {
            var slotView = new InventorySlotView(slot);
            var name = document.createElement('em');
            name.textContent = slot.type;
            this.$equipment.appendChild(name);
            this.$equipment.appendChild(slotView.$el);
            slotView.render();
        });
    }
}