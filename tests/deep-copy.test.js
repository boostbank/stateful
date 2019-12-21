const deepCopy = require('./../src/deep-copy');

describe("Stateful Tests", () => {
    beforeEach(() => {
      
    });

    it("Should copy a object recursively.", ()=>{
        const toCopy = {message: "Hello", time: 1, other: [1,2,3], two: {name: "test", another: {three: "test"}}};

        const copied = deepCopy(toCopy);

        expect(copied).not.toBe(toCopy);
        expect(copied.other).not.toBe(toCopy.other);
        expect(copied.two).not.toBe(toCopy.two);
        expect(copied.two.another).not.toBe(toCopy.two.another);
        expect(copied.two.another.three).toBe(toCopy.two.another.three);
    });

    
    it("Should copy an array recursively.", ()=>{
        const obj = {message: "Hello", time: 0, testing: true};
        const toCopy = [obj]

        const copied = deepCopy(toCopy);

        expect(copied).not.toBe(toCopy);
        expect(copied[0]).not.toBe(obj);
        expect(copied[0].time).toBe(obj.time);
    });

    it("Should not copy null.", ()=>{
        const copied = deepCopy(null);
        expect(copied).toBe(null);
    });

    
    it("Should not copy undefined.", ()=>{
        const copied = deepCopy(undefined);
        expect(copied).toBe(undefined);
    });

});