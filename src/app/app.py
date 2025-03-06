from flask import Flask, request, jsonify
from flask_cors import CORS  # Importer flask-cors
import os
import sys
from pathlib import Path

# Ajout du répertoire parent au PYTHONPATH
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.utils.utils import load_document, ask_question

app = Flask(__name__)
CORS(app)  # Activer CORS pour toutes les routes

UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Variable globale pour stocker l'index vectoriel
vectorstore = None

@app.route("/upload", methods=["POST"])
def upload_file():
    global vectorstore
    
    if "file" not in request.files:
        print("Erreur: Aucun fichier dans la requête")
        return jsonify({"error": "Aucun fichier envoyé"}), 400

    file = request.files["file"]
    print(f"Fichier reçu: {file.filename}, type MIME: {file.content_type}")
    
    if file.filename == "":
        print("Erreur: Nom de fichier vide")
        return jsonify({"error": "Aucun fichier sélectionné"}), 400

    # Vérifier l'extension du fichier
    file_extension = Path(file.filename).suffix.lower()
    print(f"Extension du fichier: {file_extension}")
    
    if file_extension not in [".csv", ".json", ".pdf"]:
        print(f"Erreur: Extension {file_extension} non supportée")
        return jsonify({"error": "Type de fichier non supporté. Utilisez CSV, JSON ou PDF"}), 400

    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        print(f"Sauvegarde du fichier dans: {file_path}")
        file.save(file_path)
        print(f"Fichier sauvegardé avec succès")

        print("Chargement du document dans le vectorstore...")
        vectorstore = load_document(file_path)
        print("Document chargé avec succès")
        
        return jsonify({
            "message": f"Fichier {file_extension[1:].upper()} chargé et indexé avec succès",
            "filename": file.filename,
            "size": os.path.getsize(file_path),
            "type": file.content_type
        })
    except Exception as e:
        print(f"Erreur lors du traitement: {str(e)}")
        return jsonify({
            "error": f"Erreur lors du traitement du fichier : {str(e)}",
            "details": {
                "filename": file.filename,
                "type": file.content_type,
                "extension": file_extension
            }
        }), 500

@app.route("/ask", methods=["POST"])
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
    app.run(debug=True, port=5005)
