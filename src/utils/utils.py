import pandas as pd
import json
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.schema import HumanMessage
from langchain_community.document_loaders import PyPDFLoader, JSONLoader
import os
from dotenv import load_dotenv
from typing import Union, List, Dict, Any
from pathlib import Path

load_dotenv()

class DocumentProcessor:
    def __init__(self, chunk_size=1000, chunk_overlap=100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = CharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

    def load_csv(self, file_path: str) -> FAISS:
        """Charge et traite un fichier CSV"""
        try:
            df = pd.read_csv(file_path)
            text_data = df.to_csv(index=False, sep="\t")
            return self._create_vectorstore(text_data)
        except Exception as e:
            raise ValueError(f"Erreur lors du chargement du CSV : {e}")

    def load_json(self, file_path: str, jq_schema: str = ".") -> FAISS:
        """
        Charge et traite un fichier JSON
        Args:
            file_path: Chemin vers le fichier JSON
            jq_schema: Schéma JQ pour extraire des données spécifiques (par défaut: "." pour tout le document)
        """
        try:
            loader = JSONLoader(
                file_path=file_path,
                jq_schema=jq_schema,
                text_content=False
            )
            documents = loader.load()
            texts = self.text_splitter.split_documents(documents)
            return FAISS.from_documents(texts, self.embeddings)
        except Exception as e:
            raise ValueError(f"Erreur lors du chargement du JSON : {e}")

    def load_pdf(self, file_path: str) -> FAISS:
        """Charge et traite un fichier PDF"""
        try:
            loader = PyPDFLoader(file_path)
            pages = loader.load()
            texts = self.text_splitter.split_documents(pages)
            return FAISS.from_documents(texts, self.embeddings)
        except Exception as e:
            raise ValueError(f"Erreur lors du chargement du PDF : {e}")

    def _create_vectorstore(self, text_data: str) -> FAISS:
        """Crée un vectorstore à partir du texte"""
        chunks = self.text_splitter.split_text(text_data)
        return FAISS.from_texts(chunks, self.embeddings)

def load_document(file_path: str, **kwargs) -> FAISS:
    """
    Charge n'importe quel type de document supporté (CSV, JSON, PDF)
    Args:
        file_path: Chemin vers le fichier
        **kwargs: Arguments spécifiques au type de fichier
    """
    processor = DocumentProcessor()
    file_extension = Path(file_path).suffix.lower()
    
    if file_extension == '.csv':
        return processor.load_csv(file_path)
    elif file_extension == '.json':
        return processor.load_json(file_path, kwargs.get('jq_schema', '.'))
    elif file_extension == '.pdf':
        return processor.load_pdf(file_path)
    else:
        raise ValueError(f"Type de fichier non supporté : {file_extension}")

def ask_question(vectorstore: FAISS, question: str, k: int = 3, max_tokens: int = 300) -> str:
    """
    Pose une question sur les documents chargés
    Args:
        vectorstore: L'index vectoriel FAISS
        question: La question à poser
        k: Nombre de documents pertinents à utiliser
        max_tokens: Limite de tokens pour la réponse
    Returns:
        str: La réponse générée
    """
    retriever = vectorstore.as_retriever()
    docs = retriever.get_relevant_documents(question) if hasattr(retriever, "get_relevant_documents") else retriever.invoke(question)
    docs = docs[:k]
    context = "\n".join([doc.page_content for doc in docs])
    
    prompt = (
        "Tu es un assistant spécialisé dans l'analyse de documents. "
        "Réponds uniquement en te basant sur les données présentes dans l'extrait fourni ci-dessous. "
        "Si l'information n'est pas présente dans l'extrait, indique-le clairement. "
        "Ne fais pas de suppositions et n'utilise pas de connaissances externes.\n\n"
        f"Extrait du document :\n{context}\n\n"
        "Instructions spécifiques :\n"
        "1. Utilise uniquement les données de l'extrait ci-dessus\n"
        "2. Ne fais aucune supposition sur des données non présentes\n"
        "3. Si une information est manquante, réponds : 'Cette information n'est pas présente dans les données fournies'\n"
        "4. Donne des réponses courtes et précises\n\n"
        f"Question : {question}"
    )
    
    llm = ChatOpenAI(
        model_name="gpt-4o",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        max_tokens=max_tokens
    )
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content
