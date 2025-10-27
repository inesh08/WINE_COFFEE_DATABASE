import pytest
import sys
import os

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.wine_model import WineModel
from db.connection import get_db_connection

class TestWineModel:
    def setup_method(self):
        """Setup test data"""
        self.test_wine_data = {
            'name': 'Test Cabernet Sauvignon',
            'type': 'red',
            'region': 'Napa Valley',
            'country': 'USA',
            'vintage': 2018,
            'price': 45.00,
            'description': 'A full-bodied red wine with rich flavors',
            'alcohol_content': 14.5,
            'acidity_level': 'medium',
            'body_level': 'full',
            'tannin_level': 'high',
            'sweetness_level': 'dry'
        }
    
    def test_create_wine(self):
        """Test creating a new wine"""
        wine_id = WineModel.create_wine(self.test_wine_data)
        assert wine_id is not None
        assert isinstance(wine_id, int)
        
        # Clean up
        WineModel.delete_wine(wine_id)
    
    def test_get_wine_by_id(self):
        """Test retrieving a wine by ID"""
        # Create a wine first
        wine_id = WineModel.create_wine(self.test_wine_data)
        
        # Retrieve the wine
        wine = WineModel.get_wine_by_id(wine_id)
        assert wine is not None
        assert wine['name'] == self.test_wine_data['name']
        assert wine['type'] == self.test_wine_data['type']
        
        # Clean up
        WineModel.delete_wine(wine_id)
    
    def test_get_all_wines(self):
        """Test retrieving all wines"""
        wines = WineModel.get_all_wines()
        assert isinstance(wines, list)
    
    def test_update_wine(self):
        """Test updating a wine"""
        # Create a wine first
        wine_id = WineModel.create_wine(self.test_wine_data)
        
        # Update the wine
        update_data = {
            'name': 'Updated Test Wine',
            'price': 55.00
        }
        success = WineModel.update_wine(wine_id, update_data)
        assert success is True
        
        # Verify the update
        updated_wine = WineModel.get_wine_by_id(wine_id)
        assert updated_wine['name'] == 'Updated Test Wine'
        assert updated_wine['price'] == 55.00
        
        # Clean up
        WineModel.delete_wine(wine_id)
    
    def test_delete_wine(self):
        """Test deleting a wine"""
        # Create a wine first
        wine_id = WineModel.create_wine(self.test_wine_data)
        
        # Delete the wine
        success = WineModel.delete_wine(wine_id)
        assert success is True
        
        # Verify deletion
        wine = WineModel.get_wine_by_id(wine_id)
        assert wine is None
    
    def test_search_wines(self):
        """Test searching wines with filters"""
        # Create a test wine
        wine_id = WineModel.create_wine(self.test_wine_data)
        
        # Search by type
        filters = {'type': 'red'}
        results = WineModel.search_wines(filters)
        assert isinstance(results, list)
        assert len(results) > 0
        
        # Search by region
        filters = {'region': 'Napa Valley'}
        results = WineModel.search_wines(filters)
        assert isinstance(results, list)
        
        # Clean up
        WineModel.delete_wine(wine_id)
    
    def test_get_wine_types(self):
        """Test getting all wine types"""
        types = WineModel.get_wine_types()
        assert isinstance(types, list)
    
    def test_get_wine_regions(self):
        """Test getting all wine regions"""
        regions = WineModel.get_wine_regions()
        assert isinstance(regions, list)

if __name__ == '__main__':
    pytest.main([__file__]) 