# generate_csv.py
import pandas as pd
import random
import os
from faker import Faker

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

data = []
id_counter = 1

# Pour chaque ville, générer des biens immobiliers
for city, postal_codes in cities.items():
    num_properties = random.randint(15, 25)  # Nombre aléatoire de propriétés par ville
    
    for _ in range(num_properties):
        property_type = random.choice(list(property_types.keys()))
        type_info = property_types[property_type]
        postal_code = random.choice(postal_codes)
        
        # Calcul du prix en fonction du type et de la ville
        base_price = random.randint(type_info['min_price'], type_info['max_price'])
        city_multiplier = 2.0 if city == "Paris" else 1.0
        final_price = int(base_price * city_multiplier)
        
        # Calcul de la surface
        surface = random.randint(type_info['min_surface'], type_info['max_surface'])
        
        # Génération du nom du bien
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
            'Taxe_Fonciere': round(final_price * 0.005),  # 0.5% du prix
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

# Création du DataFrame et export en CSV
df = pd.DataFrame(data)
csv_path = "data/biens_immobiliers.csv"
df.to_csv(csv_path, index=False, encoding='utf-8')
print(f"CSV généré avec succès : {csv_path}")
print(f"Nombre total de biens générés : {len(data)}")
