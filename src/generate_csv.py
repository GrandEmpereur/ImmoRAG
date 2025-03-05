# generate_csv.py
import pandas as pd
import random
import os

# Création du dossier data s'il n'existe pas
os.makedirs("data", exist_ok=True)

# Liste de 10 villes de France
cities = [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice",
    "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"
]

# Mapping de chaque ville à une région (choix arbitraires)
city_to_region = {
    "Paris": "Central",
    "Marseille": "South",
    "Lyon": "Central",
    "Toulouse": "South",
    "Nice": "South",
    "Nantes": "West",
    "Strasbourg": "East",
    "Montpellier": "South",
    "Bordeaux": "West",
    "Lille": "North"
}

property_types = ['Apartment', 'House', 'Commercial', 'Villa', 'Studio']

data = []
id_counter = 1
# Pour chaque ville, générer environ 10 offres immobilières
for city in cities:
    for _ in range(10):
        row = {
            'ID': id_counter,
            'Region': city_to_region[city],
            'City': city,
            'Property_Type': random.choice(property_types),
            'Average_Price': random.randint(100000, 1000000),
            'Transactions': random.randint(5, 50),
            'Occupancy_Rate': round(random.uniform(70, 100), 2),
            'Rental_Yield': round(random.uniform(2, 10), 2),
            'Market_Growth': round(random.uniform(-5, 20), 2)
        }
        data.append(row)
        id_counter += 1

df = pd.DataFrame(data)
csv_path = "data/kpi_immobilier.csv"
df.to_csv(csv_path, index=False)
print(f"CSV généré avec succès : {csv_path}")
