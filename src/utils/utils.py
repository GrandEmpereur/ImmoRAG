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
    Récupère les documents pertinents depuis le vectorstore et construit un prompt pour le modèle.
    Utilise ChatOpenAI avec gpt-3.5-turbo pour réduire les coûts.
    """
    retriever = vectorstore.as_retriever()
    docs = retriever.invoke(question)
    
    # Limiter le contexte aux 3 documents les plus pertinents
    docs = docs[:3]
    context = "\n".join([doc.page_content for doc in docs])
    
    # Initialiser le modèle ChatOpenAI en utilisant gpt-3.5-turbo
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",  # Utilisation d'un modèle à coût réduit
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        max_tokens=300  # Limite de tokens pour la réponse
    )
    
    prompt = (
        "Tu es un expert en analyse de données immobilières. "
        "En te basant sur l'extrait suivant du CSV (contenant des KPI immobiliers), "
        "réponds directement à la question de façon concise et uniquement avec le résultat final.\n\n"
        f"{context}\n\n"
        f"Question : {question}"
    )
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content
