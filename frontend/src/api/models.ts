export type ChatMessage = {
    role: string;
    content: string;
    end_turn?: boolean;
};

export enum ChatCompletionType {
    ChatCompletion = "chat.completion",
    ChatCompletionChunk = "chat.completion.chunk"
}

export type ChatResponseChoice = {
    messages: ChatMessage[];
}

export type ChatResponse = {
    id: string;
    model: string;
    created: number;
    object: ChatCompletionType;
    choices: ChatResponseChoice[];
}

export type ConversationRequest = {
    messages: ChatMessage[];
};