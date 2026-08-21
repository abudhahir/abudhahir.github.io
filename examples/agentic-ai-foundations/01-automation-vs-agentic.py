"""
Basic Automation Examples - NOT Agentic AI
These examples show simple rule-based systems that react to inputs
"""

def basic_trip_automation(budget, destinations, preferences):
    """
    Basic automation: Simple if-then rules
    This is NOT agentic - it just follows pre-programmed rules
    """
    print("🤖 Basic Automation Response:")
    
    # Simple rule-based logic
    if budget < 1000:
        return "Budget too low. Consider domestic travel."
    elif budget > 5000:
        return "High budget! Consider luxury destinations."
    
    if "beach" in preferences:
        return "Recommended: Thailand, Greece, or Mexico"
    elif "culture" in preferences:
        return "Recommended: Italy, Japan, or Egypt"
    else:
        return "Popular destinations: Paris, London, New York"

def traditional_ai_chatbot(user_question):
    """
    Traditional AI: Responds to specific questions
    This is NOT agentic - it only responds when prompted
    """
    print("🤖 Traditional AI Response:")
    
    # Simple keyword matching (in reality, this would be an LLM)
    if "paris" in user_question.lower():
        return "Paris is great! The Eiffel Tower is a must-see. Hotels average €120/night."
    elif "budget" in user_question.lower():
        return "Budget travel tips: Stay in hostels, eat local food, use public transport."
    elif "weather" in user_question.lower():
        return "Check weather forecasts before traveling. Pack accordingly."
    else:
        return "I can help with travel questions. What would you like to know?"

# Example usage showing limitations
if __name__ == "__main__":
    print("=" * 60)
    print("BASIC AUTOMATION VS TRADITIONAL AI VS AGENTIC AI")
    print("=" * 60)
    print()
    
    # 1. Basic Automation
    print("1️⃣ BASIC AUTOMATION (Rule-based):")
    result = basic_trip_automation(
        budget=2500, 
        destinations=["Paris", "Berlin"], 
        preferences=["culture"]
    )
    print(f"   Input: Budget $2500, want culture")
    print(f"   Output: {result}")
    print("   ❌ Problem: Can't adapt, no memory, no initiative")
    print()
    
    # 2. Traditional AI
    print("2️⃣ TRADITIONAL AI (Q&A based):")
    questions = [
        "Tell me about Paris hotels",
        "What's the weather like?",
        "Help me plan a trip"
    ]
    
    for q in questions:
        answer = traditional_ai_chatbot(q)
        print(f"   Q: {q}")
        print(f"   A: {answer}")
    print("   ❌ Problem: Reactive only, no goal-seeking, no coordination")
    print()
    
    # 3. Agentic AI
    print("3️⃣ AGENTIC AI:")
    print("   ✅ Autonomous: Works toward goals without constant prompting")
    print("   ✅ Proactive: Takes initiative to research and plan")
    print("   ✅ Goal-oriented: Every action serves your trip objectives")
    print("   ✅ Adaptive: Learns and adjusts based on new information")
    print("   ✅ Memory: Remembers research and preferences")
    print("   ✅ Reasoning: Makes decisions based on multiple factors")
    print()
    print("   👉 Run simple_travel_agent.py to see the difference!")
