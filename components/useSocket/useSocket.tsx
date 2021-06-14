import { useEffect } from 'react'
import io from 'socket.io-client';

interface Props {
    eventName: string | any
    callback: () => {}
}

const socket = io()

export function useSocket({eventName, callback}: Props) {
    useEffect(() => {
        socket.on(eventName, callback)
        return function useSocketCleanup() {
            socket.off(eventName, callback)
        }
    }, [eventName, callback])

    return socket
}
