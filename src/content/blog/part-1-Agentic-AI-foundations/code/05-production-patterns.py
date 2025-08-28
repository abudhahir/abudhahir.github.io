"""
05 - Production Patterns: LangChain Integration & Modern Frameworks

This module shows how to integrate agentic AI concepts with production-ready frameworks.
We'll use LangChain, Azure OpenAI, and other modern tools to build agents that can
be deployed in real business environments.

⚠️ IMPORTANT: This requires API keys and proper setup.
Make sure you have your .env file configured with:
- AZURE_OPENAI_KEY
- AZURE_OPENAI_BASE  
- OPENAI_API_VERSION
"""

import os
from typing import Dict, List, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

try:
    from langchain.llms import AzureOpenAI
    from langchain.agents import create_openai_tools_agent, AgentExecutor
    from langchain.tools import tool
    from langchain.prompts import ChatPromptTemplate
    from langchain.memory import ConversationBufferMemory
    print("✅ LangChain imports successful")
except ImportError as e:
    print(f"❌ LangChain not available: {e}")
    print("Install with: pip install langchain langchain-openai")
    

class TripGoal(BaseModel):
    """Structured goal representation using Pydantic"""
    destination: str = Field(description="The destination to research")
    travel_dates: str = Field(description="When you're traveling")
    interests: List[str] = Field(description="Your travel interests")
    budget: Optional[float] = Field(None, description="Total budget")
    priority: int = Field(default=1, description="Goal priority (1-10)")
    completed: bool = Field(default=False, description="Whether goal is completed")
    created_at: datetime = Field(default_factory=datetime.now)


class AgentState(BaseModel):
    """Agent's internal state using Pydantic for validation"""
    agent_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    current_goal: Optional[TripGoal] = None
    completed_goals: List[TripGoal] = Field(default_factory=list)
    memory_context: Dict[str, Any] = Field(default_factory=dict)
    last_action: Optional[str] = None
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)


# Production-ready tools using LangChain's @tool decorator
@tool
def research_destination_tool(destination: str, interests: str) -> str:
    """Research a travel destination based on interests.
    
    Args:
        destination: The city or place to research
        interests: Comma-separated list of interests (e.g., 'history,food,art')
    """
    
    # Simulate comprehensive research (in production, this would call real APIs)
    interest_list = [i.strip().lower() for i in interests.split(',')]
    
    # Mock knowledge base
    destination_data = {
        'rome': {
            'highlights': ['Colosseum', 'Vatican', 'Trevi Fountain', 'Roman Forum'],
            'food': ['Carbonara', 'Pizza al Taglio', 'Gelato', 'Cacio e Pepe'],
            'history': 'Ancient Roman Empire capital with 2,800 years of history',
            'art': 'Renaissance masters, Vatican Museums, countless galleries',
            'budget_tip': 'Book skip-the-line tickets in advance'
        },
        'paris': {
            'highlights': ['Eiffel Tower', 'Louvre', 'Notre-Dame', 'Montmartre'],
            'food': ['Croissants', 'Coq au Vin', 'Macarons', 'French Cheese'],
            'history': 'City of Light with revolutionary history and royal palaces',
            'art': 'World\'s largest art museum, Impressionist masterpieces',
            'budget_tip': 'Many museums are free on first Sunday mornings'
        }
    }
    
    dest_key = destination.lower()
    if dest_key not in destination_data:
        return f"Limited information available for {destination}. Consider popular European destinations like Rome or Paris."
    
    data = destination_data[dest_key]
    
    # Customize response based on interests
    response = f"🌍 RESEARCH RESULTS FOR {destination.upper()}\n\n"
    
    if 'history' in interest_list:
        response += f"📚 HISTORY: {data['history']}\n\n"
    
    if 'art' in interest_list:
        response += f"🎨 ART: {data['art']}\n\n"
    
    if 'food' in interest_list:
        response += f"🍽️ FOOD: Must-try dishes include {', '.join(data['food'])}\n\n"
    
    response += f"🏛️ TOP ATTRACTIONS: {', '.join(data['highlights'])}\n\n"
    response += f"💡 PRO TIP: {data['budget_tip']}"
    
    return response


