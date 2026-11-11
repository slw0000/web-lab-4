import { Observable } from 'rxjs';

const channelName = 'studentСhanges';
const changedMessage = 'studentsСhanged';

export function notifyStudentsChanged(): void {
    const channel = new BroadcastChannel(channelName);

    channel.postMessage(changedMessage);
    channel.close();
}

export const studentChanges$ = new Observable<void>((subscriber) => {
    const channel = new BroadcastChannel(channelName);

    channel.onmessage = (event: MessageEvent<unknown>) => {
        if (event.data === changedMessage) {
            subscriber.next();
        }
    };

    return () => {
        channel.close();
    };
});
