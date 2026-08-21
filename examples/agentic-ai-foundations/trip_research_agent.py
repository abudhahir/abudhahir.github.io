"""
Trip Research Agent - Practical Example of Agentic AI

This agent demonstrates how AI can research destinations and provide 
comprehensive travel recommendations, just like how you would research
a destination before visiting.
"""

from datetime import datetime
from typing import Dict, List, Any
import json


class TripResearchAgent:
    """
    An agent that researches travel destinations and provides recommendations.
    
    Think of this as your AI travel research assistant that can:
    - Research weather patterns
    - Find top attractions
    - Provide packing advice
    - Compile comprehensive reports
    """
    
    def __init__(self, name: str = "TravelResearcher"):
        self.name = name
        self.goals = []
        self.research_data = {}
        self.knowledge_base = self._initialize_knowledge_base()
        
    def _initialize_knowledge_base(self) -> Dict[str, Any]:
        """Initialize a basic knowledge base about destinations"""
        return {
            'Rome': {
                'attractions': ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum', 'Pantheon'],
                'weather': {
                    'June': {'temp': '20-28°C', 'description': 'Warm and pleasant', 'rain': 'Low'},
                    'July': {'temp': '23-31°C', 'description': 'Hot and sunny', 'rain': 'Very low'},
                    'August': {'temp': '23-31°C', 'description': 'Very hot', 'rain': 'Low'},
                    'September': {'temp': '19-26°C', 'description': 'Mild and comfortable', 'rain': 'Moderate'}
                },
                'local_tips': [
                    'Book attractions in advance to skip lines',
                    'Dress modestly for Vatican visits',
                    'Try authentic Roman pizza al taglio',
                    'Walk early morning or evening when it\'s cooler'
                ],
                'budget_ranges': {'budget': 60, 'mid-range': 120, 'luxury': 250}
            },
            'Paris': {
                'attractions': ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Arc de Triomphe', 'Montmartre'],
                'weather': {
                    'June': {'temp': '15-22°C', 'description': 'Mild and pleasant', 'rain': 'Moderate'},
                    'July': {'temp': '17-25°C', 'description': 'Warm', 'rain': 'Low'},
                    'August': {'temp': '17-25°C', 'description': 'Warm', 'rain': 'Low'},
                    'September': {'temp': '14-21°C', 'description': 'Cool and comfortable', 'rain': 'Moderate'}
                },
                'local_tips': [
                    'Learn basic French phrases',
                    'Visit museums on first Sunday mornings for free entry',
                    'Try croissants from local boulangeries',
                    'Use the metro for efficient city travel'
                ],
                'budget_ranges': {'budget': 70, 'mid-range': 140, 'luxury': 300}
            },
            'Barcelona': {
                'attractions': ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter', 'Casa Batlló'],
                'weather': {
                    'June': {'temp': '20-26°C', 'description': 'Perfect weather', 'rain': 'Low'},
                    'July': {'temp': '23-29°C', 'description': 'Warm and sunny', 'rain': 'Very low'},
                    'August': {'temp': '24-29°C', 'description': 'Hot', 'rain': 'Low'},
                    'September': {'temp': '21-26°C', 'description': 'Excellent weather', 'rain': 'Low'}
                },
                'local_tips': [
                    'Book Sagrada Familia tickets well in advance',
                    'Enjoy tapas culture - eat small plates',
                    'Siesta time is real - many shops close 2-5 PM',
                    'Beach is easily accessible by metro'
                ],
                'budget_ranges': {'budget': 50, 'mid-range': 100, 'luxury': 200}
            }
        }
    
    def set_research_goal(self, destination: str, travel_dates: str, interests: List[str], budget_type: str = 'mid-range'):
        """Set a research goal for a specific destination"""
        goal = {
            'id': len(self.goals) + 1,
            'type': 'research_destination',
            'destination': destination,
            'dates': travel_dates,
            'interests': interests,
            'budget_type': budget_type,
            'completed': False,
            'created_at': datetime.now()
        }
        self.goals.append(goal)
        print(f"🎯 Research Goal Set: {destination} for {travel_dates}")
        return goal
    
    def research_weather(self, destination: str, travel_month: str) -> Dict[str, str]:
        """Research weather information for a destination and month"""
        print(f"🌤️ Researching weather for {destination} in {travel_month}...")
        
        dest_data = self.knowledge_base.get(destination, {})
        weather_data = dest_data.get('weather', {})
        
        if travel_month in weather_data:
            weather = weather_data[travel_month]
            return {
                'temperature': weather['temp'],
                'description': weather['description'],
                'rain_probability': weather['rain'],
                'packing_advice': self._generate_packing_advice(weather)
            }
        else:
            # Fallback for unknown destinations/months
            return {
                'temperature': '15-25°C',
                'description': 'Typical European weather',
                'rain_probability': 'Moderate',
                'packing_advice': 'Pack layers and bring a light rain jacket'
            }
    
    def _generate_packing_advice(self, weather: Dict[str, str]) -> str:
        """Generate packing advice based on weather conditions"""
        temp_range = weather['temp']
        rain = weather['rain'].lower()
        
        advice = []
        
        # Temperature-based advice
        if '30' in temp_range or 'hot' in weather['description'].lower():
            advice.extend(['Light, breathable clothing', 'Sun hat and sunscreen', 'Comfortable walking shoes'])
        elif '15' in temp_range and '25' not in temp_range:
            advice.extend(['Layered clothing', 'Light jacket or cardigan', 'Comfortable walking shoes'])
        else:
            advice.extend(['Comfortable layers', 'Light jacket', 'Good walking shoes'])
        
        # Rain-based advice
        if rain in ['moderate', 'high']:
            advice.append('Compact umbrella or rain jacket')
        
        return ', '.join(advice)
    
    def research_attractions(self, destination: str, interests: List[str]) -> List[Dict[str, str]]:
        """Research top attractions based on interests"""
        print(f"🏛️ Researching attractions in {destination} for interests: {', '.join(interests)}")
        
        dest_data = self.knowledge_base.get(destination, {})
        all_attractions = dest_data.get('attractions', ['Local museums', 'City center', 'Parks'])
        
        # Score attractions based on interests
        attraction_scores = []
        for attraction in all_attractions:
            score = self._score_attraction_for_interests(attraction, interests)
            attraction_scores.append({
                'name': attraction,
                'score': score,
                'recommended': score > 0.5,
                'interest_match': self._get_interest_match(attraction, interests)
            })
        
        # Sort by score and return top 5
        attraction_scores.sort(key=lambda x: x['score'], reverse=True)
        return attraction_scores[:5]
    
    def _score_attraction_for_interests(self, attraction: str, interests: List[str]) -> float:
        """Score how well an attraction matches user interests"""
        attraction_lower = attraction.lower()
        interest_keywords = {
            'history': ['colosseum', 'forum', 'pantheon', 'notre-dame', 'gothic'],
            'art': ['louvre', 'vatican', 'museum', 'gallery'],
            'architecture': ['sagrada', 'eiffel', 'pantheon', 'arc', 'casa'],
            'culture': ['montmartre', 'las ramblas', 'vatican', 'gothic quarter'],
            'food': ['market', 'quarter', 'ramblas'],
            'nature': ['park', 'garden', 'güell']
        }
        
        score = 0.3  # Base score for all attractions
        
        for interest in interests:
            interest_lower = interest.lower()
            if interest_lower in interest_keywords:
                for keyword in interest_keywords[interest_lower]:
                    if keyword in attraction_lower:
                        score += 0.3
                        
        return min(score, 1.0)  # Cap at 1.0
    
    def _get_interest_match(self, attraction: str, interests: List[str]) -> str:
        """Get the primary interest category this attraction matches"""
        attraction_lower = attraction.lower()
        
        if any(word in attraction_lower for word in ['museum', 'art', 'louvre', 'vatican']):
            return 'art & culture'
        elif any(word in attraction_lower for word in ['colosseum', 'forum', 'pantheon', 'notre-dame']):
            return 'history'
        elif any(word in attraction_lower for word in ['eiffel', 'sagrada', 'arc', 'casa']):
            return 'architecture'
        elif any(word in attraction_lower for word in ['park', 'garden', 'güell']):
            return 'nature'
        else:
            return 'general interest'
    
    def get_budget_insights(self, destination: str, budget_type: str) -> Dict[str, Any]:
        """Get budget insights for a destination"""
        dest_data = self.knowledge_base.get(destination, {})
        budget_ranges = dest_data.get('budget_ranges', {'budget': 50, 'mid-range': 100, 'luxury': 200})
        local_tips = dest_data.get('local_tips', ['Research local customs', 'Book accommodations in advance'])
        
        daily_budget = budget_ranges.get(budget_type, budget_ranges['mid-range'])
        
        return {
            'daily_budget': daily_budget,
            'budget_breakdown': {
                'accommodation': daily_budget * 0.4,
                'food': daily_budget * 0.3,
                'activities': daily_budget * 0.2,
                'transport': daily_budget * 0.1
            },
            'money_saving_tips': [tip for tip in local_tips if any(word in tip.lower() for word in ['free', 'save', 'advance', 'local'])],
            'splurge_recommendations': self._get_splurge_recommendations(destination) if budget_type == 'luxury' else []
        }
    
    def _get_splurge_recommendations(self, destination: str) -> List[str]:
        """Get splurge recommendations for luxury travelers"""
        splurge_map = {
            'Rome': ['Private Vatican tour after hours', 'Michelin-starred dining experience', 'Private gladiator experience'],
            'Paris': ['Private Louvre tour', 'Seine river dinner cruise', 'Champagne tasting in Champagne region'],
            'Barcelona': ['Private Gaudí architecture tour', 'Flamenco dinner show', 'Day trip to Montserrat monastery']
        }
        return splurge_map.get(destination, ['Premium local experiences', 'Fine dining', 'Private guided tours'])
    
    def compile_research_report(self, destination: str) -> str:
        """Compile a comprehensive research report for a destination"""
        goal = next((g for g in self.goals if g['destination'] == destination and not g['completed']), None)
        
        if not goal:
            return f"❌ No active research goal found for {destination}"
        
        print(f"📋 Compiling comprehensive research report for {destination}...")
        
        # Extract travel month from dates (simplified)
        travel_month = self._extract_month_from_dates(goal['dates'])
        
        # Gather all research data
        weather_info = self.research_weather(destination, travel_month)
        attractions = self.research_attractions(destination, goal['interests'])
        budget_info = self.get_budget_insights(destination, goal['budget_type'])
        
        # Store research data
        self.research_data[destination] = {
            'weather': weather_info,
            'attractions': attractions,
            'budget': budget_info,
            'goal': goal
        }
        
        # Generate comprehensive report
        report = self._generate_detailed_report(destination, weather_info, attractions, budget_info, goal)
        
        # Mark goal as completed
        goal['completed'] = True
        goal['completed_at'] = datetime.now()
        
        print(f"✅ Research completed for {destination}!")
        return report
    
    def _extract_month_from_dates(self, date_string: str) -> str:
        """Extract month from date string (simplified)"""
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
        
        for month in months:
            if month in date_string or month[:3] in date_string:
                return month
        
        return 'June'  # Default fallback
    
    def _generate_detailed_report(self, destination: str, weather: Dict, attractions: List, budget: Dict, goal: Dict) -> str:
        """Generate a detailed, formatted research report"""
        
        report = f"""
🌍 COMPREHENSIVE TRAVEL RESEARCH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 DESTINATION: {destination}
📅 TRAVEL DATES: {goal['dates']}
🎯 YOUR INTERESTS: {', '.join(goal['interests'])}
💰 BUDGET CATEGORY: {goal['budget_type'].title()}

🌤️ WEATHER FORECAST & PACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌡️ Temperature: {weather['temperature']}
☀️ Conditions: {weather['description']}
🌧️ Rain Probability: {weather['rain_probability']}

🎒 PACKING ESSENTIALS:
   {weather['packing_advice']}

🏛️ TOP ATTRACTIONS FOR YOU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for i, attraction in enumerate(attractions, 1):
            match_icon = "🎯" if attraction['recommended'] else "📍"
            report += f"   {match_icon} {i}. {attraction['name']}\n"
            report += f"      └─ Best for: {attraction['interest_match']}\n"
        
        report += f"""
