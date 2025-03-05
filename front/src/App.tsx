// src/App.tsx
import React, { useState } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Veuillez sélectionner un fichier CSV.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        // Laissez le navigateur définir l'en-tête Content-Type pour FormData
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadMessage(data.message);
      } else {
        setUploadMessage(data.error);
      }
    } catch (error) {
      console.error(error);
      setUploadMessage("Erreur lors de l'upload.");
    }
  };

  const handleAsk = async () => {
    if (!question) {
      setAnswer("Veuillez entrer une question.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.error);
      }
    } catch (error) {
      console.error(error);
      setAnswer("Erreur lors de la demande.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">ImmoRAG</h1>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Upload CSV Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Uploader un CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload CSV
          </button>
          {uploadMessage && (
            <p className="mt-4 text-green-500">{uploadMessage}</p>
          )}
        </div>
        {/* Question / Answer Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Poser une Question</h2>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Entrez votre question ici..."
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          ></textarea>
          <button
            onClick={handleAsk}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Poser la Question
          </button>
          {answer && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Réponse :</h3>
              <p className="p-4 bg-gray-50 border border-gray-200 rounded whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
