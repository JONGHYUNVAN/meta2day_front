'use client';

import React, { useEffect, useState } from 'react';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import styles from './realtimeAlarm.module.scss';

interface RealtimeAlarmProps {
    userId: number;
}

interface Alarm {
    id?: number;
    title: string;
    message: string;
}

const RealtimeAlarm: React.FC<RealtimeAlarmProps> = ({ userId }) => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [animationClass, setAnimationClass] = useState(styles['slide-in']);

    useEffect(() => {
        const EventSource = EventSourcePolyfill || NativeEventSource;
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/sse/${userId}`);

        eventSource.onmessage = (event) => {
            const newAlarm: Alarm = JSON.parse(event.data);
            console.log("New alarm received:", newAlarm); // 로그 추가

            setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);

            setAnimationClass(styles['slide-in']);

            const slideOutTimer = setTimeout(() => {
                setAnimationClass(styles['slide-out']);

                const clearAlarmTimer = setTimeout(() => {
                    setAlarms((prevAlarms) => prevAlarms.slice(1));
                }, 500);

                return () => clearTimeout(clearAlarmTimer);
            }, 5000);

            return () => clearTimeout(slideOutTimer);
        };

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
        };

        eventSource.onopen = () => {
            console.log("Connection to event source opened.");
        };

        return () => {
            eventSource.close();
        };
    }, [userId]);

    if (alarms.length === 0) return null;

    return (
        <div className={styles.realtimeAlarm}>
            {alarms.map((alarm, index) => (
                <div key={index} className={`${styles.alarmWrapper} ${animationClass}`}>
                    <div className={styles.alarmItem}>
                        <h4 className={styles.alarmTitle}>{alarm.title}</h4>
                        <p className={styles.alarmDescription}>{alarm.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );    
};

export default RealtimeAlarm;