@tool
def get_weather_info_tool(destination: str, month: str) -> str:
    """Get weather information for a destination in a specific month.
    
    Args:
        destination: The city to get weather for
        month: The month of travel (e.g., 'June', 'July')
    """
    
    # Mock weather data (in production, use a real weather API)
    weather_data = {
        ('rome', 'june'): {'temp': '20-28°C', 'desc': 'Warm and pleasant', 'rain': 'Low'},
        ('rome', 'july'): {'temp': '23-31°C', 'desc': 'Hot and sunny', 'rain': 'Very low'},
        ('paris', 'june'): {'temp': '15-22°C', 'desc': 'Mild and pleasant', 'rain': 'Moderate'},
        ('paris', 'july'): {'temp': '17-25°C', 'desc': 'Warm', 'rain': 'Low'},
    }
    
    key = (destination.lower(), month.lower())
    if key not in weather_data:
        return f"Weather data not available for {destination} in {month}"
    
    weather = weather_data[key]
    
    packing_advice = []
    if 'hot' in weather['desc'].lower():
        packing_advice.extend(['Light clothing', 'Sun protection', 'Comfortable shoes'])
    elif 'warm' in weather['desc'].lower():
        packing_advice.extend(['Light layers', 'Comfortable walking gear'])
    else:
        packing_advice.extend(['Layered clothing', 'Light jacket'])
    
    if weather['rain'] in ['Moderate', 'High']:
        packing_advice.append('Umbrella or rain jacket')
    
    return f"""🌤️ WEATHER FOR {destination.upper()} IN {month.upper()}

🌡️ Temperature: {weather['temp']}
☀️ Conditions: {weather['desc']}
🌧️ Rain Probability: {weather['rain']}

🎒 PACKING RECOMMENDATIONS:
{chr(10).join(f'• {item}' for item in packing_advice)}"""


@tool  
def budget_analyzer_tool(total_budget: float, duration: int, priorities: str = "") -> str:
    """Analyze and optimize budget allocation for travel.
    
    Args:
        total_budget: Total available budget in dollars
        duration: Trip duration in days
        priorities: Comma-separated priorities (e.g., 'food,luxury,activities')
    """
    
    daily_budget = total_budget / duration
    priority_list = [p.strip().lower() for p in priorities.split(',') if p.strip()]
    
    # Default allocation percentages
    allocations = {
        'accommodation': 0.35,
        'food': 0.25, 
        'activities': 0.20,
        'transport': 0.15,
        'shopping': 0.05
    }
    
    # Adjust based on priorities
    if 'food' in priority_list or 'culinary' in priority_list:
        allocations['food'] += 0.10
        allocations['shopping'] -= 0.05
        allocations['activities'] -= 0.05
    
    if 'luxury' in priority_list:
        allocations['accommodation'] += 0.15
        allocations['food'] -= 0.05
        allocations['transport'] -= 0.10
    
    if 'activities' in priority_list or 'culture' in priority_list:
        allocations['activities'] += 0.10
        allocations['shopping'] -= 0.05
        allocations['accommodation'] -= 0.05
    
    # Calculate dollar amounts
    budget_breakdown = {cat: total_budget * pct for cat, pct in allocations.items()}
    
    # Generate recommendations
    recommendations = []
    if daily_budget < 50:
        recommendations.extend([
            "Consider hostels or budget accommodations",
            "Mix of street food and local restaurants", 
            "Look for free walking tours and activities"
        ])
    elif daily_budget > 200:
        recommendations.extend([
            "You can afford luxury experiences!",
            "Consider fine dining and premium activities",
            "Upscale accommodations with great locations"
        ])
    else:
        recommendations.extend([
            "Good balance between comfort and experiences",
            "Mix of mid-range hotels and restaurants",
            "Focus spending on your top priorities"
        ])
    
    result = f"""💰 BUDGET ANALYSIS FOR ${total_budget:.0f} ({duration} days)

📊 DAILY BUDGET: ${daily_budget:.2f}

💵 RECOMMENDED ALLOCATION:
"""
    
    for category, amount in budget_breakdown.items():
        percentage = allocations[category] * 100
        result += f"• {category.title()}: ${amount:.0f} ({percentage:.1f}%)\n"
    
    result += f"\n💡 SMART RECOMMENDATIONS:\n"
    for rec in recommendations:
        result += f"• {rec}\n"
    
    return result


