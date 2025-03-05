// src/App.tsx
import React, { useState } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file && file.type !== "text/csv") {
        setError("Veuillez sélectionner un fichier CSV valide.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier CSV.");
      return;
    }
    setIsUploading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        setSelectedFile(null);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("Erreur lors de l'upload. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Veuillez entrer une question.");
      return;
    }
    setIsAsking(true);
    setError("");
    setSuccess("");
    
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
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la demande. Veuillez réessayer.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800 hover:text-gray-700 transition-colors duration-300">
          ImmoRAG
        </h1>

        {/* Upload CSV Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Uploader un CSV</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-300"
              >
                <span className="text-gray-600">
                  {selectedFile ? selectedFile.name : "Cliquez pour sélectionner un fichier CSV"}
                </span>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                isUploading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Upload en cours...
                </div>
              ) : (
                "Upload CSV"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-fade-in">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded animate-fade-in">
              {success}
            </div>
          )}
        </div>

        {/* Question / Answer Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Poser une Question</h2>
          
          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Entrez votre question ici..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
            ></textarea>

            <button
              onClick={handleAsk}
              disabled={isAsking || !question.trim()}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                isAsking || !question.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isAsking ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Traitement en cours...
                </div>
              ) : (
                "Poser la Question"
              )}
            </button>
          </div>

          {answer && (
            <div className="mt-8 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Réponse :</h3>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {answer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
