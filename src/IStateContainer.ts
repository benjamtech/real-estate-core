import IWatcher from "./IWatcher";

interface IStateContainer {
    watchers: IWatcher[];
    data: any;
}

export default IStateContainer;
