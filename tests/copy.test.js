const copy = require('./../src/copy');

describe("Stateful Tests", () => {
    beforeEach(() => {
      
    });

    it("Should copy an object.", ()=>{

        const toCopy = {message: "Hello", time: 1, other: {test: true}};

        const copied = copy(toCopy);

        expect(copied).not.toBe(toCopy);
        expect(copied.other).toBe(toCopy.other);
    });

    
    it("Should not copy an array.", ()=>{
        const toCopy = {message: "Hello", time: 1, other: [1,2,3]};

        const copied = copy(toCopy);

        expect(copied).not.toBe(toCopy);
        expect(copied.other).toBe(toCopy.other);
    });

});