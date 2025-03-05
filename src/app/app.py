from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
from src.utils.utils import load_document, ask_question
from pathlib import Path

app = Flask(__name__)
# Autoriser toutes les origines pour toutes les routes
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Variable globale pour stocker l'index vectoriel
vectorstore = None

@app.route("/upload", methods=["POST"])
@cross_origin()  # Décorateur pour être sûr que les headers CORS sont appliqués
def upload_file():
    global vectorstore
    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier envoyé"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Aucun fichier sélectionné"}), 400

    # Vérifier l'extension du fichier
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in [".csv", ".json", ".pdf"]:
        return jsonify({"error": "Type de fichier non supporté. Utilisez CSV, JSON ou PDF"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        vectorstore = load_document(file_path)
        return jsonify({"message": f"Fichier {file_extension[1:].upper()} chargé et indexé avec succès"})
    except Exception as e:
        return jsonify({"error": f"Erreur lors du traitement du fichier : {str(e)}"}), 500

@app.route("/ask", methods=["POST"])
@cross_origin()
def ask():
    global vectorstore
    if vectorstore is None:
        return jsonify({"error": "Aucun fichier chargé. Veuillez d'abord uploader un fichier."}), 400

    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "La question est vide."}), 400

    try:
        answer = ask_question(vectorstore, question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"Erreur lors du traitement de la question : {str(e)}"}), 500

if __name__ == "__main__":
    # Exécutez ce script depuis la racine du projet avec :
    # python -m src.app.app
    app.run(debug=True, port=5000)