class ProductionTravelAgent:
    """
    Production-ready travel agent using LangChain and modern AI frameworks.
    
    This demonstrates how to build agentic AI systems that can be deployed
    in real business environments with proper error handling, logging,
    and integration patterns.
    """
    
    def __init__(self, agent_name: str = "ProductionTravelAgent"):
        self.name = agent_name
        self.state = AgentState()
        
        # Initialize LLM (only if API keys are available)
        self.llm = None
        self.agent_executor = None
        
        if self._check_api_setup():
            self._initialize_llm()
            self._setup_agent()
        else:
            print("⚠️ API keys not configured. Agent will run in demo mode.")
    
    def _check_api_setup(self) -> bool:
        """Check if required API keys are configured"""
        required_keys = ['AZURE_OPENAI_KEY', 'AZURE_OPENAI_BASE']
        return all(os.getenv(key) for key in required_keys)
    
    def _initialize_llm(self):
        """Initialize Azure OpenAI LLM"""
        try:
            self.llm = AzureOpenAI(
                deployment_name="gpt-4",  # Your deployment name
                openai_api_version=os.getenv("OPENAI_API_VERSION", "2023-12-01-preview"),
                openai_api_base=os.getenv("AZURE_OPENAI_BASE"),
                openai_api_key=os.getenv("AZURE_OPENAI_KEY"),
                temperature=0.7,  # Balanced creativity and consistency
                max_tokens=1500
            )
            print("✅ Azure OpenAI LLM initialized")
        except Exception as e:
            print(f"❌ Failed to initialize LLM: {e}")
            self.llm = None
    
    def _setup_agent(self):
        """Setup LangChain agent with tools"""
        if not self.llm:
            return
            
        # Available tools
        tools = [research_destination_tool, get_weather_info_tool, budget_analyzer_tool]
        
        # Create agent prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert travel planning agent. Your goal is to help users 
            plan amazing trips by researching destinations, analyzing weather, and optimizing budgets.
            
            Your approach:
            1. Listen carefully to understand what the user really wants
            2. Use your tools strategically to gather relevant information
            3. Provide comprehensive, actionable recommendations
            4. Be proactive - anticipate needs and ask clarifying questions when helpful
            5. Focus on creating memorable experiences within the user's constraints
            
            Always be friendly, informative, and focused on practical outcomes."""),
            ("user", "{input}"),
            ("assistant", "{agent_scratchpad}")
        ])
        
        try:
            # Create agent
            agent = create_openai_tools_agent(self.llm, tools, prompt)
            
            # Create agent executor with memory
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
            
            self.agent_executor = AgentExecutor(
                agent=agent,
                tools=tools,
                memory=memory,
                verbose=True,  # Shows reasoning process
                max_iterations=5,  # Prevent infinite loops
                handle_parsing_errors=True  # Graceful error handling
            )
            
            print("✅ LangChain agent initialized with tools")
            
        except Exception as e:
            print(f"❌ Failed to setup agent: {e}")
            self.agent_executor = None
    
    def set_travel_goal(self, destination: str, dates: str, interests: List[str], budget: float = None) -> str:
        """Set a travel goal for the agent to work towards"""
        goal = TripGoal(
            destination=destination,
            travel_dates=dates,
            interests=interests,
            budget=budget
        )
        
        self.state.current_goal = goal
        
        goal_summary = f"""🎯 TRAVEL GOAL SET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Destination: {destination}
📅 Dates: {dates}
🎨 Interests: {', '.join(interests)}
💰 Budget: ${budget:.0f} if budget else 'Not specified'

