# IMMO_RAG : Analyse de KPI Immobilier avec Langchain, FAISS et ChatGPT

## Description

**IMMO_RAG** est un projet d’analyse et de traitement de données immobilières à partir de fichiers **CSV**, **JSON** et **PDF**. Il s’appuie sur l’écosystème **Langchain**, **FAISS** et l’API **OpenAI** (modèle GPT-3.5 Turbo) pour :

1. Générer et charger des fichiers (CSV, JSON, PDF) de données immobilières.  
2. Convertir et indexer ces données sous forme de vecteurs (embeddings) via **FAISS**.  
3. Permettre la recherche sémantique et l’interrogation de ces données à l’aide de **ChatGPT**.  
4. Proposer une **interface Front-End** en **Next.js** avec un système d’authentification simple (code : `123456`).

Ce **README** présente la structure du projet, les dépendances nécessaires, ainsi que les principales étapes pour l’installer et l’utiliser.

---

## Table des Matières

1. [Architecture du Projet](#architecture-du-projet)  
2. [Prérequis et Installation](#prérequis-et-installation)  
3. [Configuration](#configuration)  
4. [Utilisation](#utilisation)  
5. [Structure du Code](#structure-du-code)  
6. [Front-End Next.js](#front-end-nextjs)  
7. [Contribution](#contribution)  
8. [Licence](#licence)  

---

## Architecture du Projet

Voici une **version simplifiée** de l’arborescence principale du projet :

```
IMMO_RAG
├── data
│   └── ...                  # Fichiers de données (CSV, JSON, PDF, etc.)
├── front
│   ├── .next                # Dossier généré par Next.js (build)
│   ├── node_modules
│   ├── public               # Fichiers statiques (favicon, images, etc.)
│   ├── src
│   │   ├── app
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components
│   │   ├── hooks
│   │   ├── lib
│   │   └── ...
│   ├── next.config.ts       # Configuration Next.js (rewrites, etc.)
│   └── ...
├── src
│   ├── app
│   │   ├── __init__.py
│   │   ├── app.py           # Serveur Flask (ou FastAPI)
│   │   └── ...
│   ├── utils
│   │   ├── __init__.py
│   │   ├── utils.py         # Fonctions de chargement/indexation IA
│   │   └── generate_data.py # Script pour générer CSV/JSON de test
│   └── ...
├── upload                   # Dossier pour stocker les fichiers uploadés
├── venv                     # Environnement virtuel Python
├── .env                     # Variables d'environnement (OpenAI API, etc.)
├── .env.local               # Variables d'environnement locales
├── .gitignore
├── README.md
├── requirements.txt         # Dépendances Python
└── ...
```

- **data/** : Contient les fichiers de données brutes ou nettoyées (CSV, JSON, PDF, etc.).  
- **front/** : Application **Next.js** qui sert d’interface utilisateur.  
- **src/** : Regroupe le code source Python principal (serveur Flask, scripts utilitaires).  
- **upload/** : Dossier où sont stockés les fichiers importés par l’utilisateur (lors de l’upload).  
- **venv/** : Environnement virtuel Python (recommandé pour isoler les dépendances).  
- **.env** / **.env.local** : Contient les variables d’environnement (ex. clé OpenAI).  
- **requirements.txt** : Liste des dépendances Python.  
- **README.md** : Document de présentation du projet (celui-ci).  

---

## Prérequis et Installation

1. **Python 3.11+**  
   Assurez-vous d’avoir Python 3.11 ou une version ultérieure installée.

2. **Cloner le dépôt**  

   ```bash
   git clone git@github.com:GrandEmpereur/ImmoRAG.git
   cd IMMO_RAG
   ```

3. **Création et activation de l’environnement virtuel (optionnel mais recommandé)**  

   ```bash
   python -m venv venv
   source venv/bin/activate   # Sur Linux/Mac
   # ou
   venv\Scripts\activate      # Sur Windows
   ```

4. **Installation des dépendances Python**  

   ```bash
   pip install -r requirements.txt
   ```

5. **Installation des dépendances Front (Next.js)**  
   Allez dans le dossier `front` puis installez les dépendances Node :

   ```bash
   cd front
   npm install
   # ou yarn install / pnpm install, selon votre gestionnaire de paquets
   ```

---

## Configuration

1. **Variables d’environnement (Back-End)**  
   - Copiez le fichier `.env.example` en `.env` et remplacez la valeur de la variable `OPENAI_API_KEY` par votre clé API OpenAI.
   - Vous pouvez ajouter d’autres variables selon vos besoins (chemins de fichiers, configuration de base de données, etc.).

2. **Configuration du Front-End (Next.js)**  
   - Vérifiez le fichier `next.config.ts` si vous avez besoin de rediriger des requêtes vers votre serveur Flask (ex. port 5005).
   - Vous pouvez également définir des variables d’environnement Next.js via un fichier `.env.local` dans `front/`.

3. **Authentification (Code 123456)**  
   - Un simple système d’authentification est mis en place dans le front-end.  
   - Par défaut, le **code d’accès** est `123456`. Vous pouvez le modifier dans le code Next.js si nécessaire.

---

## Utilisation

### 1. Génération (optionnelle) d’un fichier CSV ou JSON de démonstration

Vous pouvez générer un fichier de test (CSV ou JSON) en utilisant le script `generate_data.py` :

```bash
python src/utils/generate_data.py
```

Cela créera un fichier de test dans le dossier spécifié dans le script.

### 2. Lancement du serveur (Back-End)

Si vous avez un serveur Flask (ou FastAPI) dans `app.py`, exécutez :

```bash
python src/app/app.py
```

Par défaut, il tournera sur `http://localhost:5005` (selon votre configuration).  
Surveillez la console pour voir les endpoints disponibles ou les messages d’erreur éventuels.

### 3. Lancement de l’application Front (Next.js)

Dans un autre terminal, rendez-vous dans le dossier `front` et lancez :

```bash
npm run dev
# ou yarn dev / pnpm dev
```

Par défaut, l’application Next.js sera disponible sur `http://localhost:3000`.

### 4. Upload de fichiers (CSV, JSON, PDF) et Questions à l’IA

- Rendez-vous sur l’interface web (Front-End Next.js).  
- Connectez-vous avec le code d’authentification `123456` (s’il est demandé).  
- Uploadez un fichier (CSV, JSON ou PDF).  
- Posez vos questions à l’IA :  
  - L’IA analyse le fichier chargé (grâce à Langchain + FAISS + OpenAI).  
  - Vous obtenez des réponses directes et concises sur les données.

---

## Structure du Code

### Python

- **`utils.py`** :  
  - `load_csv_into_vectorstore(csv_path, chunk_size=1000, chunk_overlap=100)` :  
    - Charge un fichier CSV (ou JSON/PDF, selon l’implémentation), le découpe en chunks, génère des embeddings et crée un index vectoriel FAISS.  
  - `ask_question(vectorstore, question, k=3, max_tokens=300)` :  
    - Interroge le vectorstore pour récupérer les documents les plus pertinents et formuler une question à ChatGPT.  

- **`generate_data.py`** :  
  - Script permettant de générer un CSV/JSON de test ou de transformer des données brutes.

- **`app.py`** :  
  - Fichier principal du **serveur Flask** (ou FastAPI) :  
    - Gère l’upload des fichiers (CSV, JSON, PDF).  
    - Gère l’indexation et le questionnement via l’IA.

### Front-End Next.js

- **`front/src/app`** :  
  - Contient la logique des pages Next.js (par exemple `page.tsx`, `layout.tsx`, etc.).  
  - Le dossier `dashboard/` peut contenir la page principale après connexion.  
- **`front/src/components`** :  
  - Composants réutilisables (ex. ChatBot, boutons, formulaires).  
- **`front/next.config.ts`** :  
  - Configuration Next.js, notamment les `rewrites` pour rediriger `/upload` et `/ask` vers le serveur Flask.  
- **Authentification** :  
  - Vous trouverez un composant ou un hook gérant la vérification du code `123456` avant d’accéder à certaines pages ou fonctionnalités.

---

## Front-End Next.js

Une fois le serveur Flask lancé, vous pouvez accéder à l’interface Next.js :

1. **Accès** :  
   - Par défaut : `http://localhost:3000`.  
   - Authentification : Entrez le code `123456` si nécessaire.

2. **Upload de fichiers** :  
   - Depuis l’interface, vous pouvez sélectionner un fichier CSV, JSON ou PDF.  
   - Le serveur Flask indexe ce fichier et le rend disponible pour l’IA.

3. **Poser des questions** :  
   - Dans la zone de chat, entrez vos questions.  
   - L’IA renvoie une réponse concise basée sur les données du fichier importé.

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
- [Next.js](https://nextjs.org/)  

**IMMO_RAG** vous permet d’explorer efficacement vos données immobilières (CSV, JSON, PDF), d’en extraire des informations pertinentes et de poser des questions de manière naturelle grâce à ChatGPT. N’hésitez pas à ajuster ce README en fonction de vos besoins et à partager vos retours avec la communauté !