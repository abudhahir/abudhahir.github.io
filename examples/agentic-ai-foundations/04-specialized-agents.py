"""
04 - Specialized Agents: Research & Budget Planning

This module demonstrates how to create specialized agents that excel at specific tasks.
We combine the research and budget planning agents to show how different agents
can work together or be used independently based on needs.

Like having specialized consultants for different aspects of your trip planning.
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
        
        if '30' in temp_range or 'hot' in weather['description'].lower():
            advice.extend(['Light, breathable clothing', 'Sun hat and sunscreen', 'Comfortable walking shoes'])
        elif '15' in temp_range and '25' not in temp_range:
            advice.extend(['Layered clothing', 'Light jacket or cardigan', 'Comfortable walking shoes'])
        else:
            advice.extend(['Comfortable layers', 'Light jacket', 'Good walking shoes'])
        
        if rain in ['moderate', 'high']:
            advice.append('Compact umbrella or rain jacket')
        
        return ', '.join(advice)
    
    def research_attractions(self, destination: str, interests: List[str]) -> List[Dict[str, str]]:
        """Research top attractions based on interests"""
        print(f"🏛️ Researching attractions in {destination} for interests: {', '.join(interests)}")
        
        dest_data = self.knowledge_base.get(destination, {})
        all_attractions = dest_data.get('attractions', ['Local museums', 'City center', 'Parks'])
        
        attraction_scores = []
        for attraction in all_attractions:
            score = self._score_attraction_for_interests(attraction, interests)
            attraction_scores.append({
                'name': attraction,
                'score': score,
                'recommended': score > 0.5,
                'interest_match': self._get_interest_match(attraction, interests)
            })
        
        attraction_scores.sort(key=lambda x: x['score'], reverse=True)
        return attraction_scores[:5]
    
    def _score_attraction_for_interests(self, attraction: str, interests: List[str]) -> float:
        """Score how well an attraction matches user interests"""
        attraction_lower = attraction.lower()
        interest_keywords = {
            'history': ['colosseum', 'forum', 'pantheon', 'notre-dame'],
            'art': ['louvre', 'vatican', 'museum', 'gallery'],
            'architecture': ['eiffel', 'pantheon', 'arc'],
            'culture': ['montmartre', 'vatican'],
            'food': ['market', 'quarter'],
            'nature': ['park', 'garden']
        }
        
        score = 0.3
        for interest in interests:
            interest_lower = interest.lower()
            if interest_lower in interest_keywords:
                for keyword in interest_keywords[interest_lower]:
                    if keyword in attraction_lower:
                        score += 0.3
                        
        return min(score, 1.0)
    
    def _get_interest_match(self, attraction: str, interests: List[str]) -> str:
        """Get the primary interest category this attraction matches"""
        attraction_lower = attraction.lower()
        
        if any(word in attraction_lower for word in ['museum', 'art', 'louvre', 'vatican']):
            return 'art & culture'
        elif any(word in attraction_lower for word in ['colosseum', 'forum', 'pantheon']):
            return 'history'
        elif any(word in attraction_lower for word in ['eiffel', 'arc']):
            return 'architecture'
        else:
            return 'general interest'
    
    def compile_research_report(self, destination: str) -> str:
        """Compile a comprehensive research report for a destination"""
        goal = next((g for g in self.goals if g['destination'] == destination and not g['completed']), None)
        
        if not goal:
            return f"❌ No active research goal found for {destination}"
        
        print(f"📋 Compiling research report for {destination}...")
        
        travel_month = self._extract_month_from_dates(goal['dates'])
        weather_info = self.research_weather(destination, travel_month)
        attractions = self.research_attractions(destination, goal['interests'])
        
        # Generate report
        report = f"""
🌍 TRAVEL RESEARCH REPORT: {destination}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Travel Dates: {goal['dates']}
🎯 Interests: {', '.join(goal['interests'])}

🌤️ WEATHER & PACKING:
🌡️ Temperature: {weather_info['temperature']}
☀️ Conditions: {weather_info['description']}
🎒 Pack: {weather_info['packing_advice']}

