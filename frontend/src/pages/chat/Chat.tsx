import { Stack } from "@fluentui/react";
import styles from "./Chat.module.css";


const Chat = () => {

    return (
        <div className={styles.container}>
            <Stack horizontal className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                <Stack className={styles.chatEmptyState}>
                                <h1 className={styles.chatEmptyStateTitle}>Coming Soon</h1>
                                <h2 className={styles.chatEmptyStateSubtitle}>Commencement Speech Chatbot</h2>
                            </Stack>
                </div>
            </Stack>
        </div>
            );
};

export default Chat;
