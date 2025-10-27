from models.wine_model import WineModel
from models.coffee_model import CoffeeModel
from models.pairing_model import PairingModel
from models.review_model import ReviewModel
from models.user_model import UserModel

class WineCoffeeRecommender:
    def __init__(self):
        self.wine_model = WineModel()
        self.coffee_model = CoffeeModel()
        self.pairing_model = PairingModel()
        self.review_model = ReviewModel()
        self.user_model = UserModel()
    
    def get_wine_recommendations_for_coffee(self, coffee_id, limit=5):
        """Get wine recommendations for a specific coffee"""
        try:
            # Get the coffee details
            coffee = CoffeeModel.get_coffee_by_id(coffee_id)
            if not coffee:
                return []
            
            # Get existing pairings for this coffee
            pairings = PairingModel.get_pairings_by_coffee(coffee_id)
            
            # If we have good pairings, return them
            good_pairings = [p for p in pairings if p['pairing_score'] >= 7.0]
            if good_pairings:
                return good_pairings[:limit]
            
            # Otherwise, use flavor-based recommendations
            return self._get_flavor_based_wine_recommendations(coffee, limit)
        except Exception as e:
            print(f"Error getting wine recommendations: {e}")
            return []
    
    def get_coffee_recommendations_for_wine(self, wine_id, limit=5):
        """Get coffee recommendations for a specific wine"""
        try:
            # Get the wine details
            wine = WineModel.get_wine_by_id(wine_id)
            if not wine:
                return []
            
            # Get existing pairings for this wine
            pairings = PairingModel.get_pairings_by_wine(wine_id)
            
            # If we have good pairings, return them
            good_pairings = [p for p in pairings if p['pairing_score'] >= 7.0]
            if good_pairings:
                return good_pairings[:limit]
            
            # Otherwise, use flavor-based recommendations
            return self._get_flavor_based_coffee_recommendations(wine, limit)
        except Exception as e:
            print(f"Error getting coffee recommendations: {e}")
            return []
    
    def _get_flavor_based_wine_recommendations(self, coffee, limit=5):
        """Get wine recommendations based on coffee flavor profile"""
        recommendations = []
        
        # Define flavor pairing rules
        pairing_rules = {
            'light': {
                'acidity_level': 'low',
                'body_level': 'light',
                'wine_types': ['white', 'rose']
            },
            'medium': {
                'acidity_level': 'medium',
                'body_level': 'medium',
                'wine_types': ['white', 'rose', 'red']
            },
            'dark': {
                'acidity_level': 'high',
                'body_level': 'full',
                'wine_types': ['red']
            }
        }
        
        # Determine coffee profile
        roast_level = coffee.get('roast_level', 'medium')
        acidity = coffee.get('acidity_level', 'medium')
        
        # Get matching wines
        filters = {}
        if roast_level in pairing_rules:
            rule = pairing_rules[roast_level]
            filters['type'] = rule['wine_types']
            filters['acidity_level'] = rule['acidity_level']
            filters['body_level'] = rule['body_level']
        
        wines = WineModel.search_wines(filters)
        
        # Get top rated wines from the filtered results
        top_wines = ReviewModel.get_top_rated_wines(limit * 2)
        top_wine_ids = [w['id'] for w in top_wines]
        
        # Prioritize top-rated wines
        for wine in wines:
            if wine['id'] in top_wine_ids:
                recommendations.append({
                    'wine': wine,
                    'score': 8.0,  # High score for top-rated wines
                    'reason': 'Top-rated wine with compatible flavor profile'
                })
        
        # Add other wines if we don't have enough
        for wine in wines:
            if len(recommendations) >= limit:
                break
            if wine['id'] not in [r['wine']['id'] for r in recommendations]:
                recommendations.append({
                    'wine': wine,
                    'score': 6.0,  # Medium score for flavor-matched wines
                    'reason': 'Flavor profile compatible with coffee'
                })
        
        return recommendations[:limit]
    
    def _get_flavor_based_coffee_recommendations(self, wine, limit=5):
        """Get coffee recommendations based on wine flavor profile"""
        recommendations = []
        
        # Define flavor pairing rules
        pairing_rules = {
            'white': {
                'roast_level': 'light',
                'acidity_level': 'medium',
                'coffee_types': ['arabica']
            },
            'red': {
                'roast_level': 'dark',
                'acidity_level': 'low',
                'coffee_types': ['arabica', 'robusta']
            },
            'rose': {
                'roast_level': 'medium',
                'acidity_level': 'medium',
                'coffee_types': ['arabica']
            },
            'sparkling': {
                'roast_level': 'light',
                'acidity_level': 'high',
                'coffee_types': ['arabica']
            }
        }
        
        # Determine wine profile
        wine_type = wine.get('type', 'red')
        body_level = wine.get('body_level', 'medium')
        
        # Get matching coffees
        filters = {}
        if wine_type in pairing_rules:
            rule = pairing_rules[wine_type]
            filters['type'] = rule['coffee_types']
            filters['roast_level'] = rule['roast_level']
            filters['acidity_level'] = rule['acidity_level']
        
        coffees = CoffeeModel.search_coffees(filters)
        
        # Get top rated coffees from the filtered results
        top_coffees = ReviewModel.get_top_rated_coffees(limit * 2)
        top_coffee_ids = [c['id'] for c in top_coffees]
        
        # Prioritize top-rated coffees
        for coffee in coffees:
            if coffee['id'] in top_coffee_ids:
                recommendations.append({
                    'coffee': coffee,
                    'score': 8.0,  # High score for top-rated coffees
                    'reason': 'Top-rated coffee with compatible flavor profile'
                })
        
        # Add other coffees if we don't have enough
        for coffee in coffees:
            if len(recommendations) >= limit:
                break
            if coffee['id'] not in [r['coffee']['id'] for r in recommendations]:
                recommendations.append({
                    'coffee': coffee,
                    'score': 6.0,  # Medium score for flavor-matched coffees
                    'reason': 'Flavor profile compatible with wine'
                })
        
        return recommendations[:limit]
    
    def get_personalized_recommendations(self, user_id, limit=5):
        """Get personalized recommendations based on user preferences and history"""
        try:
            # Get user preferences
            preferences = UserModel.get_user_preferences(user_id)
            
            # Get user's review history
            user_reviews = ReviewModel.get_reviews_by_user(user_id)
            
            # Analyze user preferences
            wine_preferences = {}
            coffee_preferences = {}
            
            for pref in preferences:
                if pref['preference_type'] == 'wine':
                    wine_preferences[pref['preference_key']] = pref['preference_value']
                elif pref['preference_type'] == 'coffee':
                    coffee_preferences[pref['preference_key']] = pref['preference_value']
            
            # Analyze review history
            liked_wines = []
            liked_coffees = []
            
            for review in user_reviews:
                if review['rating'] >= 4:  # Consider 4+ stars as "liked"
                    if review.get('wine_id'):
                        liked_wines.append(review['wine_id'])
                    elif review.get('coffee_id'):
                        liked_coffees.append(review['coffee_id'])
            
            recommendations = []
            
            # If user has liked wines, recommend coffees for those wines
            if liked_wines:
                for wine_id in liked_wines[:2]:  # Use top 2 liked wines
                    coffee_recs = self.get_coffee_recommendations_for_wine(wine_id, 2)
                    recommendations.extend(coffee_recs)
            
            # If user has liked coffees, recommend wines for those coffees
            if liked_coffees:
                for coffee_id in liked_coffees[:2]:  # Use top 2 liked coffees
                    wine_recs = self.get_wine_recommendations_for_coffee(coffee_id, 2)
                    recommendations.extend(wine_recs)
            
            # If no history, use preferences
            if not recommendations and (wine_preferences or coffee_preferences):
                if wine_preferences.get('type'):
                    wines = WineModel.search_wines({'type': wine_preferences['type']})
                    if wines:
                        wine = wines[0]
                        coffee_recs = self.get_coffee_recommendations_for_wine(wine['id'], limit)
                        recommendations.extend(coffee_recs)
                
                if coffee_preferences.get('type'):
                    coffees = CoffeeModel.search_coffees({'type': coffee_preferences['type']})
                    if coffees:
                        coffee = coffees[0]
                        wine_recs = self.get_wine_recommendations_for_coffee(coffee['id'], limit)
                        recommendations.extend(wine_recs)
            
            # If still no recommendations, get popular pairings
            if not recommendations:
                best_pairings = PairingModel.get_best_pairings(limit)
                recommendations = [{'pairing': p, 'score': p['pairing_score'], 'reason': 'Popular pairing'} for p in best_pairings]
            
            return recommendations[:limit]
        except Exception as e:
            print(f"Error getting personalized recommendations: {e}")
            return []
    
    def get_seasonal_recommendations(self, season='all', limit=5):
        """Get seasonal recommendations"""
        seasonal_rules = {
            'summer': {
                'wine_types': ['white', 'rose', 'sparkling'],
                'coffee_roast': 'light',
                'reason': 'Light and refreshing for summer'
            },
            'winter': {
                'wine_types': ['red'],
                'coffee_roast': 'dark',
                'reason': 'Rich and warming for winter'
            },
            'spring': {
                'wine_types': ['white', 'rose'],
                'coffee_roast': 'medium',
                'reason': 'Balanced flavors for spring'
            },
            'fall': {
                'wine_types': ['red', 'white'],
                'coffee_roast': 'medium-dark',
                'reason': 'Comforting flavors for fall'
            }
        }
        
        if season not in seasonal_rules:
            return []
        
        rule = seasonal_rules[season]
        recommendations = []
        
        # Get seasonal wines
        wines = WineModel.search_wines({'type': rule['wine_types']})
        top_wines = ReviewModel.get_top_rated_wines(limit)
        
        # Get seasonal coffees
        coffees = CoffeeModel.search_coffees({'roast_level': rule['coffee_roast']})
        top_coffees = ReviewModel.get_top_rated_coffees(limit)
        
        # Create seasonal pairings
        for i in range(min(len(top_wines), len(top_coffees), limit)):
            recommendations.append({
                'wine': top_wines[i],
                'coffee': top_coffees[i],
                'score': 7.5,
                'reason': rule['reason']
            })
        
        return recommendations 