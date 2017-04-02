class ItemDatabase {
    constructor(itemsDatabase){
        this.database = {};

        itemsDatabase.forEach(itemMeta => {
            this.database[itemMeta.id] = itemMeta;
        });
    }
    createItem(id){
        if(!this.database[id]) return;

        return new Item(this.database[id]);
    }
}

var _itemDatabase = [
    {
        id: 'healing potion',
        name: 'Зелье здоровья',
        description: '',
        price: 10,
        maxStacks: 10,

        usable: true
    },
    {
        id: 'healing potion 2',
        name: 'Большое зелье здоровья',
        description: '',
        price: 20,
        maxStacks: 10,

        usable: true
    },
    {
        id: 'speed potion',
        name: 'Зелье скорости',
        description: '',
        price: 50,
        maxStacks: 10,

        usable: true
    },
    {
        id: 'simple sword',
        name: 'Меч',
        description: '',
        price: 200,

        equippable: 'hand'
    },
    {
        id: 'arrow',
        name: 'Стрела',
        description: '',
        price: 5,
        maxStacks: 30,

        equippable: 'hand'
    },
    {
        id: 'trowing dagger',
        name: 'Метательный кинжал',
        description: '',
        price: 15,
        maxStacks: 10,

        equippable: 'hand'
    },
    {
        id: 'bow',
        name: 'Лук',
        description: '',
        price: 150,

        equippable: 'hand'
    },
    {
        id: 'wooden shield',
        name: 'Деревянный Щит',
        description: '',
        price: 150,

        equippable: 'hand'
    },
    {
        id: 'armor',
        name: 'Броня',
        description: '',
        price: 450,

        equippable: 'body'
    },
    {
        id: 'trash 1',
        name: 'Рога и копыта',
        description: '',
        price: 5,
        maxStacks: 50
    },
    {
        id: 'prison key',
        name: 'Ржавый ключ',
        description: '',

        quest: true,
        droppable: false
    },
    {
        id: 'lantern',
        name: 'масляная лампа',
        description: '',

        quest: true,
        equippable: 'hand', // для экипировки лучше указывать слот, куда предмет должен браться
        droppable: false
    }
];

ItemDatabase = new ItemDatabase(_itemDatabase);