💰 BUDGET BREAKDOWN (Daily)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Total Daily Budget: ${budget['daily_budget']:.0f}

   🏨 Accommodation: ${budget['budget_breakdown']['accommodation']:.0f} (40%)
   🍽️ Food & Dining: ${budget['budget_breakdown']['food']:.0f} (30%)
   🎭 Activities: ${budget['budget_breakdown']['activities']:.0f} (20%)
   🚇 Transport: ${budget['budget_breakdown']['transport']:.0f} (10%)

💡 MONEY-SAVING TIPS:
"""
        
        for tip in budget['money_saving_tips']:
            report += f"   • {tip}\n"
        
        if budget['splurge_recommendations']:
            report += f"\n✨ LUXURY EXPERIENCES:\n"
            for splurge in budget['splurge_recommendations']:
                report += f"   • {splurge}\n"
        
        # Add local tips
        dest_data = self.knowledge_base.get(destination, {})
        local_tips = dest_data.get('local_tips', [])
        
        if local_tips:
            report += f"""
🏛️ LOCAL INSIDER TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
            for tip in local_tips:
                report += f"   💡 {tip}\n"
        
        report += f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Research completed by {self.name}
📅 Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}
        """
        
        return report
    
    def get_agent_status(self) -> str:
        """Get current status of research goals"""
        total_goals = len(self.goals)
        completed_goals = len([g for g in self.goals if g['completed']])
        
        status = f"""
