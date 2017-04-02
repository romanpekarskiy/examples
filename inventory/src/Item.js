class Item {
    constructor(itemMeta){
        this.meta = itemMeta;
        this.maxStacks = itemMeta.maxStacks || 1;
        this.price = itemMeta.price || 0;
        this.id = itemMeta.id;
        this.icon = itemMeta.icon || `icons/${this.id}.png`;

        this.quest = itemMeta.quest || false;
        this.usable = itemMeta.usable || false;
        this.name = itemMeta.name || 'без имени';

        this.consumeOnUse = true;
        if(itemMeta.consumeOnUse === false){
            this.consumeOnUse = false;
        }

        this.equippable = itemMeta.equippable || false;

        // способность предмета выкидываеться я рещил описать отдельно,
        // тк независимо от того, квестовый он или нет, лучше иметь возможность выбрасывать их
        //
        // например, взял я квест перебить 50 волков, с каждого волка сыпятся зубы, и мне надо набрать 50 зубов.
        // по ходу квеста мой персонаж оказался смертельно ранен, аптечек нет, я могу попросить аптечку у своего друга,
        // но от того что у меня забита последняя ячейка инвентаря зубами волка,
        // которые квестовые и я не могу их выбросить - я буду вынужден погибнуть глупой смертью.
        //
        // в теории при убивании волка может проходить проверка, есть ли у меня 50 зубов, и если нет - то дать мне зуб.

        this.droppable = true;

        if(itemMeta.droppable === false){
            this.droppable = false;
        }
    }
}