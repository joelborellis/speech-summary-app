import { useRef, useState, useEffect } from "react";
import { Stack } from "@fluentui/react";
import { SquareRegular } from "@fluentui/react-icons";
import styles from "./Chat.module.css";
import { QuestionInput } from "../../components/QuestionInput";
import {
    ChatMessage,
    ConversationRequest,
    conversationApi,
    ChatResponse,
} from "../../api";



const Chat = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    const abortFuncs = useRef([] as AbortController[]);
    const [answers, setAnswers] = useState<ChatMessage[]>([]);

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        setIsLoading(true);
        setShowLoadingMessage(true);
        const abortController = new AbortController();
        abortFuncs.current.unshift(abortController);

        const userMessage: ChatMessage = {
            role: "user",
            content: question,
        };

        const request: ConversationRequest = {
            messages: [...answers, userMessage],
        };

        let result = {} as ChatResponse;
        try {
            const response = await conversationApi(request, abortController.signal);
            if (response?.body) {
                const reader = response.body.getReader();
                let runningText = "";
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    var text = new TextDecoder("utf-8").decode(value);
                    // alert(text)
                    const objects = text.split("\n");
                    // eslint-disable-next-line no-loop-func
                    objects.forEach((obj) => {
                        try {
                            runningText += obj;
                            result = JSON.parse(runningText);
                            setShowLoadingMessage(false);
                            setAnswers([
                                ...answers,
                                userMessage,
                                ...result.choices[0].messages,
                            ]);
                            runningText = "";
                        } catch { }
                    });
                }
                setAnswers([...answers, userMessage, ...result.choices[0].messages]);
            }
        } catch (e) {
            if (!abortController.signal.aborted) {
                console.error(e);
                console.error(result);
                alert(
                    "An error occurred. Please try again. If the problem persists, please contact your site administrator."
                );
            }
            setAnswers([...answers, userMessage]);
        } finally {
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(
                (a) => a !== abortController
            );
        }

        return abortController.abort();
    };

    const stopGenerating = () => {
        abortFuncs.current.forEach((a) => a.abort());
        setShowLoadingMessage(false);
        setIsLoading(false);
      };
    
    useEffect(
        () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
        [showLoadingMessage]
      );

    return (
        <div className={styles.container}>
            <Stack horizontal className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <Stack className={styles.chatEmptyState}>
                            <h1 className={styles.chatEmptyStateTitle}>Shadow</h1>
                            <h2 className={styles.chatEmptyStateSubtitle}>Shadow Insights</h2>
                        </Stack>
                    ) : (
                        <div
                            className={styles.chatMessageStream}
                            style={{ marginBottom: isLoading ? "40px" : "0px" }}
                        >
                            {answers.map((answer, index) => (
                                <>
                                    {answer.role === "user" ? (
                                        <div className={styles.chatMessageUser}>
                                            <div className={styles.chatMessageUserMessage}>
                                                {answer.content}
                                            </div>
                                        </div>
                                    ) : answer.role === "assistant" ? (
                                        <div className={styles.chatMessageAssistantMessage}>
                                            {answer.content}
                                        </div>
                                    ) : null}
                                </>
                            ))}
                            

                        {showLoadingMessage && (
                                        <>
                                            <div className={styles.chatMessageUser}>
                                            <div className={styles.chatMessageUserMessage}>
                                                {lastQuestionRef.current}
                                            </div>
                                            </div>
                                            <div className={styles.chatMessageAssistantMessage}>
                                                {"Generating answer..."}                                             
                                            </div>
                                        </>
                                        )}
                                        <div ref={chatMessageStreamEnd} />
                                    </div>
                                    )}

                    {isLoading && (
                        <Stack
                            horizontal
                            className={styles.stopGeneratingContainer}
                            role="button"
                            aria-label="Stop generating"
                            tabIndex={0}
                            onClick={stopGenerating}
                            onKeyDown={(e: { key: string }) =>
                                e.key === "Enter" || e.key === " " ? stopGenerating() : null
                            }
                        >
                            <SquareRegular
                                className={styles.stopGeneratingIcon}
                                aria-hidden="true"
                            />
                            <span
                                className={styles.stopGeneratingText}
                                aria-hidden="true"
                            >
                                Stop Shadow
                            </span>
                        </Stack>
                    )}

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
