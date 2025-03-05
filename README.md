# IMMO_RAG : Analyse de KPI Immobilier avec Langchain, FAISS et ChatGPT

## Description

**IMMO_RAG** est un projet d’analyse et de traitement de données immobilières à partir de fichiers CSV. Il s’appuie sur l’écosystème **Langchain**, **FAISS** et l’API **OpenAI** (modèle GPT-3.5 Turbo) pour :

1. Générer et charger des fichiers CSV de données immobilières.  
2. Convertir et indexer ces données sous forme de vecteurs (embeddings) via **FAISS**.  
3. Permettre la recherche sémantique et l’interrogation de ces données à l’aide de **ChatGPT**.

Ce **README** présente la structure du projet, les dépendances nécessaires, ainsi que les principales étapes pour l’installer et l’utiliser.

---

## Table des Matières

1. [Architecture du Projet](#architecture-du-projet)  
2. [Prérequis et Installation](#prérequis-et-installation)  
3. [Configuration](#configuration)  
4. [Utilisation](#utilisation)  
5. [Structure du Code](#structure-du-code)  
6. [Contribution](#contribution)  
7. [Licence](#licence)

---

## Architecture du Projet

Voici l’arborescence principale du projet :

```
IMMO_RAG
├── data
├── front
├── src
│   ├── __pycache__
│   ├── app
│   │   ├── __pycache__
│   │   ├── __init__.py
│   │   ├── app.py
│   ├── utils
│   │   ├── __pycache__
│   │   ├── __init__.py
│   │   ├── utils.py
│   │   ├── generate_csv.py
├── upload
├── venv
├── .env
├── .env.local
├── .gitignore
├── README.md
├── requirements.txt
```

- **data/** : Contient les fichiers de données brutes ou nettoyées (CSV, etc.).  
- **front/** : Potentiellement destiné à une application Front-End (React, Vue, etc.) si besoin.  
- **src/** : Regroupe le code source principal du projet.  
  - **app/** :  
    - `app.py` : Fichier principal (entry point) de l’application.  
    - `__init__.py` : Rend le dossier `app` importable comme un module Python.  
  - **utils/** :  
    - `utils.py` : Contient les fonctions principales de chargement, d’indexation et d’interrogation du CSV.  
    - `generate_csv.py` : Script pour générer un CSV de démonstration ou pour préparer les données.  
- **upload/** : Dossier où peuvent être stockés les fichiers importés par l’utilisateur.  
- **venv/** : Environnement virtuel Python (recommandé pour isoler les dépendances).  
- **.env** / **.env.local** : Contient les variables d’environnement (ex. clés API).  
- **.gitignore** : Fichier listant les éléments à ignorer par Git.  
- **requirements.txt** : Liste des dépendances Python.  
- **README.md** : Document de présentation du projet (celui-ci).  

---

## Prérequis et Installation

1. **Python 3.7+**  
   Assurez-vous d’avoir Python 3.7 ou une version ultérieure installée.

2. **Cloner le dépôt**  

   ```bash
   git clone <URL_DU_DEPOT>
   cd IMMO_RAG
   ```

3. **Création et activation de l’environnement virtuel (optionnel mais recommandé)**  

   ```bash
   python -m venv venv
   source venv/bin/activate   # Sur Linux/Mac
   # ou
   venv\Scripts\activate      # Sur Windows
   ```

4. **Installation des dépendances**  

   ```bash
   pip install -r requirements.txt
   ```

---

## Configuration

1. **Variables d’environnement**  
   Créez un fichier `.env` (ou modifiez le `.env.local`) à la racine du projet. Ajoutez-y la variable `OPENAI_API_KEY` :

   ```
   OPENAI_API_KEY=<votre_cle_openai>
   ```

2. **Paramètres optionnels**  
   - Vous pouvez définir d’autres variables d’environnement si nécessaire (par exemple, des chemins vers des répertoires spécifiques, des identifiants de base de données, etc.).

---

## Utilisation

### 1. Génération (optionnelle) d’un CSV

Vous pouvez générer un CSV de démonstration en utilisant le script `generate_csv.py` :

```bash
python src/utils/generate_csv.py
```

Cela créera un fichier CSV de test dans le dossier spécifié dans le script.

### 2. Chargement et Indexation du CSV

Dans un script Python ou un notebook, importez la fonction `load_csv_into_vectorstore` :

```python
from src.utils.utils import load_csv_into_vectorstore

# Exemple : Chemin vers votre fichier CSV
csv_path = "data/kpi_immobilier.csv"

# Création du vectorstore à partir du CSV
vectorstore = load_csv_into_vectorstore(csv_path)
```

Cette fonction va :
- Lire le CSV via Pandas.  
- Le convertir en texte (avec conservation des en-têtes).  
- Le découper en chunks pour une meilleure indexation.  
- Générer des embeddings via l’API OpenAI.  
- Créer un index vectoriel dans FAISS pour la recherche sémantique.

### 3. Interroger les Données avec ChatGPT

Utilisez la fonction `ask_question` pour poser une question :

```python
from src.utils.utils import ask_question

question = "Quel est le KPI le plus significatif pour mesurer la rentabilité des biens ?"
reponse = ask_question(vectorstore, question)
print("Réponse :", reponse)
```

Cette fonction va :
- Récupérer les passages les plus pertinents du CSV via la similarité cosinus.  
- Construire un prompt optimisé pour ChatGPT (GPT-3.5 Turbo).  
- Retourner une réponse concise et précise.

### 4. Lancement de l’application (si un serveur est mis en place)

Si vous avez un serveur (ex. Flask, FastAPI) dans `app.py`, vous pouvez le lancer :

```bash
python src/app/app.py
```

Ensuite, suivez les instructions (URL, endpoints, etc.) indiquées dans la console ou le fichier `app.py`.

---

## Structure du Code

- **`utils.py`** :  
  - `load_csv_into_vectorstore(csv_path, chunk_size=1000, chunk_overlap=100)` :  
    Charge un CSV, le découpe en chunks, génère des embeddings et crée un index vectoriel FAISS.  
  - `ask_question(vectorstore, question, k=3, max_tokens=300)` :  
    Interroge le vectorstore pour récupérer les documents les plus pertinents et formuler une question à ChatGPT.  

- **`generate_csv.py`** :  
  Script permettant de générer un CSV de test ou de transformer des données brutes en CSV.

- **`app.py`** :  
  Fichier principal (potentiellement un serveur Flask/FastAPI ou autre) pour déployer une interface ou des endpoints REST.

---

## Contribution

Les contributions sont les bienvenues ! Pour proposer une amélioration ou corriger un bug :

1. **Fork** ce dépôt.  
2. **Créez** une branche pour votre fonctionnalité ou correction :  
   ```bash
   git checkout -b feature/nom_fonctionnalite
   ```  
3. **Commitez** vos modifications :  
   ```bash
   git commit -m "Ajout de la fonctionnalité X"
   ```  
4. **Poussez** votre branche :  
   ```bash
   git push origin feature/nom_fonctionnalite
   ```  
5. **Ouvrez** une Pull Request sur le dépôt principal.

---

## Licence

Ce projet est distribué sous licence [MIT](https://opensource.org/licenses/MIT). Vous êtes libre de l’utiliser, le modifier et le redistribuer sous réserve de respecter les termes de la licence.

---

### Remerciements

- [Langchain](https://github.com/hwchase17/langchain)  
- [FAISS](https://github.com/facebookresearch/faiss)  
- [OpenAI API](https://openai.com/api/)

**IMMO_RAG** vous permet d’explorer efficacement vos données immobilières, d’en extraire des informations pertinentes et de poser des questions de manière naturelle grâce à ChatGPT. N’hésitez pas à ajuster ce README en fonction de vos besoins et à partager vos retours avec la communauté !