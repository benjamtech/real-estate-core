interface IWatcher {
    caller: (state?: any) => void;
    id: number;
}

export default IWatcher