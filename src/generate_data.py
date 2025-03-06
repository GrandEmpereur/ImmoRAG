# generate_data.py
import pandas as pd
import random
import os
from faker import Faker
import json
from fpdf import FPDF

# Initialisation de Faker en français
fake = Faker(['fr_FR'])

# Création du dossier data s'il n'existe pas
os.makedirs("data", exist_ok=True)

# Liste des villes avec leurs codes postaux
cities = {
    "Paris": ["75001", "75002", "75003", "75004", "75005", "75006", "75007", "75008", "75016"],
    "Marseille": ["13001", "13002", "13003", "13004", "13008", "13009"],
    "Lyon": ["69001", "69002", "69003", "69006", "69007"],
    "Toulouse": ["31000", "31100", "31200", "31300", "31400"],
    "Nice": ["06000", "06100", "06200", "06300"],
    "Nantes": ["44000", "44100", "44200", "44300"],
    "Strasbourg": ["67000", "67100", "67200"],
    "Montpellier": ["34000", "34070", "34080", "34090"],
    "Bordeaux": ["33000", "33100", "33200", "33300"],
    "Lille": ["59000", "59130", "59160", "59777"]
}

# Mapping des régions
city_to_region = {
    "Paris": "Île-de-France",
    "Marseille": "Provence-Alpes-Côte d'Azur",
    "Lyon": "Auvergne-Rhône-Alpes",
    "Toulouse": "Occitanie",
    "Nice": "Provence-Alpes-Côte d'Azur",
    "Nantes": "Pays de la Loire",
    "Strasbourg": "Grand Est",
    "Montpellier": "Occitanie",
    "Bordeaux": "Nouvelle-Aquitaine",
    "Lille": "Hauts-de-France"
}

# Types de biens avec leurs caractéristiques
property_types = {
    'Studio': {'min_price': 100000, 'max_price': 300000, 'min_surface': 15, 'max_surface': 35},
    'T2': {'min_price': 150000, 'max_price': 400000, 'min_surface': 30, 'max_surface': 50},
    'T3': {'min_price': 200000, 'max_price': 600000, 'min_surface': 45, 'max_surface': 75},
    'T4': {'min_price': 250000, 'max_price': 800000, 'min_surface': 60, 'max_surface': 100},
    'T5': {'min_price': 300000, 'max_price': 1000000, 'min_surface': 80, 'max_surface': 130},
    'Duplex': {'min_price': 350000, 'max_price': 1200000, 'min_surface': 70, 'max_surface': 150},
    'Commercial': {'min_price': 200000, 'max_price': 2000000, 'min_surface': 50, 'max_surface': 500}
}

# Liste des promoteurs immobiliers
developers = [
    "Nexity", "Bouygues Immobilier", "Vinci Immobilier", "Kaufman & Broad",
    "Eiffage Immobilier", "Cogedim", "Icade", "Pitch Promotion"
]

# Statuts possibles
statuses = ["À vendre", "Vendu", "En négociation", "Réservé"]

# Fonction pour générer une adresse complète
def generate_address(city, postal_code):
    street_number = random.randint(1, 150)
    street_type = random.choice(["rue", "avenue", "boulevard", "place"])
    street_name = fake.street_name()
    return f"{street_number} {street_type} {street_name}, {postal_code} {city}"

# Fonction pour générer une URL d'image fictive
def generate_image_url(property_type, id):
    return f"https://example.com/images/properties/{property_type.lower()}/{id}.jpg"

