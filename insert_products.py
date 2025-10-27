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

# 100 real wines from around the world
wines = [
    # French Wines (25)
    ('Château Margaux', 'red', 'Margaux', 'France', 2018, 45000, 13.5, 'medium', 'dry'),
    ('Dom Pérignon Champagne', 'sparkling', 'Champagne', 'France', 2010, 25000, 12.5, 'medium', 'dry'),
    ('Château Lafite Rothschild', 'red', 'Pauillac', 'France', 2016, 65000, 13.0, 'medium', 'dry'),
    ('Sancerre Blanc', 'white', 'Loire Valley', 'France', 2020, 3500, 12.5, 'high', 'dry'),
    ('Châteauneuf-du-Pape', 'red', 'Rhône', 'France', 2019, 8500, 14.5, 'medium', 'dry'),
    ('Bordeaux Supérieur', 'red', 'Bordeaux', 'France', 2018, 4500, 13.0, 'medium', 'dry'),
    ('Burgundy Pinot Noir', 'red', 'Burgundy', 'France', 2017, 12000, 13.5, 'medium', 'dry'),
    ('Chablis Premier Cru', 'white', 'Chablis', 'France', 2019, 5500, 13.0, 'high', 'dry'),
    ('Côtes du Rhône', 'red', 'Rhône', 'France', 2020, 2800, 14.0, 'medium', 'dry'),
    ('Champagne Krug', 'sparkling', 'Champagne', 'France', 2008, 32000, 12.0, 'medium', 'dry'),
    ('Côtes de Provence Rosé', 'rose', 'Provence', 'France', 2021, 3500, 12.5, 'medium', 'dry'),
    ('Bordeaux Blanc', 'white', 'Bordeaux', 'France', 2020, 3200, 12.0, 'medium', 'dry'),
    ('Gigondas', 'red', 'Rhône', 'France', 2019, 5500, 14.0, 'medium', 'dry'),
    ('Vouvray', 'white', 'Loire Valley', 'France', 2020, 2800, 12.5, 'medium', 'dry'),
    ('Champagne Moët', 'sparkling', 'Champagne', 'France', 2016, 8500, 12.0, 'medium', 'dry'),
    ('Médoc', 'red', 'Bordeaux', 'France', 2018, 4200, 13.0, 'medium', 'dry'),
    ('Champagne Cristal', 'sparkling', 'Champagne', 'France', 2012, 35000, 12.5, 'medium', 'dry'),
    ('Côte-Rôtie', 'red', 'Rhône', 'France', 2018, 12000, 13.5, 'medium', 'dry'),
    ('Muscadet', 'white', 'Loire Valley', 'France', 2020, 2500, 12.0, 'high', 'dry'),
    ('Champagne Dom Ruinart', 'sparkling', 'Champagne', 'France', 2014, 15000, 12.0, 'medium', 'dry'),
    ('Beaujolais Villages', 'red', 'Beaujolais', 'France', 2020, 2200, 12.5, 'medium', 'dry'),
    ('Champagne Taittinger', 'sparkling', 'Champagne', 'France', 2018, 6500, 12.0, 'medium', 'dry'),
    ('Saint-Julien', 'red', 'Bordeaux', 'France', 2017, 45000, 13.5, 'medium', 'dry'),
    ('Chablis Grand Cru', 'white', 'Chablis', 'France', 2018, 12000, 13.0, 'high', 'dry'),
    ('Champagne Bollinger', 'sparkling', 'Champagne', 'France', 2013, 18000, 12.5, 'medium', 'dry'),
    
    # Italian Wines (25)
    ('Barolo', 'red', 'Piedmont', 'Italy', 2016, 12000, 14.0, 'high', 'dry'),
    ('Chianti Classico', 'red', 'Tuscany', 'Italy', 2018, 5500, 13.5, 'high', 'dry'),
    ('Amarone della Valpolicella', 'red', 'Veneto', 'Italy', 2017, 15000, 16.0, 'medium', 'off-dry'),
    ('Pinot Grigio', 'white', 'Friuli', 'Italy', 2021, 3000, 12.0, 'medium', 'dry'),
    ('Brunello di Montalcino', 'red', 'Tuscany', 'Italy', 2015, 18000, 14.5, 'high', 'dry'),
    ('Prosecco Superiore', 'sparkling', 'Veneto', 'Italy', 2021, 2500, 11.5, 'medium', 'off-dry'),
    ('Barbaresco', 'red', 'Piedmont', 'Italy', 2017, 9800, 14.0, 'high', 'dry'),
    ('Super Tuscan', 'red', 'Tuscany', 'Italy', 2018, 22000, 14.5, 'medium', 'dry'),
    ('Valpolicella Ripasso', 'red', 'Veneto', 'Italy', 2019, 4500, 13.5, 'medium', 'dry'),
    ('Montepulciano d\'Abruzzo', 'red', 'Abruzzo', 'Italy', 2019, 2200, 13.5, 'medium', 'dry'),
    ('Soave', 'white', 'Veneto', 'Italy', 2020, 2800, 12.5, 'medium', 'dry'),
    ('Barbaresco Riserva', 'red', 'Piedmont', 'Italy', 2015, 15000, 14.0, 'high', 'dry'),
    ('Barolo Riserva', 'red', 'Piedmont', 'Italy', 2014, 25000, 14.5, 'high', 'dry'),
    ('Pinot Bianco', 'white', 'Alto Adige', 'Italy', 2020, 3200, 13.0, 'medium', 'dry'),
    ('Chianti Riserva', 'red', 'Tuscany', 'Italy', 2017, 8500, 13.5, 'high', 'dry'),
    ('Nebbiolo d\'Alba', 'red', 'Piedmont', 'Italy', 2018, 5500, 13.5, 'high', 'dry'),
    ('Dolcetto d\'Asti', 'red', 'Piedmont', 'Italy', 2020, 2800, 13.0, 'low', 'dry'),
    ('Asti Spumante', 'sparkling', 'Piedmont', 'Italy', 2021, 2200, 7.0, 'medium', 'sweet'),
    ('Tuscan IGT', 'red', 'Tuscany', 'Italy', 2019, 4500, 13.5, 'medium', 'dry'),
    ('Chianti Gran Selezione', 'red', 'Tuscany', 'Italy', 2016, 15000, 14.0, 'high', 'dry'),
    ('Cannonau di Sardegna', 'red', 'Sardinia', 'Italy', 2019, 3500, 14.0, 'medium', 'dry'),
    ('Frascati', 'white', 'Lazio', 'Italy', 2020, 2500, 12.5, 'medium', 'dry'),
    ('Gavi', 'white', 'Piedmont', 'Italy', 2020, 4000, 12.5, 'high', 'dry'),
    ('Montepulciano d\'Abruzzo', 'red', 'Abruzzo', 'Italy', 2018, 2800, 13.5, 'medium', 'dry'),
    ('Fiano di Avellino', 'white', 'Campania', 'Italy', 2019, 4500, 13.0, 'medium', 'dry'),
    
    # California Wines (15)
    ('Opus One', 'red', 'Napa Valley', 'USA', 2017, 28000, 14.5, 'medium', 'dry'),
    ('Caymus Cabernet Sauvignon', 'red', 'Napa Valley', 'USA', 2019, 9500, 14.5, 'medium', 'dry'),
    ('Domaine Serene Pinot Noir', 'red', 'Oregon', 'USA', 2018, 12000, 14.0, 'high', 'dry'),
    ('Rombauer Chardonnay', 'white', 'Napa Valley', 'USA', 2020, 5500, 14.5, 'low', 'off-dry'),
    ('Stags Leap Cabernet', 'red', 'Napa Valley', 'USA', 2018, 18000, 14.5, 'medium', 'dry'),
    ('Beringer Private Reserve', 'red', 'Napa Valley', 'USA', 2016, 22000, 14.0, 'medium', 'dry'),
    ('Jordan Chardonnay', 'white', 'Sonoma', 'USA', 2020, 6500, 13.5, 'medium', 'dry'),
    ('Silver Oak Cabernet', 'red', 'Napa Valley', 'USA', 2018, 25000, 14.5, 'medium', 'dry'),
    ('Kendall Jackson Chardonnay', 'white', 'California', 'USA', 2020, 3500, 13.5, 'medium', 'dry'),
    ('Ridge Zinfandel', 'red', 'Sonoma', 'USA', 2019, 6500, 14.5, 'medium', 'dry'),
    ('Robert Mondavi Reserve', 'red', 'Napa Valley', 'USA', 2017, 18000, 14.5, 'medium', 'dry'),
    ('Mondavi Cabernet', 'red', 'Napa Valley', 'USA', 2018, 5500, 14.0, 'medium', 'dry'),
    ('Chappellet Cabernet', 'red', 'Napa Valley', 'USA', 2016, 22000, 14.5, 'medium', 'dry'),
    ('Far Niente Chardonnay', 'white', 'Napa Valley', 'USA', 2019, 8500, 13.5, 'medium', 'dry'),
    ('Insignia Cabernet', 'red', 'Napa Valley', 'USA', 2017, 35000, 14.5, 'medium', 'dry'),
    
    # Spanish & Portuguese (10)
    ('Vega Sicilia', 'red', 'Ribera del Duero', 'Spain', 2015, 25000, 14.0, 'medium', 'dry'),
    ('Rioja Gran Reserva', 'red', 'Rioja', 'Spain', 2012, 8500, 13.5, 'medium', 'dry'),
    ('Albariño', 'white', 'Rías Baixas', 'Spain', 2020, 3500, 12.5, 'high', 'dry'),
    ('Tempranillo Reserva', 'red', 'Rioja', 'Spain', 2016, 9800, 14.0, 'medium', 'dry'),
    ('Priorat', 'red', 'Catalonia', 'Spain', 2018, 12000, 14.5, 'medium', 'dry'),
    ('Torres Mas La Plana', 'red', 'Penedès', 'Spain', 2017, 15000, 14.0, 'medium', 'dry'),
    ('Marqués de Riscal', 'red', 'Rioja', 'Spain', 2016, 6500, 13.5, 'medium', 'dry'),
    ('Porto Vintage', 'red', 'Douro', 'Portugal', 2015, 18000, 20.0, 'medium', 'sweet'),
    ('Madeira', 'red', 'Madeira', 'Portugal', 2012, 12000, 17.0, 'medium', 'sweet'),
    ('Vinho Verde', 'white', 'Minho', 'Portugal', 2021, 2200, 11.0, 'high', 'dry'),
    
    # Australian & New Zealand (10)
    ('Penfolds Grange', 'red', 'Barossa Valley', 'Australia', 2016, 85000, 14.5, 'medium', 'dry'),
    ('Henschke Hill of Grace', 'red', 'Eden Valley', 'Australia', 2015, 45000, 14.5, 'medium', 'dry'),
    ('Cloudy Bay Sauvignon Blanc', 'white', 'Marlborough', 'New Zealand', 2021, 5500, 13.0, 'high', 'dry'),
    ('Lindemans Bin 65 Chardonnay', 'white', 'SE Australia', 'Australia', 2020, 2800, 12.5, 'medium', 'dry'),
    ('Wolf Blass Yellow Label', 'red', 'South Australia', 'Australia', 2019, 3500, 14.0, 'medium', 'dry'),
    ('Marlborough Sauvignon Blanc', 'white', 'Marlborough', 'New Zealand', 2021, 4000, 12.5, 'high', 'dry'),
    ('Central Otago Pinot Noir', 'red', 'Central Otago', 'New Zealand', 2019, 8500, 13.5, 'high', 'dry'),
    ('Shiraz', 'red', 'Barossa Valley', 'Australia', 2019, 5500, 14.5, 'medium', 'dry'),
    ('Jacob\'s Creek Shiraz', 'red', 'South Australia', 'Australia', 2020, 3200, 14.0, 'medium', 'dry'),
    ('Jacob\'s Creek Cabernet', 'red', 'South Australia', 'Australia', 2020, 3000, 14.0, 'medium', 'dry'),
    
    # South American (10)
    ('Catena Malbec', 'red', 'Mendoza', 'Argentina', 2019, 4500, 14.0, 'medium', 'dry'),
    ('Casillero del Diablo', 'red', 'Maipo Valley', 'Chile', 2019, 3200, 13.5, 'medium', 'dry'),
    ('Concha y Toro', 'red', 'Central Valley', 'Chile', 2020, 2800, 13.5, 'medium', 'dry'),
    ('Santa Rita 120', 'red', 'Central Valley', 'Chile', 2020, 2200, 13.0, 'medium', 'dry'),
    ('Toro Negro Carmenère', 'red', 'Colchagua Valley', 'Chile', 2019, 3500, 14.0, 'medium', 'dry'),
    ('Malbec Reserva', 'red', 'Mendoza', 'Argentina', 2018, 6500, 14.0, 'medium', 'dry'),
    ('Carmenère Gran Reserva', 'red', 'Rapel Valley', 'Chile', 2017, 8500, 14.0, 'medium', 'dry'),
    ('Torrontés', 'white', 'Salta', 'Argentina', 2020, 3200, 13.0, 'medium', 'dry'),
    ('Bonarda', 'red', 'Mendoza', 'Argentina', 2019, 3500, 13.5, 'medium', 'dry'),
    ('Cabernet Franc', 'red', 'Casablanca Valley', 'Chile', 2020, 4500, 13.5, 'medium', 'dry'),
    
    # German & Austrian (5)
    ('Riesling Kabinett', 'white', 'Mosel', 'Germany', 2019, 4500, 9.0, 'high', 'off-dry'),
    ('Riesling Spätlese', 'white', 'Rheingau', 'Germany', 2018, 6500, 10.5, 'high', 'off-dry'),
    ('Gewürztraminer', 'white', 'Alsace', 'France', 2020, 5500, 13.0, 'low', 'semi-sweet'),
    ('Riesling Beerenauslese', 'white', 'Mosel', 'Germany', 2018, 15000, 8.0, 'high', 'sweet'),
    ('Grüner Veltliner', 'white', 'Lower Austria', 'Austria', 2020, 4500, 12.0, 'high', 'dry'),
]

