import { useState } from "react"
import { aiRepository, AskDocumentationRequest, AskDocumentationResponse } from "@apidex/core/documentation/data/repositories"

export function useAiAssistant() {
    const [isAsking, setIsAsking] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const askQuestion = async (request: AskDocumentationRequest): Promise<AskDocumentationResponse> => {
        setIsAsking(true)
        setError(null)
        try {
            return await aiRepository.ask(request)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to get answer from AI"))
            throw err
        } finally {
            setIsAsking(false)
        }
    }

    return {
        askQuestion,
        isAsking,
        error,
    }
}
