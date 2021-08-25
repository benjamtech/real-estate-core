import IStateContainer from "./IStateContainer"
import StateIdCounter from "./StateIdCounterCls";


class RState<T> {
    private stateContainer: IStateContainer;
    private watcherIdIncrement: number = 1;
    private privateId: number;

    /**
     * Creates a new State that can be watched
     * @param initialValue Sets the initial value of the state
     * @param description An optional description of the state and what is does in the app
     */
    constructor(initialValue: T) {
        const container: IStateContainer = {
            data: initialValue,
            watchers: [],
        };

        this.stateContainer = container;
        this.privateId = StateIdCounter.getInstance().getNewStateid();
    }

    /**
     * Gets you the current state in correct data type
     * @returns The most updated state of type specified when state is created
     */
    public get = (): T => {
        return this.stateContainer.data;
    };

    /**
     * Each State instance has it's own unique id
     * @returns Unique Id for each state object in the system
     */
    public getStateId(): number {
        return this.privateId;
    }

    /**
     * Sets the new state. This updates the state and calls all the watchers.
     * @param value sets the value of the state. This is of type specified on creation
     */
    public set = (value: T): void => {
        this.stateContainer.data = value;

        this.stateContainer.watchers.forEach((watcher) => {
            watcher.caller(value);
        });
    };

    /**
     * Sets new functions to be callbacks for when the state changes. It watches the state
     * @param callback Sets the callback function to be called when states changes. The callback function is also called immediately, to ensure updated UI
     * @param initCall Calls the function on creation in watch if true. Default false
     * @returns The watcher id
     */
    public watch = (
        callback: (state?: T) => void,
        initCall = false
    ): number => {
        const watcherId = this.getNewWatcherId();
        this.stateContainer.watchers.push({ caller: callback, id: watcherId });

        if (initCall) {
            callback(this.stateContainer.data);
        }

        return watcherId;
    };

    /**
     * Delete a watcher with the id from THIS CURRENT STATE! NOT ANY OTHER STATE!
     * @param watcherId Watcher Id you can get when calling the watcher. Remember that watcher ids are only valid within the same state object
     */
    public deleteWatcher = (watcherId: number): void => {
        const filtered = this.stateContainer.watchers.filter(
            (w) => w.id !== watcherId
        );
        this.stateContainer.watchers = filtered;
    };

    private getNewWatcherId = (): number => {
        const watcherId = this.watcherIdIncrement;
        this.watcherIdIncrement = watcherId + 1;
        return watcherId;
    };
}

/**
 * Watches multiple states for changes
 * @param stateArr An array of all state objects to watch
 * @param callback Function to call if any of the states are changed
 * @param initCall Calls the function only once, on creation in watch if true. Default false
 */
function MultiWatcher(
    stateArr: Array<RState<any>>,
    callback: () => void,
    initCall = false
) {
    stateArr.forEach((states) => {
        states.watch(() => {
            callback();
        }, false);
    });

    if (initCall) {
        callback();
    }
}

export default RState;
export { MultiWatcher };
