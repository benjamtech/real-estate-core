/* tslint:disable */

class StateIdCounter {
    private static instance: StateIdCounter;
    private counter: number = 1;

    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    public getNewStateid(): number {
        const id = this.counter;
        this.counter = id + 1;
        return id;
    }
}

export default StateIdCounter;
