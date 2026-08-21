"""
Simple Travel Agent - Part 1 Example
Demonstrates basic agentic behavior for trip planning
"""

import time
import random
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class TripGoals:
    """Represents what the user wants to achieve"""
    destinations: List[str]
    budget: int
    duration: int
    preferences: List[str]
    constraints: List[str]

class SimpleWeatherAPI:
    """Mock weather API"""
    def get_forecast(self, city: str) -> Dict:
        # Mock data - in reality, you'd call a real weather API
        weather_options = ["sunny", "rainy", "cloudy", "snowy"]
        return {
            "city": city,
            "forecast": random.choice(weather_options),
            "temperature": random.randint(-5, 25),
            "rainfall": random.randint(0, 100)
        }

class SimplePriceAPI:
    """Mock pricing API"""
    def get_hotel_prices(self, city: str) -> Dict:
        base_prices = {"paris": 120, "berlin": 80, "amsterdam": 100, "prague": 60}
        base = base_prices.get(city.lower(), 90)
        return {
            "city": city,
            "avg_hotel_price": base + random.randint(-20, 40),
            "budget_options": base * 0.6,
            "luxury_options": base * 2.5
        }
    
    def get_flight_prices(self, route: str) -> int:
        # Mock flight prices
        return random.randint(200, 800)

class TravelAgentMemory:
    """Simple memory system for the agent"""
    def __init__(self):
        self.research_cache = {}
        self.user_preferences = {}
        self.decision_history = []
    
    def store_research(self, city: str, data: Dict):
        self.research_cache[city] = data
        print(f"💾 Stored research data for {city}")
    
    def get_research(self, city: str) -> Dict:
        return self.research_cache.get(city, {})
    
    def learn_preference(self, preference_type: str, value: Any):
        self.user_preferences[preference_type] = value
        print(f"🧠 Learned: User prefers {preference_type} = {value}")

