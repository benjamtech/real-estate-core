import IWatcher from "./IWatcher"

interface IStateContainer {
    description?: string;
    watchers: IWatcher[];
    data: any;
}

export default IStateContainer