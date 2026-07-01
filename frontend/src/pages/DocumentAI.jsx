import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { getFiles, askDocumentAI } from "../services/api";
import { useEffect, useState, useRef } from "react";
function DocumentAI() {
    const { id } = useParams();

    const [document, setDocument] = useState(null);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    useEffect(() => {

        getFiles()
            .then((response) => {

            const file = response.data.find(
                (item) => item.id === Number(id)
            );

            setDocument(file);

            })
            .catch(console.error);

        }, [id]);
    useEffect(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }, [messages, loading]);
    const handleAsk = async () => {

        if (!question.trim()) return;

        try {

            setLoading(true);

            const response = await askDocumentAI(
                Number(id),
                question,
                history
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "user",
                    text: question,
                },
                {
                    role: "assistant",
                    text: response.data.answer,
                    sources: response.data.sources,
                },
                ]);

                setQuestion("");

            setHistory([
                ...history,
                {
                    role: "user",
                    text: question,
                },
                {
                    role: "assistant",
                    text: response.data.answer,
                    sources: response.data.sources,
                },
            ]);

        } catch (err) {

            console.error(err);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Something went wrong.",
                },
                ]);

        } finally {

            setLoading(false);

        }

        };
  return (
    <div className="h-screen overflow-hidden app-bg flex">
  <Sidebar />

  <main className="flex-1 flex flex-col h-screen">
    {/* Header */}
    <div className="border-b app-bg px-10 py-6">
      <h1 className="text-4xl font-bold">
        📄 {document?.name || "Loading..."}
      </h1>

      <p className="text-theme opacity-70 mt-3 break-all">
        {document?.path}
      </p>
    </div>



    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto px-10 py-6 text-theme">
        <div className="space-y-8">
        {messages.map((msg, index) => (

    <div
        key={index}
        className={`flex flex-col ${
            msg.role === "user" ? "items-end" : "items-start"
        }`}
    >

            <div className="font-semibold mb-2">
                {msg.role === "user" ? "🧑 You" : "🤖 EchoMind"}
            </div>

        <div
            className={`rounded-3xl px-6 py-4 whitespace-pre-wrap ${
                msg.role === "user"
                    ? "bg-cyan-600 text-white max-w-2xl"
                    : "card-bg max-w-3xl"
            }`}
        >
            {msg.text}

            {msg.role === "assistant" &&
                msg.sources &&
                msg.sources.length > 0 && (
                <div className="mt-4 text-sm">
                    <div className="font-semibold text-cyan-400">
                    📄 Sources
                    </div>

                    <ul className="list-disc ml-6 mt-2">
                    {msg.sources.map((source, index) => (
                        <li key={index}>
                        {source.file} — Page {source.page}
                        </li>
                    ))}
                    </ul>
                                    
                
                </div>
                )}
                
            </div>
            </div>
        ))}
        {loading && (
                <div className="flex flex-col items-start">
                    <div className="font-semibold mb-2">🤖 EchoMind</div>

                    <div className="card-bg rounded-3xl px-6 py-4">
                    Thinking...
                    </div>
                </div>
        )}
                <div ref={messagesEndRef}></div>
        
        </div>
    </div>
        {/* AI Input */}
    <div className="border-t app-bg px-10 py-5">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about this document..."
        className="w-full h-36 card-bg rounded-xl p-4 outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
          }
        }}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="mt-4 px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 transition"
      >
        {loading ? "Thinking..." : "✨ Ask AI"}
      </button>
    </div>
  </main>
</div>

  );
}

export default DocumentAI;