class SimpleTravelAgent:
    """
    A basic agentic AI for travel planning
    Demonstrates autonomous goal-oriented behavior
    """
    
    def __init__(self, goals: TripGoals):
        self.goals = goals
        self.memory = TravelAgentMemory()
        self.weather_api = SimpleWeatherAPI()
        self.price_api = SimplePriceAPI()
        self.current_recommendations = {}
        self.state = "initialized"
    
    def autonomous_planning_cycle(self):
        """
        The main agent loop - this is what makes it 'agentic'
        The agent autonomously works toward goals
        """
        print("🚀 Starting autonomous trip planning...")
        print(f"📋 Goals: Visit {self.goals.destinations}, Budget: ${self.goals.budget}, Duration: {self.goals.duration} days")
        print()
        
        steps_completed = 0
        max_steps = 10  # Prevent infinite loops
        
        while not self.goals_achieved() and steps_completed < max_steps:
            print(f"🔄 Planning Step {steps_completed + 1}")
            
            # 1. Observe current situation
            self.observe_environment()
            
            # 2. Plan next actions based on current state
            next_actions = self.plan_next_actions()
            
            # 3. Execute actions
            for action in next_actions:
                self.execute_action(action)
            
            # 4. Update state
            self.update_state()
            
            steps_completed += 1
            time.sleep(0.5)  # Brief pause for readability
            print()
        
        # Final recommendations
        self.present_final_plan()
    
    def observe_environment(self):
        """Gather information about current situation"""
        print("👀 Observing current conditions...")
        
        # Check if we need to research any destinations
        unresearched_cities = [
            city for city in self.goals.destinations 
            if city not in self.memory.research_cache
        ]
        
        if unresearched_cities:
            print(f"📊 Need to research: {unresearched_cities}")
            self.state = "research_needed"
        else:
            print("✅ All destinations researched")
            self.state = "ready_to_plan"
    
    def plan_next_actions(self) -> List[Dict]:
        """Decide what to do next based on current state"""
        actions = []
        
        if self.state == "research_needed":
            # Need to research destinations
            for city in self.goals.destinations:
                if city not in self.memory.research_cache:
                    actions.append({
                        "type": "research_destination", 
                        "target": city
                    })
        
        elif self.state == "ready_to_plan":
            # Analyze research and make recommendations
            actions.append({
                "type": "analyze_and_recommend",
                "target": "all_destinations"
            })
        
        return actions
    
    def execute_action(self, action: Dict):
        """Actually perform an action"""
        if action["type"] == "research_destination":
            self.research_destination(action["target"])
        
        elif action["type"] == "analyze_and_recommend":
            self.analyze_and_recommend()
    
    def research_destination(self, city: str):
        """Research a specific destination autonomously"""
        print(f"🔍 Researching {city}...")
        
        # Gather data from multiple sources
        weather = self.weather_api.get_forecast(city)
        prices = self.price_api.get_hotel_prices(city)
        
        # Analyze based on user preferences
        analysis = self.analyze_destination(city, weather, prices)
        
        # Store in memory
        research_data = {
            "weather": weather,
            "prices": prices,
            "analysis": analysis,
            "researched_at": time.time()
        }
        
        self.memory.store_research(city, research_data)
        
        print(f"   Weather: {weather['forecast']}, {weather['temperature']}°C")
        print(f"   Hotels: ${prices['avg_hotel_price']}/night")
        print(f"   Rating: {analysis['overall_score']}/10")
    
    def analyze_destination(self, city: str, weather: Dict, prices: Dict) -> Dict:
        """Analyze how well a destination fits user goals"""
        score = 5.0  # Base score
        reasons = []
        
        # Weather preference analysis
        if weather["forecast"] == "sunny" and "outdoor activities" in self.goals.preferences:
            score += 2
            reasons.append("Great weather for outdoor activities")
        elif weather["forecast"] == "rainy":
            score -= 1
            reasons.append("Rainy weather might limit outdoor activities")
        
        # Budget analysis
        daily_cost = prices["avg_hotel_price"]
        if daily_cost * self.goals.duration <= self.goals.budget * 0.6:  # 60% of budget for accommodation
            score += 1
            reasons.append("Within budget range")
        else:
            score -= 2
            reasons.append("Might be expensive for the budget")
        
        # Preference matching
        if "museums" in self.goals.preferences and city.lower() in ["paris", "berlin"]:
            score += 1.5
            reasons.append("Excellent museums")
        
        if "nightlife" in self.goals.preferences and city.lower() in ["berlin", "amsterdam"]:
            score += 1
            reasons.append("Great nightlife scene")
        
        return {
            "overall_score": round(min(10, max(1, score)), 1),
            "reasons": reasons,
            "recommended": score >= 6
        }
    
    def analyze_and_recommend(self):
        """Analyze all research and make final recommendations"""
        print("🤔 Analyzing all destinations and creating recommendations...")
        
        recommendations = {}
        
        for city in self.goals.destinations:
            research = self.memory.get_research(city)
            if research:
                analysis = research["analysis"]
                recommendations[city] = {
                    "score": analysis["overall_score"],
                    "recommended": analysis["recommended"],
                    "reasons": analysis["reasons"],
                    "estimated_daily_cost": research["prices"]["avg_hotel_price"]
                }
        
        # Sort by score
        sorted_cities = sorted(
            recommendations.items(), 
            key=lambda x: x[1]["score"], 
            reverse=True
        )
        
        self.current_recommendations = dict(sorted_cities)
        self.state = "recommendations_ready"
        
        print("📊 Analysis complete!")
    
    def update_state(self):
        """Update agent's internal state"""
        if self.state == "research_needed":
            # Check if research is complete
            if all(city in self.memory.research_cache for city in self.goals.destinations):
                self.state = "research_complete"
    
    def goals_achieved(self) -> bool:
        """Check if the agent has achieved its goals"""
        return self.state == "recommendations_ready"
    
    def present_final_plan(self):
        """Present the final travel recommendations"""
        print("🎉 Travel Planning Complete!")
        print("=" * 50)
        print()
        
        print("📋 PERSONALIZED TRAVEL RECOMMENDATIONS")
        print("-" * 40)
        
        for i, (city, rec) in enumerate(self.current_recommendations.items(), 1):
            status = "✅ HIGHLY RECOMMENDED" if rec["recommended"] else "⚠️  CONSIDER CAREFULLY"
            print(f"{i}. {city.upper()} - Score: {rec['score']}/10 {status}")
            print(f"   Daily Cost: ${rec['estimated_daily_cost']}")
            print(f"   Why: {', '.join(rec['reasons'])}")
            print()
        
        # Budget analysis
        total_accommodation = sum(
            rec["estimated_daily_cost"] * self.goals.duration 
            for rec in self.current_recommendations.values()
        ) / len(self.current_recommendations)
        
        print(f"💰 BUDGET ANALYSIS")
        print(f"   Estimated accommodation: ${total_accommodation:.0f}")
        print(f"   Remaining for flights/food/activities: ${self.goals.budget - total_accommodation:.0f}")
        print()
        
        print("🚀 Next Steps:")
        print("   1. Book flights to top-rated destinations")
        print("   2. Reserve accommodations in recommended areas")
        print("   3. Research specific activities based on weather forecasts")
        
    def explain_agent_behavior(self):
        """Explain what makes this agent 'agentic'"""
        print("\n" + "=" * 60)
        print("🤖 WHAT MADE THIS AI 'AGENTIC'?")
        print("=" * 60)
        print()
        print("Unlike basic automation or traditional AI chatbots, this agent:")
        print()
        print("✅ AUTONOMOUS: Worked toward your goals without constant instruction")
        print("✅ PROACTIVE: Took initiative to research destinations")
        print("✅ GOAL-ORIENTED: Every action aimed at achieving your trip goals")
        print("✅ ADAPTIVE: Could handle different destination data and preferences")
        print("✅ MEMORY: Remembered research to avoid duplicate work")
        print("✅ REASONING: Analyzed data against your specific preferences")
        print()
        print("This is the foundation of Agentic AI! 🎯")

# Example usage
if __name__ == "__main__":
    # Define trip goals
    my_trip_goals = TripGoals(
        destinations=["Paris", "Berlin", "Amsterdam", "Prague"],
        budget=2500,
        duration=14,
        preferences=["museums", "local food", "nightlife"],
        constraints=["no more than 3 flights", "stay in city centers"]
    )
    
    # Create and run the agent
    agent = SimpleTravelAgent(my_trip_goals)
    agent.autonomous_planning_cycle()
    agent.explain_agent_behavior()
