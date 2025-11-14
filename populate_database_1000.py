#!/usr/bin/env python3
"""
Script to populate database with 1000+ wines and 1000+ coffees
Ensures all products are properly organized with complete data
"""
import pymysql
import random
from datetime import datetime

# Database connection
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='MyNewPass123!',
    database='wine_coffee_db',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

cursor = conn.cursor()

# Check current counts
cursor.execute("SELECT COUNT(*) as count FROM wines")
wine_count = cursor.fetchone()['count']
cursor.execute("SELECT COUNT(*) as count FROM coffees")
coffee_count = cursor.fetchone()['count']

print(f"Current database status:")
print(f"  Wines: {wine_count}")
print(f"  Coffees: {coffee_count}")
print()

# Wine data templates
WINE_TYPES = ['red', 'white', 'rose', 'sparkling']
WINE_REGIONS = {
    'France': ['Bordeaux', 'Burgundy', 'Champagne', 'Rhône', 'Loire Valley', 'Alsace', 'Provence', 'Languedoc'],
    'Italy': ['Tuscany', 'Piedmont', 'Veneto', 'Sicily', 'Puglia', 'Abruzzo', 'Campania', 'Lombardy'],
    'Spain': ['Rioja', 'Ribera del Duero', 'Priorat', 'Rías Baixas', 'Catalonia', 'Valencia'],
    'USA': ['Napa Valley', 'Sonoma', 'Oregon', 'Washington', 'California', 'Willamette Valley'],
    'Australia': ['Barossa Valley', 'Hunter Valley', 'Margaret River', 'Yarra Valley', 'McLaren Vale'],
    'Chile': ['Maipo Valley', 'Casablanca Valley', 'Colchagua Valley', 'Rapel Valley'],
    'Argentina': ['Mendoza', 'Salta', 'Patagonia'],
    'Germany': ['Mosel', 'Rheingau', 'Pfalz', 'Baden'],
    'New Zealand': ['Marlborough', 'Central Otago', 'Hawke\'s Bay'],
    'India': ['Nashik Valley', 'Nandi Hills', 'Hampi Hills', 'Akluj', 'Goa'],
    'Portugal': ['Douro', 'Alentejo', 'Dão', 'Bairrada'],
    'South Africa': ['Stellenbosch', 'Franschhoek', 'Paarl', 'Constantia']
}

WINE_NAMES_TEMPLATES = {
    'red': ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Shiraz', 'Syrah', 'Malbec', 'Tempranillo', 'Zinfandel', 'Sangiovese', 'Nebbiolo', 'Barbera', 'Grenache', 'Mourvèdre', 'Carignan', 'Cinsault'],
    'white': ['Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Pinot Grigio', 'Gewürztraminer', 'Viognier', 'Chenin Blanc', 'Semillon', 'Albariño', 'Vermentino', 'Muscat', 'Torrontés'],
    'rose': ['Rosé', 'Provence Rosé', 'Pinot Noir Rosé', 'Grenache Rosé', 'Sangiovese Rosé'],
    'sparkling': ['Champagne', 'Prosecco', 'Cava', 'Crémant', 'Sparkling', 'Brut', 'Méthode Champenoise']
}

ACIDITY_LEVELS = ['low', 'medium', 'high']
SWEETNESS_LEVELS = ['dry', 'off-dry', 'semi-sweet', 'sweet']

# Coffee data templates
COFFEE_TYPES = ['arabica', 'robusta']
COFFEE_ORIGINS = {
    'Ethiopia': ['Yirgacheffe', 'Sidamo', 'Harrar', 'Guji', 'Limu', 'Lekempti', 'Oromia'],
    'Colombia': ['Huila', 'Cauca', 'Antioquia', 'Caldas', 'Tolima', 'Nariño', 'Magdalena'],
    'Brazil': ['Minas Gerais', 'Sul de Minas', 'Cerrado', 'Mogiana', 'Espírito Santo', 'Campos Gerais'],
    'Guatemala': ['Antigua', 'Huehuetenango', 'Lake Atitlán', 'Cobán', 'Fraijanes', 'San Marcos'],
    'Costa Rica': ['Tarrazu', 'Tres Rios', 'West Valley', 'Central Valley', 'Heredia', 'Brunca'],
    'Kenya': ['Nyeri', 'Kiambu', 'Nyanza', 'Muranga', 'Mount Kenya', 'Embu'],
    'India': ['Coorg', 'Chikmagalur', 'Nilgiris', 'Karnataka', 'Wayanad', 'Araku Valley', 'Meghalaya', 'Malabar'],
    'Indonesia': ['Sumatra', 'Java', 'Sulawesi', 'Bali', 'Aceh', 'Flores', 'Papua', 'Kalimantan'],
    'Honduras': ['Marcala', 'Copán', 'Ocotepeque'],
    'Peru': ['Cajamarca', 'Cusco', 'Junín'],
    'Mexico': ['Chiapas', 'Veracruz', 'Oaxaca'],
    'Nicaragua': ['Jinotega', 'Matagalpa', 'Nueva Segovia'],
    'El Salvador': ['Santa Ana', 'Ahuachapán', 'Chalatenango'],
    'Panama': ['Boquete', 'Volcán', 'Renacimiento'],
    'Hawaii': ['Kona', 'Ka\'u', 'Maui'],
    'Jamaica': ['Blue Mountains', 'High Mountain'],
    'Tanzania': ['Kilimanjaro', 'Arusha', 'Mbeya'],
    'Yemen': ['Yemen', 'Mocha'],
    'Vietnam': ['Dak Lak', 'Lam Dong', 'Gia Lai']
}

