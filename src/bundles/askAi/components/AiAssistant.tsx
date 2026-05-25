import { useState } from "react"
import {
    Box,
    Typography,
    TextField,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Divider,
    IconButton,
} from "@mui/material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import SendIcon from "@mui/icons-material/Send"
import ReactMarkdown from "react-markdown"
import { useDocumentationProjects } from "@apidex/core/documentation"
import { useAiAssistant } from "../hooks"

export function AiAssistant() {
    const { projects, isLoading: isLoadingProjects } = useDocumentationProjects()
    const { askQuestion, isAsking, error } = useAiAssistant()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [question, setQuestion] = useState("")
    const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai", content: string }[]>([])

    const handleAsk = async () => {
        if (!question.trim()) return

        const currentQuestion = question
        setQuestion("")
        setChatHistory(prev => [...prev, { role: "user", content: currentQuestion }])

        try {
            const response = await askQuestion({
                question: currentQuestion,
                projectId: selectedProjectId || null,
            })
            setChatHistory(prev => [...prev, { role: "ai", content: response.answer }])
        } catch {
            setChatHistory(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error while trying to answer your question." }])
        }
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: 1000, mx: "auto" }}>
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "rgba(88, 166, 255, 0.12)" }}>
                    <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        AI Assistant
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ask questions about your API documentation
                    </Typography>
                </Box>
            </Box>

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: "#0D1117",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >
                <FormControl sx={{ minWidth: 250 }} size="small">
                    <InputLabel id="project-select-label">Target Project (Optional)</InputLabel>
                    <Select
                        labelId="project-select-label"
                        value={selectedProjectId}
                        label="Target Project (Optional)"
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        disabled={isLoadingProjects}
                    >
                        <MenuItem value="">
                            <em>All Projects</em>
                        </MenuItem>
                        {projects.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {error && (
                    <Typography variant="body2" color="error.main" sx={{ ml: 2 }}>
                        {error.message}
                    </Typography>
                )}
            </Paper>

            <Paper
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#0D1117",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    {chatHistory.length === 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "text.secondary" }}>
                            <AutoAwesomeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6">How can I help you today?</Typography>
                            <Typography variant="body2">Select a project above and ask a question.</Typography>
                        </Box>
                    ) : (
                        chatHistory.map((msg, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: "flex",
                                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: "80%",
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: msg.role === "user" ? "primary.dark" : "rgba(255,255,255,0.05)",
                                        border: msg.role === "user" ? "none" : "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block", textTransform: "uppercase", fontWeight: 700 }}>
                                        {msg.role === "user" ? "You" : "ApiDex AI"}
                                    </Typography>
                                    <Box sx={{ 
                                        "& p": { m: 0, mb: 1 }, 
                                        "& p:last-child": { mb: 0 },
                                        "& code": { bgcolor: "rgba(0,0,0,0.3)", p: 0.5, borderRadius: 1, fontFamily: "monospace" },
                                        "& pre": { bgcolor: "rgba(0,0,0,0.3)", p: 1.5, borderRadius: 1, overflowX: "auto" }
                                    }}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    )}
                    {isAsking && (
                        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 2 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">Thinking...</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Divider />

                <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)" }}>
                    <TextField
                        fullWidth
                        placeholder="Ask about endpoints, events, or dependencies..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleAsk()
                            }
                        }}
                        multiline
                        maxRows={4}
                        disabled={isAsking}
                        slotProps={{
                            input: {
                                sx: { borderRadius: 2, bgcolor: "#0D1117" },
                                endAdornment: (
                                    <IconButton 
                                        color="primary" 
                                        onClick={handleAsk}
                                        disabled={!question.trim() || isAsking}
                                        sx={{ alignSelf: "flex-end", mb: 0.5 }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                )
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    )
}
