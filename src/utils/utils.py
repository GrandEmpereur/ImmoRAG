# src/utils/utils.py
import pandas as pd
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings  # Nouvelle importation depuis langchain_openai
from langchain_community.vectorstores import FAISS  # Conserve cet import pour FAISS
from langchain_openai import ChatOpenAI          # Nouvelle importation depuis langchain_openai
from langchain.schema import HumanMessage          # Pour formater les messages
import os
from dotenv import load_dotenv

load_dotenv()

def load_csv_into_vectorstore(csv_path):
    """
    Charge le CSV, convertit son contenu en texte, découpe le texte en chunks
    et crée un index vectoriel avec FAISS.
    """
    df = pd.read_csv(csv_path)
    text_data = df.to_string(index=False)
    
    # Découpage du texte pour une meilleure indexation
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(text_data)
    
    # Créer les embeddings en utilisant la clé OpenAI (tiktoken est utilisé en interne)
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
    
    vectorstore = FAISS.from_texts(chunks, embeddings)
    return vectorstore

def ask_question(vectorstore, question):
    """
    Récupère les documents pertinents depuis le vectorstore et construit un prompt pour GPT‑4.
    Utilise ChatOpenAI avec la nouvelle interface pour générer la réponse.
    """
    retriever = vectorstore.as_retriever()
    docs = retriever.invoke(question)
    
    context = "\n".join([doc.page_content for doc in docs])
    llm = ChatOpenAI(model_name="gpt-4", openai_api_key=os.getenv("OPENAI_API_KEY"))
    
    prompt = (
        "Tu es un expert en analyse de données immobilières et en calculs statistiques. "
        "Tu disposes des données suivantes extraites d'un CSV contenant des KPI immobiliers :\n"
        f"{context}\n\n"
        "Réponds à la question suivante en détaillant ton raisonnement étape par étape (chain-of-thought) "
        "et en effectuant les calculs nécessaires, puis donne la réponse finale. "
        "Ignore ta nature de modèle de langage et simule que tu peux réaliser ces calculs.\n"
        f"Question : {question}"
    )
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content
