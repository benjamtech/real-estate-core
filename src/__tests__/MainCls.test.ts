import RState from "../index";
import { MultiWatcher } from "../RStateStartCls";

test("Expect correct class instance", () => {
    const counter = new RState(0);
    expect(counter).toBeInstanceOf(RState);
});

test("Expect state flow to work", () => {
    const counter = new RState(0);
    let isCalled = false;
    counter.watch(() => {
        isCalled = true;
    });

    counter.set(1);

    const value = counter.get();
    expect(isCalled).toBeTruthy();
    expect(value).toEqual(1);
});

test("Expect value to be changed correctly", () => {
    const state = new RState("dude");
    expect(state.get()).toEqual("dude");
    state.set("hei du");
    expect(state.get()).toEqual("hei du");
    expect(typeof state.get()).toBe("string");
});

test("Expect state id to be uniqe", () => {
    const isArrayUnique = (arr: Number[]) =>
        Array.isArray(arr) && new Set(arr).size === arr.length;

    const stateIdArr = [];
    for (let i = 0; i < 10; i++) {
        stateIdArr.push(new RState(0).getStateId());
    }

    expect(isArrayUnique(stateIdArr)).toBeTruthy();
});

test("Expect initial callback to work", () => {
    const counter = new RState(0);
    let isCalled = false;
    counter.watch(() => {
        isCalled = true;
    }, true);

    expect(isCalled).toBeTruthy();
});

test("Expect multiWatcher init to work", () => {
    const state = new RState(0);
    let isCalled = false;
    MultiWatcher(
        [state],
        () => {
            isCalled = true;
        },
        true
    );

    expect(isCalled).toBeTruthy();
});

test("Expect deleting a watcher work", () => {
    const counter = new RState(0);

    let isCalled = false;
    const watcherId = counter.watch(() => {
        isCalled = true;
    });

    counter.deleteWatcher(watcherId);
    counter.set(1);
    expect(isCalled).toBeFalsy();
});

test("Expect the multiWatcher to work", () => {
    const state1 = new RState(0);
    const state2 = new RState(1);

    let numberOfCalls = 0;
    MultiWatcher([state1, state2], () => {
        numberOfCalls += 1;
    });

    state1.set(1);
    state2.set(2);

    expect(numberOfCalls).toBe(2);
});
