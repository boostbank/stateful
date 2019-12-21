const deepCopy = item =>{
    let copy = item;
    if(item !== undefined && item !== null){
        if(Array.isArray(item)){
            copy = [];
            for (let i = 0; i < item.length; i++) {
                const potentialItem = item[i];
                copy.push(deepCopy(potentialItem));
            }
        }
        else if(typeof item === "object"){
            const keys = Object.keys(item);
            copy = {};
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                copy[key] = deepCopy(item[key]);
            }
        }
    }
    return copy;
};

module.exports = deepCopy;