# 100 real coffees from around the world
coffees = [
    # Ethiopian (15)
    ('Ethiopian Yirgacheffe', 'arabica', 'Yirgacheffe', 'Ethiopia', 'light', 2800, 'medium'),
    ('Ethiopian Sidamo', 'arabica', 'Sidamo', 'Ethiopia', 'light', 3200, 'medium'),
    ('Ethiopian Harrar', 'arabica', 'Harrar', 'Ethiopia', 'light', 3000, 'medium'),
    ('Ethiopian Guji', 'arabica', 'Guji', 'Ethiopia', 'light', 3500, 'high'),
    ('Ethiopian Limu', 'arabica', 'Limu', 'Ethiopia', 'light', 2900, 'medium'),
    ('Ethiopian Lekempti', 'arabica', 'Lekempti', 'Ethiopia', 'light', 2800, 'medium'),
    ('Ethiopian Sidamo Grade 2', 'arabica', 'Sidamo', 'Ethiopia', 'light', 3500, 'medium'),
    ('Ethiopian Yirgacheffe Grade 1', 'arabica', 'Yirgacheffe', 'Ethiopia', 'light', 4200, 'high'),
    ('Ethiopian Natural Process', 'arabica', 'Yirgacheffe', 'Ethiopia', 'light', 3800, 'medium'),
    ('Ethiopian Washed Process', 'arabica', 'Sidamo', 'Ethiopia', 'light', 3200, 'medium'),
    ('Ethiopian Gora Bela', 'arabica', 'Yirgacheffe', 'Ethiopia', 'light', 3500, 'high'),
    ('Ethiopian Special Reserve', 'arabica', 'Harrar', 'Ethiopia', 'medium', 4500, 'low'),
    ('Ethiopian Oromia', 'arabica', 'Oromia', 'Ethiopia', 'light', 2800, 'medium'),
    ('Ethiopian Bombe', 'arabica', 'Oromia', 'Ethiopia', 'light', 3200, 'medium'),
    ('Ethiopian Natural Sidamo', 'arabica', 'Sidamo', 'Ethiopia', 'light', 3600, 'medium'),
    
    # Colombian (15)
    ('Colombian Supremo', 'arabica', 'Huila', 'Colombia', 'medium', 2500, 'medium'),
    ('Colombian Excelso', 'arabica', 'Cauca', 'Colombia', 'medium', 2200, 'medium'),
    ('Colombian Medellín', 'arabica', 'Antioquia', 'Colombia', 'medium', 2800, 'medium'),
    ('Colombian Caturra', 'arabica', 'Caldas', 'Colombia', 'medium', 3000, 'medium'),
    ('Colombian Castillo', 'arabica', 'Tolima', 'Colombia', 'medium', 2500, 'medium'),
    ('Colombian Excelso Huila', 'arabica', 'Huila', 'Colombia', 'medium', 2900, 'medium'),
    ('Colombian Popayan', 'arabica', 'Cauca', 'Colombia', 'medium', 2800, 'medium'),
    ('Colombian Narino', 'arabica', 'Nariño', 'Colombia', 'medium', 3200, 'high'),
    ('Colombian Sierra Nevada', 'arabica', 'Magdalena', 'Colombia', 'medium', 3500, 'medium'),
    ('Colombian Viejo de Caldas', 'arabica', 'Caldas', 'Colombia', 'medium', 3800, 'medium'),
    ('Colombian Tres Cruces', 'arabica', 'Tolima', 'Colombia', 'medium', 3200, 'medium'),
    ('Colombian San Agustin', 'arabica', 'Huila', 'Colombia', 'medium', 2800, 'medium'),
    ('Colombian Pitalito', 'arabica', 'Huila', 'Colombia', 'medium', 3000, 'medium'),
    ('Colombian Planadas', 'arabica', 'Tolima', 'Colombia', 'medium', 3200, 'medium'),
    ('Colombian Cauca Specialty', 'arabica', 'Cauca', 'Colombia', 'medium', 4200, 'medium'),
    
    # Brazilian (15)
    ('Brazilian Santos', 'arabica', 'Minas Gerais', 'Brazil', 'medium-dark', 2000, 'low'),
    ('Brazilian Bourbon', 'arabica', 'Sul de Minas', 'Brazil', 'medium', 2200, 'low'),
    ('Brazilian Catuai', 'arabica', 'Cerrado', 'Brazil', 'medium-dark', 2400, 'low'),
    ('Brazilian Mundo Novo', 'arabica', 'Mogiana', 'Brazil', 'medium', 2300, 'low'),
    ('Brazilian Yellow Bourbon', 'arabica', 'Minas Gerais', 'Brazil', 'medium', 3500, 'low'),
    ('Brazilian Cerrado', 'arabica', 'Cerrado', 'Brazil', 'medium-dark', 2200, 'low'),
    ('Brazilian Chapada de Minas', 'arabica', 'Minas Gerais', 'Brazil', 'medium', 2800, 'low'),
    ('Brazilian Alta Mogiana', 'arabica', 'Mogiana', 'Brazil', 'medium', 3000, 'low'),
    ('Brazilian Sul de Minas', 'arabica', 'Minas Gerais', 'Brazil', 'medium', 2500, 'low'),
    ('Brazilian Matas de Minas', 'arabica', 'Minas Gerais', 'Brazil', 'medium', 2700, 'low'),
    ('Brazilian Carmel Estate', 'arabica', 'Sul de Minas', 'Brazil', 'medium', 3800, 'medium'),
    ('Brazilian Bourbon Peaberry', 'arabica', 'Campos Gerais', 'Brazil', 'medium', 4200, 'low'),
    ('Brazilian Fazenda Santa Inês', 'arabica', 'Minas Gerais', 'Brazil', 'medium', 3500, 'low'),
    ('Brazilian Serra do Caparaó', 'arabica', 'Espírito Santo', 'Brazil', 'medium', 3000, 'medium'),
    ('Brazilian Conilon Robusta', 'robusta', 'Espírito Santo', 'Brazil', 'dark', 1800, 'low'),
    
    # Guatemalan (10)
    ('Guatemalan Antigua', 'arabica', 'Antigua', 'Guatemala', 'medium', 3500, 'medium'),
    ('Guatemalan Huehuetenango', 'arabica', 'Huehuetenango', 'Guatemala', 'medium', 3800, 'medium'),
    ('Guatemalan Atitlán', 'arabica', 'Lake Atitlán', 'Guatemala', 'medium', 3200, 'high'),
    ('Guatemalan Cobán', 'arabica', 'Cobán', 'Guatemala', 'medium', 3000, 'medium'),
    ('Guatemalan Fraijanes', 'arabica', 'Fraijanes', 'Guatemala', 'medium', 3500, 'high'),
    ('Guatemalan San Marcos', 'arabica', 'San Marcos', 'Guatemala', 'medium', 3000, 'medium'),
    ('Guatemalan Acatenango', 'arabica', 'Acatenango Valley', 'Guatemala', 'medium', 3600, 'high'),
    ('Guatemalan Villa Sarchí', 'arabica', 'Huehuetenango', 'Guatemala', 'medium', 4200, 'medium'),
    ('Guatemalan Maragogype', 'arabica', 'Huehuetenango', 'Guatemala', 'medium', 4500, 'medium'),
    ('Guatemalan Geisha', 'arabica', 'Antigua', 'Guatemala', 'light', 8500, 'high'),
    
    # Costa Rican (10)
    ('Costa Rican Tarrazu', 'arabica', 'Tarrazu', 'Costa Rica', 'medium', 3800, 'medium'),
    ('Costa Rican Tres Rios', 'arabica', 'Tres Rios', 'Costa Rica', 'medium', 3500, 'medium'),
    ('Costa Rican West Valley', 'arabica', 'West Valley', 'Costa Rica', 'medium', 3200, 'medium'),
    ('Costa Rican Central Valley', 'arabica', 'Central Valley', 'Costa Rica', 'medium', 3000, 'medium'),
    ('Costa Rican SHB', 'arabica', 'Tarrazu', 'Costa Rica', 'medium', 4200, 'high'),
    ('Costa Rican Heredia', 'arabica', 'Heredia', 'Costa Rica', 'medium', 3500, 'medium'),
    ('Costa Rican Brunca', 'arabica', 'Brunca', 'Costa Rica', 'medium', 3200, 'medium'),
    ('Costa Rican Turrialba', 'arabica', 'Turrialba', 'Costa Rica', 'medium', 3000, 'medium'),
    ('Costa Rican Valle Occidental', 'arabica', 'West Valley', 'Costa Rica', 'medium', 3400, 'medium'),
    ('Costa Rican Geisha', 'arabica', 'Tarrazu', 'Costa Rica', 'light', 7500, 'high'),
    
    # Kenyan (10)
    ('Kenyan AA', 'arabica', 'Nyeri', 'Kenya', 'medium', 4500, 'high'),
    ('Kenyan AA Plus', 'arabica', 'Kiambu', 'Kenya', 'medium', 5500, 'high'),
    ('Kenyan Peaberry', 'arabica', 'Nyanza', 'Kenya', 'medium', 4800, 'high'),
    ('Kenyan SL28', 'arabica', 'Muranga', 'Kenya', 'medium', 5200, 'high'),
    ('Kenyan Blue Mountain', 'arabica', 'Mount Kenya', 'Kenya', 'medium', 6000, 'high'),
    ('Kenyan Nyeri Estate', 'arabica', 'Nyeri', 'Kenya', 'medium', 5800, 'high'),
    ('Kenyan Fair Trade', 'arabica', 'Embu', 'Kenya', 'medium', 4200, 'high'),
    ('Kenyan Mill Hill', 'arabica', 'Kiambu', 'Kenya', 'medium', 4500, 'high'),
    ('Kenyan AA Estate', 'arabica', 'Muranga', 'Kenya', 'medium', 5500, 'high'),
    ('Kenyan Peaberry Estate', 'arabica', 'Nyanza', 'Kenya', 'medium', 6200, 'high'),
    
    # Indonesian (10)
    ('Indonesian Sumatra Mandheling', 'arabica', 'Sumatra', 'Indonesia', 'dark', 2800, 'low'),
    ('Indonesian Java Estate', 'arabica', 'Java', 'Indonesia', 'medium-dark', 2500, 'low'),
    ('Indonesian Sulawesi Toraja', 'arabica', 'Sulawesi', 'Indonesia', 'medium-dark', 3200, 'medium'),
    ('Indonesian Bali Blue Moon', 'arabica', 'Bali', 'Indonesia', 'medium', 3000, 'low'),
    ('Indonesian Aceh Gayo', 'arabica', 'Aceh', 'Indonesia', 'medium-dark', 2800, 'medium'),
    ('Indonesian Sumatra Lintong', 'arabica', 'Sumatra', 'Indonesia', 'dark', 3000, 'low'),
    ('Indonesian Old Java', 'arabica', 'Java', 'Indonesia', 'dark', 2800, 'low'),
    ('Indonesian Flores Bajawa', 'arabica', 'Flores', 'Indonesia', 'medium', 3500, 'medium'),
    ('Indonesian Papua Wamena', 'arabica', 'Papua', 'Indonesia', 'medium', 3800, 'medium'),
    ('Indonesian Kalimantan', 'arabica', 'Kalimantan', 'Indonesia', 'medium-dark', 3000, 'low'),
    
    # Other Origins (15)
    ('Yemen Mocha', 'arabica', 'Yemen', 'Yemen', 'medium', 8500, 'medium'),
    ('Tanzanian Peaberry', 'arabica', 'Kilimanjaro', 'Tanzania', 'medium', 5500, 'high'),
    ('Ethiopian Reko', 'arabica', 'Kochere', 'Ethiopia', 'light', 4000, 'high'),
    ('Panamanian Geisha', 'arabica', 'Boquete', 'Panama', 'light', 12000, 'high'),
    ('Hawaiian Kona', 'arabica', 'Kona', 'Hawaii', 'medium', 6500, 'medium'),
    ('Jamaican Blue Mountain', 'arabica', 'Blue Mountains', 'Jamaica', 'medium', 10000, 'medium'),
    ('Puerto Rican Yauco Selecto', 'arabica', 'Yauco', 'Puerto Rico', 'medium', 5500, 'medium'),
    ('Dominican Barahona', 'arabica', 'Barahona', 'Dominican Republic', 'medium', 3800, 'medium'),
    ('El Salvador Finca El Carmen', 'arabica', 'Santa Ana', 'El Salvador', 'medium', 3500, 'medium'),
    ('Nicaraguan Jinotega', 'arabica', 'Jinotega', 'Nicaragua', 'medium', 3200, 'medium'),
    ('Honduran Marcala', 'arabica', 'Marcala', 'Honduras', 'medium', 3500, 'medium'),
    ('Peru Organic', 'arabica', 'Cajamarca', 'Peru', 'medium', 3800, 'medium'),
    ('Mexican Chiapas', 'arabica', 'Chiapas', 'Mexico', 'medium', 3000, 'medium'),
    ('Ecuadorian Loja', 'arabica', 'Loja', 'Ecuador', 'medium', 3200, 'medium'),
    ('Vietnamese Robusta', 'robusta', 'Dak Lak', 'Vietnam', 'dark', 2200, 'low'),
]

print('Inserting wines...')
for i, wine in enumerate(wines, 1):
    try:
        cursor.execute("""
            INSERT INTO wines (name, type, region, country, vintage, price, alcohol_content, acidity_level, sweetness_level, currency)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'INR')
        """, wine)
        if i % 10 == 0:
            print(f'Inserted {i} wines...')
    except Exception as e:
        print(f'Error inserting wine {i}: {e}')

print('Inserting coffees...')
for i, coffee in enumerate(coffees, 1):
    try:
        cursor.execute("""
            INSERT INTO coffees (name, type, origin, country, roast_level, price, acidity_level, currency)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'INR')
        """, coffee)
        if i % 10 == 0:
            print(f'Inserted {i} coffees...')
    except Exception as e:
        print(f'Error inserting coffee {i}: {e}')

conn.commit()
cursor.close()
conn.close()

print(f'\n✅ Successfully inserted {len(wines)} wines and {len(coffees)} coffees!')

