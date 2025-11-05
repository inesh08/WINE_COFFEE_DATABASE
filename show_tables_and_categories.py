#!/usr/bin/env python3
"""
Script to show all database tables and wine/coffee categories
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.db.connection import get_db_connection

def show_all_tables():
    """Show all tables in the database"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            print("=" * 80)
            print("DATABASE TABLES")
            print("=" * 80)
            
            for i, table in enumerate(tables, 1):
                table_name = list(table.values())[0]
                # Get row count for each table
                cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
                count = cursor.fetchone()
                row_count = count['count'] if count else 0
                print(f"{i}. {table_name:<40} ({row_count} rows)")
            
            print("=" * 80)
            print(f"Total: {len(tables)} tables")
            print()
    finally:
        conn.close()

def show_wine_categories():
    """Show all wine types/categories"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Get all wine types with counts
            cursor.execute("""
                SELECT type, COUNT(*) as count 
                FROM wines 
                GROUP BY type 
                ORDER BY type
            """)
            wine_types = cursor.fetchall()
            
            print("=" * 80)
            print("WINE CATEGORIES (Types)")
            print("=" * 80)
            
            if wine_types:
                total_wines = sum(w['count'] for w in wine_types)
                for wine_type in wine_types:
                    percentage = (wine_type['count'] / total_wines * 100) if total_wines > 0 else 0
                    print(f"  • {wine_type['type']:<20} ({wine_type['count']:>4} wines, {percentage:>5.1f}%)")
                print("=" * 80)
                print(f"Total wines: {total_wines}")
            else:
                print("  No wines found in database")
            print()
            
            # Also show wine regions
            cursor.execute("""
                SELECT DISTINCT region, COUNT(*) as count 
                FROM wines 
                WHERE region IS NOT NULL AND region != ''
                GROUP BY region 
                ORDER BY count DESC
                LIMIT 10
            """)
            regions = cursor.fetchall()
            
            if regions:
                print("=" * 80)
                print("TOP 10 WINE REGIONS")
                print("=" * 80)
                for region in regions:
                    print(f"  • {region['region']:<40} ({region['count']} wines)")
                print()
    finally:
        conn.close()

def show_coffee_categories():
    """Show all coffee types/categories"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Get all coffee types with counts
            cursor.execute("""
                SELECT type, COUNT(*) as count 
                FROM coffees 
                GROUP BY type 
                ORDER BY type
            """)
            coffee_types = cursor.fetchall()
            
            print("=" * 80)
            print("COFFEE CATEGORIES (Types)")
            print("=" * 80)
            
            if coffee_types:
                total_coffees = sum(c['count'] for c in coffee_types)
                for coffee_type in coffee_types:
                    percentage = (coffee_type['count'] / total_coffees * 100) if total_coffees > 0 else 0
                    print(f"  • {coffee_type['type']:<20} ({coffee_type['count']:>4} coffees, {percentage:>5.1f}%)")
                print("=" * 80)
                print(f"Total coffees: {total_coffees}")
            else:
                print("  No coffees found in database")
            print()
            
            # Show roast levels
            cursor.execute("""
                SELECT roast_level, COUNT(*) as count 
                FROM coffees 
                WHERE roast_level IS NOT NULL
                GROUP BY roast_level 
                ORDER BY roast_level
            """)
            roast_levels = cursor.fetchall()
            
            if roast_levels:
                print("=" * 80)
                print("COFFEE ROAST LEVELS")
                print("=" * 80)
                for roast in roast_levels:
                    print(f"  • {roast['roast_level']:<20} ({roast['count']} coffees)")
                print()
            
            # Show top origins
            cursor.execute("""
                SELECT DISTINCT origin, COUNT(*) as count 
                FROM coffees 
                WHERE origin IS NOT NULL AND origin != ''
                GROUP BY origin 
                ORDER BY count DESC
                LIMIT 10
            """)
            origins = cursor.fetchall()
            
            if origins:
                print("=" * 80)
                print("TOP 10 COFFEE ORIGINS")
                print("=" * 80)
                for origin in origins:
                    print(f"  • {origin['origin']:<40} ({origin['count']} coffees)")
                print()
    finally:
        conn.close()

def show_table_details():
    """Show detailed structure of key tables"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            key_tables = ['wines', 'coffees', 'customers', 'orders', 'reviews', 'pairings']
            
            print("=" * 80)
            print("TABLE STRUCTURES")
            print("=" * 80)
            
            for table_name in key_tables:
                cursor.execute(f"DESCRIBE {table_name}")
                columns = cursor.fetchall()
                
                print(f"\n{table_name.upper()}:")
                print("-" * 80)
                for col in columns:
                    field = col['Field']
                    col_type = col['Type']
                    null = col['Null']
                    key = col['Key']
                    default = col['Default'] or 'NULL'
                    extra = col['Extra'] or ''
                    
                    key_info = f" [{key}]" if key else ""
                    print(f"  {field:<30} {col_type:<25} {null:<4} {default:<15} {extra}{key_info}")
    finally:
        conn.close()

if __name__ == "__main__":
    try:
        print("\n")
        print("╔" + "=" * 78 + "╗")
        print("║" + " " * 20 + "DATABASE TABLES & CATEGORIES REPORT" + " " * 24 + "║")
        print("╚" + "=" * 78 + "╝")
        print()
        
        show_all_tables()
        show_wine_categories()
        show_coffee_categories()
        show_table_details()
        
        print("=" * 80)
        print("Report completed successfully!")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