📊 RESEARCH AGENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Research Goals: {completed_goals}/{total_goals} completed
📚 Destinations in Knowledge Base: {len(self.knowledge_base)}
💾 Research Reports Generated: {len(self.research_data)}

GOALS OVERVIEW:
"""
        
        for goal in self.goals:
            status_icon = "✅" if goal['completed'] else "🔄"
            status += f"   {status_icon} {goal['destination']} - {goal['dates']}\n"
        
        return status


# Example usage and demonstration
if __name__ == "__main__":
    print("🚀 Trip Research Agent Demonstration\n")
    
    # Create research agent
    researcher = TripResearchAgent("TravelGuru")
    
    # Set research goals for multiple destinations
    researcher.set_research_goal("Rome", "June 15-29, 2024", ["history", "art", "food"], "mid-range")
    researcher.set_research_goal("Paris", "July 1-7, 2024", ["art", "culture", "architecture"], "luxury")
    
    print("\n" + "="*60)
    print("GENERATING RESEARCH REPORTS...")
    print("="*60)
    
    # Generate reports
    rome_report = researcher.compile_research_report("Rome")
    print(rome_report)
    
    print("\n" + "="*60 + "\n")
    
    paris_report = researcher.compile_research_report("Paris")
    print(paris_report)
    
    # Show agent status
    print("\n" + researcher.get_agent_status())
