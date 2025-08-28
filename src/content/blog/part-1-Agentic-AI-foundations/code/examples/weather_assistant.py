"""
Weather Assistant Example - Basic Tool-Using Agent

This example shows how to build a simple agent that can check weather
and provide recommendations. It demonstrates basic tool usage and
decision-making patterns.
"""

from datetime import datetime
from typing import Dict, List, Any
import random


class MockWeatherAPI:
    """Mock weather API for demonstration purposes"""
    
    @staticmethod
    def get_current_weather(city: str) -> Dict[str, Any]:
        """Simulate weather API call"""
        # Mock weather conditions
        conditions = ["sunny", "cloudy", "rainy", "snowy", "partly cloudy"]
        temperatures = list(range(-5, 35))  # Celsius range
        
        return {
            "city": city,
            "condition": random.choice(conditions),
            "temperature": random.choice(temperatures),
            "humidity": random.randint(20, 90),
            "wind_speed": random.randint(0, 25),
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def get_forecast(city: str, days: int = 3) -> List[Dict[str, Any]]:
        """Simulate weather forecast"""
        forecasts = []
        for day in range(days):
            date = datetime.now().strftime(f"%Y-%m-%{datetime.now().day + day:02d}")
            forecasts.append({
                "date": date,
                "condition": random.choice(["sunny", "cloudy", "rainy"]),
                "high_temp": random.randint(15, 30),
                "low_temp": random.randint(5, 20),
                "rain_chance": random.randint(0, 100)
            })
        return forecasts


class WeatherAssistant:
    """
    A simple weather assistant agent that can:
    - Check current weather conditions
    - Provide weather-appropriate recommendations  
    - Give multi-day forecasts
    - Adapt suggestions based on conditions
    """
    
    def __init__(self, name: str = "WeatherBot"):
        self.name = name
        self.weather_api = MockWeatherAPI()
        self.memory = []  # Simple conversation memory
        
    def check_weather(self, city: str) -> str:
        """Check current weather and provide basic info"""
        print(f"🌤️ {self.name} is checking weather for {city}...")
        
        weather = self.weather_api.get_current_weather(city)
        
        # Store in memory
        self.memory.append({
            "action": "weather_check",
            "city": city,
            "result": weather,
            "timestamp": datetime.now()
        })
        
        # Format response
        condition = weather["condition"]
        temp = weather["temperature"]
        
        response = f"""🌍 CURRENT WEATHER FOR {city.upper()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌡️ Temperature: {temp}°C
☁️ Conditions: {condition.title()}
💧 Humidity: {weather["humidity"]}%
💨 Wind Speed: {weather["wind_speed"]} km/h

{self._get_weather_recommendations(weather)}
"""
        return response
    
    def _get_weather_recommendations(self, weather: Dict[str, Any]) -> str:
        """Generate recommendations based on weather conditions"""
        condition = weather["condition"].lower()
        temp = weather["temperature"]
        
        recommendations = []
        
        # Temperature-based recommendations
        if temp < 0:
            recommendations.extend([
                "🧥 Bundle up! Wear warm layers and winter coat",
                "☕ Perfect weather for hot drinks",
                "❄️ Watch for icy conditions"
            ])
        elif temp < 10:
            recommendations.extend([
                "🧥 Wear a jacket or warm layers", 
                "🧤 Consider gloves and hat",
                "🚶 Great weather for brisk walks"
            ])
        elif temp < 20:
            recommendations.extend([
                "👕 Light layers are perfect",
                "🚶 Excellent weather for outdoor activities",
                "☕ Maybe a light jacket for evening"
            ])
        elif temp < 30:
            recommendations.extend([
                "👕 Light, breathable clothing recommended",
                "🌞 Great weather for outdoor activities!",
                "💧 Stay hydrated"
            ])
        else:
            recommendations.extend([
                "🩳 Very hot! Light clothing essential",
                "💧 Drink lots of water",
                "🏠 Consider indoor activities during peak heat"
            ])
        
        # Condition-based recommendations  
        if "rain" in condition:
            recommendations.extend([
                "☔ Don't forget your umbrella!",
                "🏠 Good day for indoor activities",
                "👟 Wear waterproof shoes"
            ])
        elif "snow" in condition:
            recommendations.extend([
                "❄️ Bundle up and enjoy the winter wonderland!",
                "👟 Wear boots with good traction",
                "🔥 Perfect day for hot cocoa"
            ])
        elif "sunny" in condition:
            recommendations.extend([
                "☀️ Beautiful day to be outside!",
                "🕶️ Don't forget sunglasses",
                "🧴 Apply sunscreen"
            ])
        
        rec_text = "\n💡 RECOMMENDATIONS:\n"
        for rec in recommendations[:4]:  # Limit to 4 recommendations
            rec_text += f"   {rec}\n"
            
        return rec_text
    
    def get_forecast(self, city: str, days: int = 3) -> str:
        """Get weather forecast and planning suggestions"""
        print(f"📅 {self.name} is getting {days}-day forecast for {city}...")
        
        forecast = self.weather_api.get_forecast(city, days)
        
        # Store in memory
        self.memory.append({
            "action": "forecast_check",
            "city": city,
            "days": days,
            "result": forecast,
            "timestamp": datetime.now()
        })
        
        response = f"""📅 {days}-DAY FORECAST FOR {city.upper()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""
        
        for day_forecast in forecast:
            condition = day_forecast["condition"]
            high = day_forecast["high_temp"]
            low = day_forecast["low_temp"] 
            rain = day_forecast["rain_chance"]
            
            response += f"""📍 {day_forecast["date"]}:
   🌡️ High: {high}°C, Low: {low}°C
   ☁️ Conditions: {condition.title()}
   🌧️ Rain Chance: {rain}%

"""
        
        response += self._get_planning_suggestions(forecast)
        return response
    
    def _get_planning_suggestions(self, forecast: List[Dict]) -> str:
        """Generate planning suggestions based on forecast"""
        suggestions = []
        
        # Analyze forecast for patterns
        rainy_days = sum(1 for day in forecast if day["rain_chance"] > 60)
        sunny_days = sum(1 for day in forecast if day["condition"] == "sunny")
        cold_days = sum(1 for day in forecast if day["high_temp"] < 10)
        hot_days = sum(1 for day in forecast if day["high_temp"] > 25)
        
        if rainy_days >= 2:
            suggestions.append("☔ Pack an umbrella - several rainy days ahead")
            suggestions.append("🏛️ Great time to visit museums or indoor attractions")
        
        if sunny_days >= 2:
            suggestions.append("☀️ Perfect for outdoor activities and sightseeing!")
            suggestions.append("📸 Excellent photo opportunities with good lighting")
        
        if cold_days >= 1:
            suggestions.append("🧥 Pack warm layers for the cooler days")
        
        if hot_days >= 1:
            suggestions.append("🌞 Plan indoor activities during peak heat hours")
            suggestions.append("💧 Carry water bottle on hot days")
        
        # Temperature variation analysis
        temp_ranges = [day["high_temp"] - day["low_temp"] for day in forecast]
        avg_range = sum(temp_ranges) / len(temp_ranges)
        
        if avg_range > 15:
            suggestions.append("🌡️ Big temperature swings - pack layers!")
        
        if not suggestions:
            suggestions.append("👍 Looks like generally pleasant weather ahead!")
        
        planning_text = "🗓️ PLANNING SUGGESTIONS:\n"
        for suggestion in suggestions[:4]:  # Limit suggestions
            planning_text += f"   {suggestion}\n"
        
        return planning_text
    
    def weather_conversation(self, user_input: str) -> str:
        """Handle conversational weather requests"""
        user_lower = user_input.lower()
        
        # Simple intent recognition
        if "weather" in user_lower and ("today" in user_lower or "current" in user_lower):
            # Extract city (simplified)
            words = user_input.split()
            city = "New York"  # Default
            for i, word in enumerate(words):
                if word.lower() in ["in", "for", "at"] and i + 1 < len(words):
                    city = words[i + 1].replace("?", "").replace(",", "")
                    break
            
            return self.check_weather(city)
        
        elif "forecast" in user_lower or "next few days" in user_lower:
            # Extract city
            city = "New York"  # Default  
            words = user_input.split()
            for i, word in enumerate(words):
                if word.lower() in ["in", "for", "at"] and i + 1 < len(words):
                    city = words[i + 1].replace("?", "").replace(",", "")
                    break
            
            return self.get_forecast(city)
        
        else:
            return f"""🤖 Hi! I'm {self.name}, your weather assistant.

I can help you with:
• Current weather conditions
• Multi-day forecasts  
• Weather-appropriate recommendations
• Planning suggestions

Try asking:
• "What's the weather like today in Paris?"
• "Show me the forecast for Rome"
• "Will it rain tomorrow in London?"
"""
    
    def get_memory_summary(self) -> str:
        """Get a summary of recent weather checks"""
        if not self.memory:
            return "No weather checks performed yet."
        
        summary = f"📊 WEATHER ASSISTANT ACTIVITY SUMMARY\n"
        summary += f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        summary += f"📈 Total weather checks: {len(self.memory)}\n\n"
        
        # Recent activity
        summary += "🕐 RECENT ACTIVITY:\n"
        for entry in self.memory[-3:]:  # Last 3 entries
            action = entry["action"]
            timestamp = entry["timestamp"].strftime("%H:%M")
            
            if action == "weather_check":
                city = entry["city"]
                temp = entry["result"]["temperature"]
                condition = entry["result"]["condition"]
                summary += f"   {timestamp}: Checked {city} - {temp}°C, {condition}\n"
            elif action == "forecast_check":
                city = entry["city"] 
                days = entry["days"]
                summary += f"   {timestamp}: {days}-day forecast for {city}\n"
        
        return summary


def demonstrate_weather_assistant():
    """Comprehensive demonstration of the weather assistant"""
    print("🌤️ WEATHER ASSISTANT DEMONSTRATION")
    print("=" * 50)
    
    # Create weather assistant
    assistant = WeatherAssistant("WeatherGuru")
    
    print(f"\n👋 Meet {assistant.name}!")
    
    # Test current weather
    print("\n1️⃣ CURRENT WEATHER CHECK:")
    weather_result = assistant.check_weather("Rome")
    print(weather_result)
    
    # Test forecast
    print("\n2️⃣ WEATHER FORECAST:")
    forecast_result = assistant.get_forecast("Paris", 5)
    print(forecast_result)
    
    # Test conversational interface
    print("\n3️⃣ CONVERSATIONAL WEATHER REQUESTS:")
    
    queries = [
        "What's the weather like today in London?",
        "Show me the forecast for Berlin",
        "Will it rain tomorrow in Amsterdam?"
    ]
    
    for query in queries:
        print(f"\nUser: {query}")
        response = assistant.weather_conversation(query)
        print(f"Assistant: {response[:200]}...")  # Truncate for demo
    
    # Show memory summary
    print("\n4️⃣ ASSISTANT MEMORY SUMMARY:")
    memory_summary = assistant.get_memory_summary()
    print(memory_summary)
    
    print("\n" + "=" * 50)
    print("✅ WEATHER ASSISTANT DEMO COMPLETE!")
    print("=" * 50)
    print("""
🌟 KEY FEATURES DEMONSTRATED:

✅ Tool Integration: Weather API usage
✅ Context Awareness: Temperature and condition-based recommendations  
✅ Memory System: Remembers previous weather checks
✅ Conversational Interface: Natural language processing
✅ Multi-Day Planning: Forecast analysis and suggestions
✅ Adaptive Responses: Different recommendations for different conditions

This shows how agents can:
• Use external tools (weather API)
• Make intelligent recommendations based on data
• Maintain conversation context
• Adapt responses to different situations
    """)


if __name__ == "__main__":
    demonstrate_weather_assistant()
