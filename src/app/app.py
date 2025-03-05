from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
from src.utils.utils import load_csv_into_vectorstore, ask_question  # Import corrigé

app = Flask(__name__)
# Autoriser toutes les origines pour toutes les routes
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Variable globale pour stocker l'index vectoriel
vectorstore = None

@app.route("/upload", methods=["POST"])
@cross_origin()  # Décorateur pour être sûr que les headers CORS sont appliqués
def upload_csv():
    global vectorstore
    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier envoyé"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    vectorstore = load_csv_into_vectorstore(file_path)
    return jsonify({"message": "CSV chargé et indexé avec succès"})

@app.route("/ask", methods=["POST"])
@cross_origin()  # Décorateur pour être sûr que les headers CORS sont appliqués
def ask():
    global vectorstore
    if vectorstore is None:
        return jsonify({"error": "Aucun CSV chargé. Veuillez uploader un fichier CSV."}), 400

    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "La question est vide."}), 400

    answer = ask_question(vectorstore, question)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    # Exécutez ce script depuis la racine du projet avec :
    # python -m src.app.app
    app.run(debug=True, port=5000)
