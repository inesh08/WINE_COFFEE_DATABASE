import pytest
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.coffee_model import CoffeeModel
from db.connection import get_db_connection

class TestCoffeeModel:
    def setup_method(self):
        """Setup test data"""
        self.test_coffee_data = {
            'name': 'Test Ethiopian Yirgacheffe',
            'type': 'arabica',
            'origin': 'Yirgacheffe',
            'country': 'Ethiopia',
            'roast_level': 'medium',
            'price': 18.00,
            'description': 'A bright and floral coffee with citrus notes',
            'acidity_level': 'high',
            'body_level': 'medium',
            'flavor_notes': 'Citrus, floral, tea-like',
            'processing_method': 'washed'
        }
    
    def test_create_coffee(self):
        """Test creating a new coffee"""
        coffee_id = CoffeeModel.create_coffee(self.test_coffee_data)
        assert coffee_id is not None
        assert isinstance(coffee_id, int)
        
        # Clean up
        CoffeeModel.delete_coffee(coffee_id)
    
    def test_get_coffee_by_id(self):
        """Test retrieving a coffee by ID"""
        # Create a coffee first
        coffee_id = CoffeeModel.create_coffee(self.test_coffee_data)
        
        # Retrieve the coffee
        coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        assert coffee is not None
        assert coffee['name'] == self.test_coffee_data['name']
        assert coffee['type'] == self.test_coffee_data['type']
        
        # Clean up
        CoffeeModel.delete_coffee(coffee_id)
    
    def test_get_all_coffees(self):
        """Test retrieving all coffees"""
        coffees = CoffeeModel.get_all_coffees()
        assert isinstance(coffees, list)
    
    def test_update_coffee(self):
        """Test updating a coffee"""
        # Create a coffee first
        coffee_id = CoffeeModel.create_coffee(self.test_coffee_data)
        
        # Update the coffee
        update_data = {
            'name': 'Updated Test Coffee',
            'price': 22.00
        }
        success = CoffeeModel.update_coffee(coffee_id, update_data)
        assert success is True
        
        # Verify the update
        updated_coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        assert updated_coffee['name'] == 'Updated Test Coffee'
        assert updated_coffee['price'] == 22.00
        
        # Clean up
        CoffeeModel.delete_coffee(coffee_id)
    
    def test_delete_coffee(self):
        """Test deleting a coffee"""
        # Create a coffee first
        coffee_id = CoffeeModel.create_coffee(self.test_coffee_data)
        
        # Delete the coffee
        success = CoffeeModel.delete_coffee(coffee_id)
        assert success is True
        
        # Verify deletion
        coffee = CoffeeModel.get_coffee_by_id(coffee_id)
        assert coffee is None
    
    def test_search_coffees(self):
        """Test searching coffees with filters"""
        # Create a test coffee
        coffee_id = CoffeeModel.create_coffee(self.test_coffee_data)
        
        # Search by type
        filters = {'type': 'arabica'}
        results = CoffeeModel.search_coffees(filters)
        assert isinstance(results, list)
        assert len(results) > 0
        
        # Search by origin
        filters = {'origin': 'Yirgacheffe'}
        results = CoffeeModel.search_coffees(filters)
        assert isinstance(results, list)
        
        # Search by roast level
        filters = {'roast_level': 'medium'}
        results = CoffeeModel.search_coffees(filters)
        assert isinstance(results, list)
        
        # Clean up
        CoffeeModel.delete_coffee(coffee_id)
    
    def test_get_coffee_types(self):
        """Test getting all coffee types"""
        types = CoffeeModel.get_coffee_types()
        assert isinstance(types, list)
    
    def test_get_coffee_origins(self):
        """Test getting all coffee origins"""
        origins = CoffeeModel.get_coffee_origins()
        assert isinstance(origins, list)
    
    def test_get_roast_levels(self):
        """Test getting all roast levels"""
        roast_levels = CoffeeModel.get_roast_levels()
        assert isinstance(roast_levels, list)

if __name__ == '__main__':
    pytest.main([__file__]) 