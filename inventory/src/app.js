var inventory = new Inventory();
var inventoryView = new InventoryView(inventory);

document.body.appendChild(inventoryView.$el);
inventoryView.render();

var selectedItem = null;

document.body.onmousedown = (e) => {
    var currentEl = e.path.find(el => {
        if (el.view) {
            return el.view;
        }
    });
    if (!currentEl) return;

    selectedItem = currentEl.view;
};

var contextMenu = new ContextMenu();
var itemsList = new ItemsList();

document.addEventListener("contextmenu", function (e) {
    contextMenu.hide();

    // тут я просто получаю объект вьюхи из DOM элемента
    var currentEl = e.path.find(el => {
        if (el.view) {
            return el.view;
        }
    });
    if (!currentEl) return;

    var currentView = currentEl.view;

    if (currentView instanceof ItemCollectionView) {
        contextMenu.show(currentView.itemCollection);
        contextMenu.setPosition(e);
        e.preventDefault();
    }
});

document.body.onmouseup = (e) => {
    var currentEl = e.path.find(el => {
        if (el.view) {
            return el.view;
        }
    });
    if (!currentEl) return;

    var currentView = currentEl.view;

    if (selectedItem instanceof ItemCollectionView) {
        let selectedSlot = selectedItem.itemCollection.inventorySlot;

        if (currentView instanceof InventorySlotView) {
            let targetSlot = currentView.inventorySlot;

            if (e.ctrlKey) {
                inventory.moveItemFromSlotToSlot(selectedSlot,targetSlot);

                inventoryView.render();
                return;
            }

            inventory.swapSlots(selectedSlot, targetSlot);

            return;
        }


        if (currentView instanceof ItemCollectionView) {
            let targetSlot = currentView.itemCollection.inventorySlot;
            if (currentView.itemCollection.item.id == selectedItem.itemCollection.item.id) {

                if (currentView.itemCollection == selectedItem.itemCollection){
                    return
                }

                let targetSlot = currentView.itemCollection.inventorySlot;

                if (e.ctrlKey) {
                    inventory.moveItemFromSlotToSlot(selectedSlot,targetSlot);
                    inventoryView.render();
                    return;
                }

                console.log('inventory.moveAllItemsFromSlotToSlot');
                inventory.moveAllItemsFromSlotToSlot(selectedSlot,targetSlot);
                inventoryView.render();
                return;
            }

            inventory.swapSlots(selectedSlot, targetSlot);
        }
    }

};