def generate_data():
    """Génère les données des biens immobiliers"""
    data = []
    id_counter = 1

    for city, postal_codes in cities.items():
        num_properties = random.randint(15, 25)
        
        for _ in range(num_properties):
            property_type = random.choice(list(property_types.keys()))
            type_info = property_types[property_type]
            postal_code = random.choice(postal_codes)
            
            base_price = random.randint(type_info['min_price'], type_info['max_price'])
            city_multiplier = 2.0 if city == "Paris" else 1.0
            final_price = int(base_price * city_multiplier)
            
            surface = random.randint(type_info['min_surface'], type_info['max_surface'])
            
            property_names = {
                'Studio': ["Le Studio", "Le Cosy", "Le Compact"],
                'T2': ["Le Duo", "L'Équilibre", "Le Confort"],
                'T3': ["Le Familial", "Le Trilogie", "L'Harmonie"],
                'T4': ["Le Spacieux", "Le Quatuor", "Le Prestige"],
                'T5': ["Le Majestueux", "Le Quintessence", "L'Excellence"],
                'Duplex': ["Le Duplex", "Le Panorama", "L'Horizon"],
                'Commercial': ["Le Business", "Le Commerce", "Le Professionnel"]
            }
            name_base = random.choice(property_names[property_type])
            name = f"{name_base} - {city}"

            row = {
                'ID': id_counter,
                'Nom': name,
                'Type': property_type,
                'Surface': surface,
                'Prix': final_price,
                'Prix_m2': round(final_price / surface),
                'Adresse': generate_address(city, postal_code),
                'Ville': city,
                'Code_Postal': postal_code,
                'Region': city_to_region[city],
                'Image': generate_image_url(property_type, id_counter),
                'Promoteur': random.choice(developers),
                'Statut': random.choice(statuses),
                'Année_Construction': random.randint(1950, 2024),
                'DPE': random.choice(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
                'Charges_Mensuelles': round(random.uniform(1, 5) * surface),
                'Taxe_Fonciere': round(final_price * 0.005),
                'Rentabilite': round(random.uniform(2, 8), 2),
                'Parking': random.choice([True, False]),
                'Balcon': random.choice([True, False]),
                'Ascenseur': random.choice([True, False]),
                'Etage': random.randint(0, 15) if random.random() > 0.2 else 0,
                'Nombre_Etages': random.randint(1, 20),
                'Date_Disponibilite': fake.date_between(start_date='+1d', end_date='+2y').strftime('%Y-%m-%d')
            }
            
            data.append(row)
            id_counter += 1
    
    return data

def save_as_csv(data, filename="biens_immobiliers.csv"):
    """Sauvegarde les données au format CSV"""
    df = pd.DataFrame(data)
    file_path = os.path.join("data", filename)
    df.to_csv(file_path, index=False, encoding='utf-8')
    print(f"Fichier CSV généré : {file_path}")

def save_as_json(data, filename="biens_immobiliers.json"):
    """Sauvegarde les données au format JSON"""
    file_path = os.path.join("data", filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({"biens": data}, f, ensure_ascii=False, indent=2)
    print(f"Fichier JSON généré : {file_path}")

def save_as_pdf(data, filename="biens_immobiliers.pdf"):
    """Sauvegarde les données au format PDF avec support Unicode"""
    pdf = FPDF()
    pdf.add_page()
    
    # Utilisation de la police par défaut avec support Unicode
    pdf.set_font("Helvetica", size=12)
    
    # Titre
    pdf.set_font("Helvetica", size=16)
    pdf.cell(190, 10, "Liste des Biens Immobiliers", ln=True, align='C')
    pdf.ln(10)
    
    # Pour chaque bien
    for bien in data:
        # En-tête du bien
        pdf.set_font("Helvetica", 'B', size=14)
        pdf.cell(190, 10, bien['Nom'], ln=True)
        
        # Détails du bien
        pdf.set_font("Helvetica", size=12)
        
        # Formatage du prix avec le symbole EUR
        prix_formatte = f"{bien['Prix']:,}".replace(",", " ") + " EUR"
        
        details = [
            f"Type: {bien['Type']}",
            f"Surface: {bien['Surface']} m2",
            f"Prix: {prix_formatte}",
            f"Adresse: {bien['Adresse']}",
            f"Ville: {bien['Ville']}",
            f"Statut: {bien['Statut']}"
        ]
        
        # Affichage des détails ligne par ligne
        for detail in details:
            pdf.cell(190, 8, detail, ln=True)
        
        pdf.ln(5)
    
    file_path = os.path.join("data", filename)
    pdf.output(file_path)
    print(f"Fichier PDF généré : {file_path}") 

if __name__ == "__main__":
    # Génération des données
    print("Génération des données...")
    data = generate_data()
    print(f"Nombre total de biens générés : {len(data)}")
    
    # Sauvegarde dans les différents formats
    save_as_csv(data)
    save_as_json(data)
    save_as_pdf(data)
