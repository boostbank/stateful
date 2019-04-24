const copy = obj => {
    const target = {};
    if(obj !== undefined && obj !== null){
        let keys = Object.keys(obj);
        keys.forEach(key =>{
            target[key] = obj[key];
        });
    }
    return target;
};

module.exports = copy;