🏛️ TOP ATTRACTIONS FOR YOU:
"""
        
        for i, attraction in enumerate(attractions, 1):
            match_icon = "🎯" if attraction['recommended'] else "📍"
            report += f"   {match_icon} {i}. {attraction['name']} ({attraction['interest_match']})\n"
        
        # Add local tips
        dest_data = self.knowledge_base.get(destination, {})
        local_tips = dest_data.get('local_tips', [])
        
        if local_tips:
            report += f"\n💡 INSIDER TIPS:\n"
            for tip in local_tips:
                report += f"   • {tip}\n"
        
        report += f"\n✅ Research completed by {self.name} on {datetime.now().strftime('%Y-%m-%d')}"
        
        goal['completed'] = True
        return report
    
    def _extract_month_from_dates(self, date_string: str) -> str:
        """Extract month from date string"""
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
        
        for month in months:
            if month in date_string or month[:3] in date_string:
                return month
        return 'June'


class BudgetPlannerAgent:
    """
    An intelligent budget planning agent for travel expenses.
    
    Like a financial advisor for your trip, this agent can:
    - Analyze budget distribution across categories
    - Provide smart allocation recommendations
    - Track expenses in real-time
    - Alert about budget overruns
    """
    
    def __init__(self, total_budget: float, trip_duration: int = 14):
        self.name = "BudgetWise"
        self.total_budget = total_budget
        self.trip_duration = trip_duration
        self.daily_budget = total_budget / trip_duration
        
        self.categories = {
            'accommodation': {'default_pct': 0.35, 'allocated': 0, 'spent': 0},
            'food': {'default_pct': 0.25, 'allocated': 0, 'spent': 0},
            'activities': {'default_pct': 0.20, 'allocated': 0, 'spent': 0},
            'transport': {'default_pct': 0.15, 'allocated': 0, 'spent': 0},
            'shopping': {'default_pct': 0.05, 'allocated': 0, 'spent': 0}
        }
        
        self.expenses = []
        self.recommendations = []
        self.alerts = []
        
        self._calculate_initial_allocation()
    
    def _calculate_initial_allocation(self):
        """Calculate initial budget allocation"""
        for category in self.categories:
            default_pct = self.categories[category]['default_pct']
            self.categories[category]['allocated'] = self.total_budget * default_pct
        
        print(f"💰 Budget initialized: ${self.total_budget:.2f} for {self.trip_duration} days")
        print(f"📊 Daily budget: ${self.daily_budget:.2f}")
    
    def analyze_budget_distribution(self, priorities: List[str] = None) -> Dict[str, float]:
        """Optimize budget distribution based on priorities"""
        print(f"🎯 Analyzing budget with priorities: {priorities or 'default'}")
        
        if not priorities:
            return {cat: data['allocated'] for cat, data in self.categories.items()}
        
        # Adjust based on priorities
        adjustments = self._calculate_priority_adjustments(priorities)
        adjusted_allocations = {}
        
        for category, data in self.categories.items():
            base_allocation = data['allocated']
            adjustment = adjustments.get(category, 0)
            adjusted_allocations[category] = max(0, base_allocation + adjustment)
        
        # Update internal allocations
        for category in self.categories:
            self.categories[category]['allocated'] = adjusted_allocations[category]
        
        return adjusted_allocations
    
    def _calculate_priority_adjustments(self, priorities: List[str]) -> Dict[str, float]:
        """Calculate budget adjustments based on priorities"""
        adjustments = {cat: 0 for cat in self.categories}
        
        priority_mappings = {
            'luxury_accommodation': ('accommodation', 0.15),
            'food_experience': ('food', 0.12),
            'activity_focused': ('activities', 0.15),
            'budget_conscious': ('food', -0.08),
            'cultural_immersion': ('activities', 0.10),
        }
        
        for priority in priorities:
            if priority in priority_mappings:
                category, adjustment_pct = priority_mappings[priority]
                adjustments[category] += self.total_budget * adjustment_pct
        
        # Balance adjustments
        total_positive = sum(adj for adj in adjustments.values() if adj > 0)
        if total_positive > 0:
            negative_categories = [c for c in adjustments if adjustments[c] <= 0]
            if negative_categories:
                reduction_per_category = total_positive / len(negative_categories)
                for category in negative_categories:
                    adjustments[category] -= reduction_per_category
        
        return adjustments
    
    def get_smart_recommendations(self) -> List[str]:
        """Generate smart budget recommendations"""
        recommendations = []
        
        if self.daily_budget < 50:
            recommendations.extend([
                "💡 Consider hostels to maximize experiences",
                "🥪 Mix street food with occasional restaurant meals",
                "🚶 Walk more, use public transport strategically"
            ])
        elif self.daily_budget > 200:
            recommendations.extend([
                "✨ You can afford luxury experiences!",
                "🍷 Consider fine dining and wine tastings",
                "🏨 Boutique hotels or luxury accommodations"
            ])
        else:
            recommendations.extend([
                "👍 Great balance between comfort and experiences",
                "🏨 Mix of mid-range hotels and nice restaurants",
                "🎯 Focus budget on your top priorities"
            ])
        
        return recommendations
    
    def track_expense(self, category: str, amount: float, description: str) -> str:
        """Track an expense and provide feedback"""
        if category not in self.categories:
            return f"❌ Unknown category: {category}"
        
        expense = {
            'category': category,
            'amount': amount,
            'description': description,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'timestamp': datetime.now()
        }
        self.expenses.append(expense)
        self.categories[category]['spent'] += amount
        
        allocated = self.categories[category]['allocated']
        spent = self.categories[category]['spent']
        remaining = allocated - spent
        
        feedback = f"💸 Logged: ${amount:.2f} for {description}"
        
        if remaining < 0:
            overspend = abs(remaining)
            alert_msg = f"⚠️ Over budget in {category}! Overspent by ${overspend:.2f}"
            self.alerts.append(alert_msg)
            feedback += f"\n{alert_msg}"
        else:
            remaining_pct = (remaining / allocated) * 100 if allocated > 0 else 0
            feedback += f"\n✅ Remaining in {category}: ${remaining:.2f} ({remaining_pct:.1f}%)"
            
        return feedback
    
    def generate_budget_summary(self) -> str:
        """Generate a budget summary report"""
        total_spent = sum(expense['amount'] for expense in self.expenses)
        remaining_budget = self.total_budget - total_spent
        
        summary = f"""
