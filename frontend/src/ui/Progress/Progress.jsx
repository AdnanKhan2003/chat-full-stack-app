import { useEffect } from 'react';
import styles from './Progress.module.css';
import { useState } from 'react';

const Progress = ({ duration }) => {
    const [remainingTime, setRemainingTime] = useState(duration);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(remainingTime => {
                if(remainingTime <= 0) {
                    clearInterval(interval);
                    return;
                }

                return remainingTime - 10;
            });
        }, 10);
        return () => {
            clearInterval(interval);
        };
    }, []);

  return (
    <progress className={`${styles.progress}`} value={duration - remainingTime} max={duration} />
  )
}

export default Progress