const Partitions = require('./Partitions');

const createPartition = (id = "")=>{
    if(typeof id === "string" && id.length > 0){
        Partitions.c
    }else{
        throw new Error("Id must be a string and at least one character! (uuid is preffered)");
    }
};