💰 BUDGET SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Total Budget: ${self.total_budget:.2f}
💸 Total Spent: ${total_spent:.2f}
💰 Remaining: ${remaining_budget:.2f}

📊 CATEGORY BREAKDOWN:
"""
        
        for category, data in self.categories.items():
            spent_pct = (data['spent'] / data['allocated'] * 100) if data['allocated'] > 0 else 0
            status = "🚨" if data['spent'] > data['allocated'] else "✅" if spent_pct < 80 else "⚠️"
            
            summary += f"   {status} {category.title()}: ${data['spent']:.0f} / ${data['allocated']:.0f} ({spent_pct:.1f}%)\n"
        
        if self.alerts:
            summary += f"\n🚨 RECENT ALERTS:\n"
            for alert in self.alerts[-3:]:
                summary += f"   {alert}\n"
        
        return summary


# Demonstration of both specialized agents working together
def demonstrate_specialized_agents():
    """Show how specialized agents can work together or independently"""
    print("🚀 SPECIALIZED AGENTS DEMONSTRATION")
    print("=" * 60)
    
    # Create both agents
    print("\n1️⃣ CREATING SPECIALIZED AGENTS")
    research_agent = TripResearchAgent("TravelGuru")
    budget_agent = BudgetPlannerAgent(2500, 14)
    
    # Set up research goal
    print("\n2️⃣ SETTING RESEARCH GOALS")
    research_agent.set_research_goal("Rome", "June 15-29, 2024", ["history", "art", "food"], "mid-range")
    
    # Generate research report
    print("\n3️⃣ GENERATING RESEARCH REPORT")
    research_report = research_agent.compile_research_report("Rome")
    print(research_report)
    
    # Configure budget based on priorities
    print("\n4️⃣ OPTIMIZING BUDGET ALLOCATION")
    allocations = budget_agent.analyze_budget_distribution(['food_experience', 'cultural_immersion'])
    
    print("\n📊 Optimized Budget Allocation:")
    for category, amount in allocations.items():
        percentage = (amount / 2500) * 100
        print(f"   {category.title()}: ${amount:.2f} ({percentage:.1f}%)")
    
    # Get smart recommendations
    print("\n💡 Smart Budget Recommendations:")
    recommendations = budget_agent.get_smart_recommendations()
    for rec in recommendations:
        print(f"   {rec}")
    
    # Simulate some expenses
    print("\n5️⃣ TRACKING SAMPLE EXPENSES")
    sample_expenses = [
        ('accommodation', 120, 'Hotel Rome - Night 1'),
        ('food', 65, 'Amazing dinner in Trastevere'),
        ('activities', 85, 'Colosseum and Forum tour'),
        ('transport', 25, 'Airport to city center')
    ]
    
    for category, amount, description in sample_expenses:
        result = budget_agent.track_expense(category, amount, description)
        print(f"\n{result}")
    
    # Final budget summary
    print("\n6️⃣ FINAL BUDGET SUMMARY")
    summary = budget_agent.generate_budget_summary()
    print(summary)
    
    print("\n" + "=" * 60)
    print("🎉 DEMONSTRATION COMPLETE!")
    print("=" * 60)
    print("This shows how specialized agents can:")
    print("✅ Work independently on their expertise areas")
    print("✅ Provide detailed, focused results")
    print("✅ Be combined for comprehensive planning")
    print("✅ Adapt to user preferences and priorities")


if __name__ == "__main__":
    demonstrate_specialized_agents()
