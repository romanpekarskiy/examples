function quickSort(items, left, right, swapMethod, getValueMethod) {
    function checkAndSwap(items, a, b) {
        if (getValueMethod(items[a]) > getValueMethod(items[b])) {
            swapMethod(items, a, b);
        }
    }

    function partition(items, left, right, swapMethod, getValueMethod) {
        var pivot = getValueMethod(items[Math.floor((right + left) / 2)]);
        var i = left;
        var j = right;

        while (i <= j) {
            while (getValueMethod(items[i]) < pivot) {
                i++;
            }

            while (getValueMethod(items[j]) > pivot) {
                j--;
            }

            if (i <= j) {
                checkAndSwap(items, i, j);
                i++;
                j--;
            }
        }

        return i;
    }

    var index;

    if (items.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(items, left, right, swapMethod, getValueMethod);

        if (left < index - 1) {
            quickSort(items, left, index - 1, swapMethod, getValueMethod);
        }

        if (index < right) {
            quickSort(items, index, right, swapMethod, getValueMethod);
        }
    }

    return items;
}