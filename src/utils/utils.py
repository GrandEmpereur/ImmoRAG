import pandas as pd
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.schema import HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

def load_csv_into_vectorstore(csv_path, chunk_size=1000, chunk_overlap=100):
    """
    Charge le CSV, convertit son contenu en texte et découpe le texte en morceaux optimisés
    pour la création d'un index vectoriel FAISS.
    
    Args:
        csv_path (str): Chemin vers le fichier CSV.
        chunk_size (int, optional): Taille des morceaux de texte. Par défaut 1000.
        chunk_overlap (int, optional): Recouvrement entre les morceaux pour conserver le contexte. Par défaut 100.
    
    Returns:
        FAISS: L'index vectoriel construit à partir du contenu du CSV.
    """
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        raise ValueError(f"Erreur lors du chargement du CSV : {e}")
    
    # Convertir le DataFrame en texte en conservant la structure et les en-têtes
    text_data = df.to_csv(index=False, sep="\t")
    
    # Découpage du texte pour optimiser l'indexation
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = text_splitter.split_text(text_data)
    
    # Création des embeddings avec la clé OpenAI
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
    
    # Création du vectorstore FAISS à partir des morceaux de texte
    vectorstore = FAISS.from_texts(chunks, embeddings)
    return vectorstore

def ask_question(vectorstore, question, k=3, max_tokens=300):
    """
    Récupère les documents pertinents depuis le vectorstore et construit un prompt
    optimisé pour le modèle GPT afin de répondre de manière concise aux questions portant sur le CSV.
    
    Args:
        vectorstore (FAISS): L'index vectoriel construit à partir du CSV.
        question (str): La question à poser.
        k (int, optional): Nombre de documents pertinents à utiliser. Par défaut 3.
        max_tokens (int, optional): Limite de tokens pour la réponse du modèle. Par défaut 300.
    
    Returns:
        str: La réponse générée par le modèle.
    """
    # Récupérer les documents les plus pertinents
    retriever = vectorstore.as_retriever()
    if hasattr(retriever, "get_relevant_documents"):
        docs = retriever.get_relevant_documents(question)
    else:
        docs = retriever.invoke(question)
    
    # Sélectionner les k documents les plus pertinents
    docs = docs[:k]
    context = "\n".join([doc.page_content for doc in docs])
    
    # Construction d'un prompt optimisé
    prompt = (
        "Tu es un expert en analyse de données immobilières. "
        "En te basant uniquement sur l'extrait du CSV ci-dessous (contenant des KPI immobiliers), "
        "réponds de manière concise et donne uniquement le résultat final.\n\n"
        f"Extrait du CSV :\n{context}\n\n"
        f"Question : {question}"
    )
    
    # Initialisation du modèle ChatOpenAI en utilisant gpt-3.5-turbo
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        max_tokens=max_tokens
    )
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content
