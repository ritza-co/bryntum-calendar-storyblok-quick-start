import { CalendarWrapper } from '@/app/components/CalendarWrapper';
import styles from './page.module.css';

export default function Home() {
    return (
        <main className={styles.main}>
            <CalendarWrapper />
        </main>
    );
}