COFFEE_ROAST_LEVELS = ['light', 'medium', 'medium-dark', 'dark']

def generate_wine_name(wine_type, country):
    """Generate a wine name"""
    base_names = WINE_NAMES_TEMPLATES.get(wine_type, ['Wine'])
    base_name = random.choice(base_names)
    
    # Add region or estate name
    prefixes = ['Château', 'Domaine', 'Estate', 'Vineyard', 'Reserve', 'Grand', 'Premier', 'Vintage', 'Classic', 'Special']
    suffix = random.choice(prefixes) if random.random() > 0.5 else ''
    
    if suffix:
        return f"{suffix} {base_name}"
    else:
        return f"{base_name} {random.choice(['Reserve', 'Estate', 'Classic', ''])}".strip()

def generate_coffee_name(country, origin):
    """Generate a coffee name"""
    prefixes = ['Premium', 'Estate', 'Reserve', 'Special', 'Classic', 'Select', 'Finest', 'Grand', 'Supreme']
    suffixes = ['AA', 'AAA', 'Premium', 'Special Reserve', 'Estate Grown', 'Single Origin', 'Peaberry', 'SHB']
    
    prefix = random.choice(prefixes) if random.random() > 0.3 else ''
    suffix = random.choice(suffixes) if random.random() > 0.5 else ''
    
    name = f"{country} {origin}"
    if prefix:
        name = f"{prefix} {name}"
    if suffix:
        name = f"{name} {suffix}"
    
    return name

def generate_wines(target_count=1000):
    """Generate wines to reach target count"""
    needed = max(0, target_count - wine_count)
    if needed == 0:
        print(f"✅ Already have {wine_count} wines. Target reached!")
        return 0
    
    print(f"Generating {needed} additional wines...")
    
    wines_inserted = 0
    countries = list(WINE_REGIONS.keys())
    
    for i in range(needed):
        country = random.choice(countries)
        region = random.choice(WINE_REGIONS[country])
        wine_type = random.choice(WINE_TYPES)
        name = generate_wine_name(wine_type, country)
        
        # Vintage between 2015-2022
        vintage = random.randint(2015, 2022)
        
        # Price range based on wine type and country
        if wine_type == 'sparkling' or country in ['France', 'Italy']:
            price = random.randint(2000, 50000)
        elif country in ['USA', 'Australia', 'Spain']:
            price = random.randint(1500, 25000)
        else:
            price = random.randint(1000, 15000)
        
        # Alcohol content based on type
        if wine_type == 'sparkling':
            alcohol = round(random.uniform(11.0, 13.0), 1)
        elif wine_type == 'rose':
            alcohol = round(random.uniform(12.0, 13.5), 1)
        elif wine_type == 'white':
            alcohol = round(random.uniform(12.0, 14.0), 1)
        else:  # red
            alcohol = round(random.uniform(13.0, 15.5), 1)
        
        acidity = random.choice(ACIDITY_LEVELS)
        sweetness = random.choice(SWEETNESS_LEVELS)
        
        try:
            cursor.execute("""
                INSERT INTO wines (name, type, region, country, vintage, price, alcohol_content, acidity_level, sweetness_level, currency, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'INR', %s)
            """, (name, wine_type, region, country, vintage, price, alcohol, acidity, sweetness, datetime.now()))
            wines_inserted += 1
            
            if wines_inserted % 100 == 0:
                print(f"  Inserted {wines_inserted} wines...")
                conn.commit()
        except Exception as e:
            print(f"  Error inserting wine {i+1}: {e}")
            continue
    
    conn.commit()
    print(f"✅ Inserted {wines_inserted} wines")
    return wines_inserted

