import { useState } from "react";
import { Stack } from "@fluentui/react";
import styles from "./Chat.module.css";
import { QuestionInput } from "../../components/QuestionInput";



const Chat = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);

    const makeApiRequest = async (question: string) => {
        setIsLoading(true);
        setShowLoadingMessage(true);

        return question;
    };

    return (
        <div className={styles.container}>
            <Stack horizontal className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    <Stack className={styles.chatEmptyState}>
                                    <h1 className={styles.chatEmptyStateTitle}>Shadow</h1>
                                    <h2 className={styles.chatEmptyStateSubtitle}>Commencement Speech Chatbot</h2>
                    </Stack>
                    
                    <Stack horizontal className={styles.chatInput}>
                                <QuestionInput
                                    clearOnSend
                                    placeholder="Talk to me about your sales pursuits..."
                                    disabled={isLoading}
                                    onSend={question => makeApiRequest(question)}
                                />
                    </Stack>   
                </div>       
            </Stack>
        </div>
            );
};

export default Chat;