✅ Goal registered! Ready to start planning."""
        
        print(goal_summary)
        return goal_summary
    
    def plan_trip(self, user_request: str) -> str:
        """Main trip planning method that uses the LangChain agent"""
        if not self.agent_executor:
            return self._demo_mode_response(user_request)
        
        try:
            # Update agent state
            self.state.last_action = "planning_trip"
            
            # Execute agent
            result = self.agent_executor.invoke({
                "input": user_request
            })
            
            # Update confidence based on successful execution
            self.state.confidence = min(self.state.confidence + 0.2, 1.0)
            
            return result["output"]
            
        except Exception as e:
            error_msg = f"❌ Error during trip planning: {str(e)}"
            print(error_msg)
            return error_msg
    
    def _demo_mode_response(self, user_request: str) -> str:
        """Provide demo response when API keys aren't configured"""
        return f"""🤖 DEMO MODE RESPONSE

Your request: {user_request}

In production mode with proper API keys, I would:
✅ Use LangChain to reason about your request
✅ Research destinations using real APIs
✅ Get current weather information
✅ Analyze your budget and provide optimization
✅ Create a comprehensive travel plan

To enable full functionality:
1. Set up Azure OpenAI account
2. Configure environment variables in .env file
3. Install required packages: pip install langchain langchain-openai

For now, you can run the individual tools in demo mode!"""
    
    def demonstrate_tools(self):
        """Demonstrate the individual tools working"""
        print("🔧 TOOL DEMONSTRATION")
        print("=" * 50)
        
        print("\n1️⃣ DESTINATION RESEARCH TOOL:")
        research_result = research_destination_tool.invoke({
            "destination": "Rome",
            "interests": "history,art,food"
        })
        print(research_result)
        
        print("\n2️⃣ WEATHER INFORMATION TOOL:")
        weather_result = get_weather_info_tool.invoke({
            "destination": "Rome", 
            "month": "June"
        })
        print(weather_result)
        
        print("\n3️⃣ BUDGET ANALYZER TOOL:")
        budget_result = budget_analyzer_tool.invoke({
            "total_budget": 2500.0,
            "duration": 14,
            "priorities": "food,culture"
        })
        print(budget_result)
    
    def get_agent_status(self) -> str:
        """Get detailed agent status"""
        status = f"""🤖 AGENT STATUS: {self.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Agent ID: {self.state.agent_id}
🎯 Current Goal: {self.state.current_goal.destination if self.state.current_goal else 'None'}
✅ Completed Goals: {len(self.state.completed_goals)}
🎚️ Confidence: {self.state.confidence:.1%}
🔧 LLM Status: {'✅ Connected' if self.llm else '❌ Not configured'}
⚙️ Agent Status: {'✅ Active' if self.agent_executor else '❌ Demo mode'}
"""
        
        if self.state.current_goal:
            status += f"""
📍 CURRENT GOAL DETAILS:
   Destination: {self.state.current_goal.destination}
   Dates: {self.state.current_goal.travel_dates}
   Interests: {', '.join(self.state.current_goal.interests)}
   Budget: ${self.state.current_goal.budget:.0f if self.state.current_goal.budget else 'Not set'}
"""
        
        return status


def demonstrate_production_agent():
    """Comprehensive demonstration of production-ready agent"""
    print("🚀 PRODUCTION AGENTIC AI DEMONSTRATION")
    print("=" * 60)
    
    # Create production agent
    agent = ProductionTravelAgent("TravelPro")
    
    # Show initial status
    print("\n📊 INITIAL AGENT STATUS:")
    print(agent.get_agent_status())
    
    # Set a travel goal
    print("\n🎯 SETTING TRAVEL GOAL:")
    agent.set_travel_goal(
        destination="Rome",
        dates="June 15-29, 2024", 
        interests=["history", "art", "food"],
        budget=2500
    )
    
    # Demonstrate tools individually
    print("\n🔧 DEMONSTRATING INDIVIDUAL TOOLS:")
    agent.demonstrate_tools()
    
    # Try comprehensive trip planning
    print("\n🗺️ COMPREHENSIVE TRIP PLANNING:")
    trip_plan = agent.plan_trip("""
    I want to plan an amazing 14-day trip to Rome in June. I'm really interested in 
    history, art, and incredible food experiences. My budget is $2500 total. 
    Can you help me research the destination, understand the weather, and optimize 
    my budget allocation? I want to make sure I have an incredible, well-planned experience.
    """)
    
    print("\n📋 TRIP PLAN RESULT:")
    print(trip_plan)
    
    # Show final status
    print("\n📊 FINAL AGENT STATUS:")
    print(agent.get_agent_status())
    
    print("\n" + "=" * 60)
    print("🎉 PRODUCTION DEMONSTRATION COMPLETE!")
    print("=" * 60)
    
    print("""
🌟 KEY PRODUCTION FEATURES DEMONSTRATED:

✅ LangChain Integration: Modern agent framework
✅ Azure OpenAI: Enterprise-grade LLM integration  
✅ Pydantic Models: Type-safe data validation
✅ Tool Orchestration: Multiple specialized capabilities
✅ Error Handling: Graceful degradation and recovery
✅ Memory Management: Conversation context retention
✅ State Tracking: Comprehensive agent state management
✅ Demo Mode: Fallback when APIs unavailable

🚀 NEXT STEPS FOR PRODUCTION:
• Set up proper API keys and authentication
• Add logging and monitoring
• Implement persistent storage
• Add more sophisticated tools and APIs
• Create web interface or API endpoints
• Add user authentication and session management
    """)


if __name__ == "__main__":
    demonstrate_production_agent()
