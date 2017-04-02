class ItemCollectionView {
    constructor(itemCollection){
        this.itemCollection = itemCollection;

        this.$el = document.createElement('div');
        this.$el.model = this.itemCollection;

        this.$el.setAttribute('data-tooltip',this.itemCollection.item.name);

        this.$icon = document.createElement('div');
        this.$counter = document.createElement('div');
        this.$el.appendChild(this.$icon);
        this.$el.appendChild(this.$counter);

        this.$el.className = 'item-collection';
        this.$icon.className = 'item-icon';
        this.$counter.className = 'item-counter';

        this.$el.view = this;
        this.render();
    }

    render(){
        this.$icon.style['background-image'] = `url('${this.itemCollection.item.icon}')`;
        this.$counter.textContent = this.itemCollection.stacks;

        if(this.itemCollection.item.quest){
            this.$el.className = 'item-collection quest';
        }

        if(this.itemCollection.item.maxStacks == 1){
            this.$counter.className = 'item-counter hidden';
        } else {
            this.$counter.className = 'item-counter';
        }
    }
}