def generate_coffees(target_count=1000):
    """Generate coffees to reach target count"""
    needed = max(0, target_count - coffee_count)
    if needed == 0:
        print(f"✅ Already have {coffee_count} coffees. Target reached!")
        return 0
    
    print(f"Generating {needed} additional coffees...")
    
    coffees_inserted = 0
    countries = list(COFFEE_ORIGINS.keys())
    
    for i in range(needed):
        country = random.choice(countries)
        origin = random.choice(COFFEE_ORIGINS[country])
        coffee_type = random.choice(COFFEE_TYPES)
        name = generate_coffee_name(country, origin)
        
        # Roast level - more variety
        roast_level = random.choice(COFFEE_ROAST_LEVELS)
        
        # Price based on origin and type
        if country in ['Hawaii', 'Jamaica', 'Panama', 'Yemen']:
            price = random.randint(5000, 15000)
        elif country in ['Ethiopia', 'Kenya', 'Colombia', 'Costa Rica']:
            price = random.randint(2500, 8000)
        elif coffee_type == 'robusta':
            price = random.randint(1500, 3000)
        else:
            price = random.randint(2000, 6000)
        
        acidity = random.choice(ACIDITY_LEVELS)
        
        # Description
        descriptions = [
            f"Premium {coffee_type} from {origin}, {country}",
            f"Estate-grown {coffee_type} with balanced flavor profile",
            f"Single-origin {coffee_type} featuring notes of chocolate and citrus",
            f"Specialty {coffee_type} with complex flavor notes",
            f"High-altitude {coffee_type} with bright acidity",
            f"Artisan {coffee_type} from {origin} region"
        ]
        description = random.choice(descriptions)
        
        try:
            cursor.execute("""
                INSERT INTO coffees (name, type, origin, country, roast_level, price, acidity_level, description, currency, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'INR', %s)
            """, (name, coffee_type, origin, country, roast_level, price, acidity, description, datetime.now()))
            coffees_inserted += 1
            
            if coffees_inserted % 100 == 0:
                print(f"  Inserted {coffees_inserted} coffees...")
                conn.commit()
        except Exception as e:
            print(f"  Error inserting coffee {i+1}: {e}")
            continue
    
    conn.commit()
    print(f"✅ Inserted {coffees_inserted} coffees")
    return coffees_inserted

def verify_organization():
    """Verify that all products are properly organized"""
    print("\n" + "="*80)
    print("VERIFYING DATABASE ORGANIZATION")
    print("="*80)
    
    # Check wines
    cursor.execute("SELECT COUNT(*) as count FROM wines WHERE name IS NULL OR type IS NULL")
    null_wines = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM wines")
    total_wines = cursor.fetchone()['count']
    
    cursor.execute("SELECT type, COUNT(*) as count FROM wines GROUP BY type ORDER BY type")
    wine_types = cursor.fetchall()
    
    cursor.execute("SELECT country, COUNT(*) as count FROM wines GROUP BY country ORDER BY count DESC LIMIT 10")
    wine_countries = cursor.fetchall()
    
    # Check coffees
    cursor.execute("SELECT COUNT(*) as count FROM coffees WHERE name IS NULL OR type IS NULL")
    null_coffees = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM coffees")
    total_coffees = cursor.fetchone()['count']
    
    cursor.execute("SELECT type, COUNT(*) as count FROM coffees GROUP BY type ORDER BY type")
    coffee_types = cursor.fetchall()
    
    cursor.execute("SELECT country, COUNT(*) as count FROM coffees GROUP BY country ORDER BY count DESC LIMIT 10")
    coffee_countries = cursor.fetchall()
    
    print(f"\nWINES:")
    print(f"  Total: {total_wines}")
    print(f"  With null values: {null_wines}")
    print(f"  Types distribution:")
    for wt in wine_types:
        percentage = (wt['count'] / total_wines * 100) if total_wines > 0 else 0
        print(f"    • {wt['type']:<15} {wt['count']:>4} wines ({percentage:>5.1f}%)")
    print(f"  Top countries:")
    for wc in wine_countries:
        print(f"    • {wc['country']:<20} {wc['count']:>4} wines")
    
    print(f"\nCOFFEES:")
    print(f"  Total: {total_coffees}")
    print(f"  With null values: {null_coffees}")
    print(f"  Types distribution:")
    for ct in coffee_types:
        percentage = (ct['count'] / total_coffees * 100) if total_coffees > 0 else 0
        print(f"    • {ct['type']:<15} {ct['count']:>4} coffees ({percentage:>5.1f}%)")
    print(f"  Top countries:")
    for cc in coffee_countries:
        print(f"    • {cc['country']:<20} {cc['count']:>4} coffees")
    
    print("\n" + "="*80)
    if null_wines == 0 and null_coffees == 0 and total_wines >= 1000 and total_coffees >= 1000:
        print("✅ DATABASE IS PROPERLY ORGANIZED!")
        print(f"   ✓ {total_wines} wines (target: 1000+)")
        print(f"   ✓ {total_coffees} coffees (target: 1000+)")
        print(f"   ✓ No null values in required fields")
    else:
        print("⚠️  ISSUES FOUND:")
        if total_wines < 1000:
            print(f"   ✗ Only {total_wines} wines (need 1000+)")
        if total_coffees < 1000:
            print(f"   ✗ Only {total_coffees} coffees (need 1000+)")
        if null_wines > 0:
            print(f"   ✗ {null_wines} wines with null values")
        if null_coffees > 0:
            print(f"   ✗ {null_coffees} coffees with null values")
    print("="*80)

if __name__ == "__main__":
    try:
        print("\n" + "="*80)
        print("DATABASE POPULATION SCRIPT - 1000+ WINES & COFFEES")
        print("="*80)
        print()
        
        # Generate wines
        wines_added = generate_wines(1000)
        
        # Generate coffees
        coffees_added = generate_coffees(1000)
        
        # Verify organization
        verify_organization()
        
        print("\n✅ Database population completed!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        cursor.close()
        conn.close()

