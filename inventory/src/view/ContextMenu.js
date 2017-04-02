class ContextMenu {
    constructor(){
        this.itemCollection = null;

        this.$el = document.createElement('div');
        this.$el.className = 'context-menu';

        this.$use = document.createElement('span');
        this.$use.textContent = 'использовать';

        this.$equip = document.createElement('span');
        this.$equip.textContent = 'взять';


        this.$drop = document.createElement('span');
        this.$drop.textContent = 'выкинуть';

        this.$price = document.createElement('em');
        this.$sell = document.createElement('span');
        this.$sell.textContent = 'продать';
        this.$sell.appendChild(this.$price);


        this.$priceAll = document.createElement('em');
        this.$sellAll = document.createElement('span');
        this.$sellAll.textContent = 'продать все';
        this.$sellAll.appendChild(this.$priceAll);

        this.$sellAll.onclick = () => {
            if(this.itemCollection){
                while (this.itemCollection.sell()){

                }
                this.hide();

                inventoryView.render();
            }
        };

        this.$sell.onclick = () => {
            if(this.itemCollection){
                this.itemCollection.sell();
                this.hide();

                inventoryView.render();
            }
        };
        this.$drop.onclick = () => {
            console.log('drop');
            if(this.itemCollection){
                this.itemCollection.drop();
                this.hide();

                inventoryView.render();
            }
        };
        this.$use.onclick = () => {
            if(this.itemCollection){
                this.itemCollection.use();
                this.hide();

                inventoryView.render();
            }
        };
        this.$equip.onclick = () => {
            if(this.itemCollection){
                this.itemCollection.equip(inventory);
                this.hide();
                inventoryView.render();

            }
        };

        this.$el.onmouseleave = () => {
            this.hide();
        };
    }

    setPosition(e){
        this.$el.style.left = e.pageX - 3 + 'px';
        this.$el.style.top = e.pageY - 3 + 'px';
    }

    hide(){
        if(this.$el.parentNode){
            this.$el.parentNode.removeChild(this.$el);
        }
    }

    show(itemCollection){
        this.itemCollection = itemCollection;

        this.$el.innerHTML = '';

        var options = itemCollection.getOptions();
        if(options.use){
            this.$el.appendChild(this.$use);
        }
        if(options.equip){
            this.$el.appendChild(this.$equip);
        }
        if(options.sell){
            this.$el.appendChild(this.$sell);
            this.$price.textContent = options.price;

            if(this.itemCollection.stacks > 1){
                this.$el.appendChild(this.$sellAll);
                this.$priceAll.textContent = options.fullprice;
            }
        }
        if(options.drop){
            this.$el.appendChild(this.$drop);
        }

        document.body.appendChild(this.$el);
    }
}
