import pymysql

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='MyNewPass123!',
    database='wine_coffee_db',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

cursor = conn.cursor()

# Indian Wines
indian_wines = [
    ('Sula Sauvignon Blanc', 'white', 'Nashik Valley', 'India', 2021, 2200, 12.5, 'high', 'dry'),
    ('Sula Chenin Blanc', 'white', 'Nashik Valley', 'India', 2020, 1800, 12.0, 'medium', 'dry'),
    ('Sula Cabernet Shiraz', 'red', 'Nashik Valley', 'India', 2019, 2500, 13.0, 'medium', 'dry'),
    ('Grover Zampa Art Collection', 'red', 'Bangalore', 'India', 2018, 3500, 13.5, 'medium', 'dry'),
    ('Grover Vineyards Cabernet Shiraz', 'red', 'Nandi Hills', 'India', 2019, 2800, 13.0, 'medium', 'dry'),
    ('Grover Sauvignon Blanc Reserve', 'white', 'Nandi Hills', 'India', 2020, 3200, 12.0, 'high', 'dry'),
    ('Big Banyan Cabernet Shiraz', 'red', 'Nandi Hills', 'India', 2019, 1800, 13.5, 'medium', 'dry'),
    ('Big Banyan Merlot', 'red', 'Nandi Hills', 'India', 2020, 2000, 13.0, 'medium', 'dry'),
    ('Fraternity Shiraz', 'red', 'Nashik Valley', 'India', 2019, 2200, 13.5, 'medium', 'dry'),
    ('Chandon Brut', 'sparkling', 'Nashik Valley', 'India', 2021, 3500, 12.5, 'medium', 'dry'),
    ('Fratelli Sette Rose', 'rose', 'Akluj', 'India', 2021, 2500, 12.5, 'medium', 'dry'),
    ('Fratelli Cabernet Merlot', 'red', 'Akluj', 'India', 2019, 2800, 13.0, 'medium', 'dry'),
    ('KRSMA Sauvignon Blanc', 'white', 'Hampi Hills', 'India', 2020, 4500, 12.5, 'high', 'dry'),
    ('Reveilo Classic Reserve', 'red', 'Nashik Valley', 'India', 2018, 3200, 13.5, 'medium', 'dry'),
    ('York Arros Chenin Blanc', 'white', 'Goa', 'India', 2020, 2500, 12.0, 'medium', 'dry'),
    ('La Reserve Shiraz', 'red', 'Nashik Valley', 'India', 2019, 3500, 13.5, 'medium', 'dry'),
    ('Indus Cabernet Sauvignon', 'red', 'Baramati', 'India', 2018, 2800, 13.0, 'medium', 'dry'),
    ('Soma Chenin Blanc', 'white', 'Panchgani', 'India', 2021, 2200, 12.5, 'medium', 'dry'),
    ('Charosa Tempranillo', 'red', 'Nashik Valley', 'India', 2019, 4200, 13.5, 'medium', 'dry'),
    ('Soma Zinfandel', 'red', 'Panchgani', 'India', 2019, 3500, 13.0, 'medium', 'dry'),
]

# Indian Coffees
indian_coffees = [
    ('Monsooned Malabar', 'arabica', 'Malabar', 'India', 'medium', 2800, 'low'),
    ('Coorg Estate', 'arabica', 'Coorg', 'India', 'medium', 3200, 'medium'),
    ('Chikmagalur Arabica', 'arabica', 'Chikmagalur', 'India', 'medium', 3000, 'medium'),
    ('Karnataka Special Reserve', 'arabica', 'Karnataka', 'India', 'medium-dark', 3500, 'low'),
    ('Wayanad Robusta', 'robusta', 'Wayanad', 'India', 'dark', 2500, 'low'),
    ('Nilgiri Blue Mountain', 'arabica', 'Nilgiris', 'India', 'medium', 4200, 'high'),
    ('Tamil Nadu Filter Coffee', 'arabica', 'Coonoor', 'India', 'medium-dark', 2800, 'medium'),
    ('Araku Valley Arabica', 'arabica', 'Araku Valley', 'India', 'medium', 3800, 'medium'),
    ('Meghalaya Arabica', 'arabica', 'Meghalaya', 'India', 'medium', 3500, 'high'),
    ('Karnataka Peaberry', 'arabica', 'Chikmagalur', 'India', 'medium', 4500, 'high'),
    ('Chikmagalur Estate', 'arabica', 'Chikmagalur', 'India', 'medium-dark', 3200, 'medium'),
    ('Nilgiri Classic', 'arabica', 'Nilgiris', 'India', 'medium', 3000, 'medium'),
    ('Coorg Mysore Nuggets', 'arabica', 'Coorg', 'India', 'medium', 5500, 'medium'),
    ('Baba Budan Giri', 'arabica', 'Chikmagalur', 'India', 'medium', 4200, 'high'),
    ('Manjarabad Estate', 'arabica', 'Karnataka', 'India', 'medium', 3500, 'medium'),
    ('Suntikoppa Arabica', 'arabica', 'Coorg', 'India', 'medium', 3200, 'medium'),
    ('Doddabetta Estate', 'arabica', 'Ooty', 'India', 'medium', 4500, 'medium'),
    ('Joida Estate Robusta', 'robusta', 'Karnataka', 'India', 'dark', 2200, 'low'),
    ('Hassan Arabica Reserve', 'arabica', 'Hassan', 'India', 'medium', 4000, 'medium'),
    ('Kodagu Coffee', 'arabica', 'Coorg', 'India', 'medium-dark', 3800, 'medium'),
    ('Kerala Monsoon', 'arabica', 'Wayanad', 'India', 'medium', 3500, 'low'),
    ('Nilgiri Plantation AA', 'arabica', 'Nilgiris', 'India', 'medium', 4800, 'medium'),
    ('Baba Budan Classic', 'arabica', 'Chikmagalur', 'India', 'medium-dark', 3200, 'medium'),
    ('Manor Estate Premium', 'arabica', 'Nandi Hills', 'India', 'medium', 4200, 'medium'),
    ('Mysore Bold', 'arabica', 'Mysore', 'India', 'medium-dark', 3000, 'low'),
]

print('Inserting Indian wines...')
for i, wine in enumerate(indian_wines, 1):
    try:
        cursor.execute("""
            INSERT INTO wines (name, type, region, country, vintage, price, alcohol_content, acidity_level, sweetness_level, currency)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'INR')
        """, wine)
        print(f'Inserted wine {i}: {wine[0]}')
    except Exception as e:
        print(f'Error inserting wine {i}: {e}')

print('\nInserting Indian coffees...')
for i, coffee in enumerate(indian_coffees, 1):
    try:
        cursor.execute("""
            INSERT INTO coffees (name, type, origin, country, roast_level, price, acidity_level, currency)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'INR')
        """, coffee)
        print(f'Inserted coffee {i}: {coffee[0]}')
    except Exception as e:
        print(f'Error inserting coffee {i}: {e}')

conn.commit()
cursor.close()
conn.close()

print(f'\n✅ Successfully inserted {len(indian_wines)} Indian wines and {len(indian_coffees)} Indian coffees!')

