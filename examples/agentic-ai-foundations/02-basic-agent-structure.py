"""
Basic Agent Structure - Foundation for Agentic AI

This module provides the basic building blocks for creating agentic AI systems.
Think of this as the blueprint for creating AI that can think and act like a human
planning a complex task.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional


class Goal:
    """Represents a goal that an agent is working towards"""
    def __init__(self, goal_type: str, parameters: Dict[str, Any], priority: int = 1):
        self.type = goal_type
        self.parameters = parameters
        self.priority = priority
        self.completed = False
        self.created_at = datetime.now()
        self.completed_at = None
    
    def complete(self):
        """Mark this goal as completed"""
        self.completed = True
        self.completed_at = datetime.now()
    
    def __str__(self):
        status = "✅" if self.completed else "🎯"
        return f"{status} {self.type}: {self.parameters}"


class Action:
    """Represents an action that can be taken by an agent"""
    def __init__(self, action_type: str, parameters: Dict[str, Any], tool_needed: str = None):
        self.type = action_type
        self.parameters = parameters
        self.tool_needed = tool_needed
        self.created_at = datetime.now()
    
    def __str__(self):
        return f"Action: {self.type} with {self.parameters}"


class MemoryEntry:
    """Represents a memory entry storing agent experiences"""
    def __init__(self, experience_type: str, data: Any, outcome: str, satisfaction: float = None):
        self.type = experience_type
        self.data = data
        self.outcome = outcome
        self.satisfaction = satisfaction  # 1-10 scale
        self.timestamp = datetime.now()
    
    def __str__(self):
        return f"Memory: {self.type} -> {self.outcome} (satisfaction: {self.satisfaction})"


class BasicAgent:
    """
    Basic Agent Structure - The foundation of agentic AI
    
    Just like how you approach planning a 14-day trip, this agent has:
    - Goals it wants to achieve
    - Memory of past experiences
    - Tools it can use
    - The ability to plan and execute actions
    """
    
    def __init__(self, name: str):
        self.name = name
        self.goals: List[Goal] = []
        self.memory: List[MemoryEntry] = []
        self.tools: Dict[str, callable] = {}
        self.active = True
        
    def add_goal(self, goal_type: str, parameters: Dict[str, Any], priority: int = 1) -> Goal:
        """Add a new goal for the agent to work towards"""
        goal = Goal(goal_type, parameters, priority)
        self.goals.append(goal)
        print(f"🎯 {self.name} added goal: {goal}")
        return goal
    
    def add_tool(self, tool_name: str, tool_function: callable):
        """Register a tool that the agent can use"""
        self.tools[tool_name] = tool_function
        print(f"🔧 {self.name} learned to use: {tool_name}")
    
    def plan_next_action(self) -> Optional[Action]:
        """
        Plan the next action based on current goals
        This is like deciding what to do next when planning your trip
        """
        # Find highest priority incomplete goal
        incomplete_goals = [g for g in self.goals if not g.completed]
        if not incomplete_goals:
            return None
            
        # Sort by priority (higher number = higher priority)
        next_goal = max(incomplete_goals, key=lambda g: g.priority)
        
        # Simple action planning based on goal type
        return self._create_action_for_goal(next_goal)
    
    def _create_action_for_goal(self, goal: Goal) -> Action:
        """Create an appropriate action for a given goal"""
        # Simple rule-based action planning
        action_map = {
            'research_destination': Action('search_info', {'query': goal.parameters.get('destination')}, 'web_search'),
            'plan_budget': Action('calculate_budget', goal.parameters, 'budget_calculator'),
            'book_flight': Action('search_flights', goal.parameters, 'flight_api'),
            'find_accommodation': Action('search_hotels', goal.parameters, 'hotel_api')
        }
        
        return action_map.get(goal.type, Action('research', goal.parameters, 'web_search'))
    
    def execute_action(self, action: Action) -> str:
        """
        Execute an action using available tools
        Like actually making a booking or doing research
        """
        if not action.tool_needed:
            return f"No tool needed for {action.type}"
            
        if action.tool_needed not in self.tools:
            return f"❌ Tool '{action.tool_needed}' not available"
        
        try:
            # Execute the action using the appropriate tool
            result = self.tools[action.tool_needed](action.parameters)
            
            # Remember this experience
            self.remember('action_execution', {
                'action': action.type,
                'parameters': action.parameters,
                'tool_used': action.tool_needed
            }, f"Success: {result}", satisfaction=8.0)
            
            return f"✅ {action.type}: {result}"
            
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            self.remember('action_execution', {
                'action': action.type,
                'parameters': action.parameters,
                'tool_used': action.tool_needed
            }, error_msg, satisfaction=2.0)
            
            return f"❌ {action.type}: {error_msg}"
    
    def remember(self, experience_type: str, data: Any, outcome: str, satisfaction: float = None):
        """Store an experience in memory for future reference"""
        memory = MemoryEntry(experience_type, data, outcome, satisfaction)
        self.memory.append(memory)
        print(f"🧠 {self.name} remembered: {experience_type} -> {outcome}")
    
    def get_relevant_memories(self, context: str, limit: int = 5) -> List[MemoryEntry]:
        """Retrieve memories relevant to current context"""
        # Simple keyword-based memory retrieval
        relevant_memories = []
        for memory in self.memory:
            if (context.lower() in str(memory.data).lower() or 
                context.lower() in memory.outcome.lower()):
                relevant_memories.append(memory)
        
        # Return most recent memories first, limited by count
        return sorted(relevant_memories, key=lambda m: m.timestamp, reverse=True)[:limit]
    
    def run_planning_cycle(self) -> str:
        """
        Execute one complete planning cycle: plan -> execute -> learn
        This is like making one decision in your trip planning process
        """
        if not self.active:
            return "Agent is not active"
            
        # Plan next action
        next_action = self.plan_next_action()
        if not next_action:
            return "🎉 All goals completed! Agent has finished its work."
        
        print(f"🤔 {self.name} planning: {next_action}")
        
        # Execute the action
        result = self.execute_action(next_action)
        
        # Check if this completed any goals
        self._check_goal_completion()
        
        return result
    
    def _check_goal_completion(self):
        """Check if any goals have been completed and mark them as such"""
        for goal in self.goals:
            if not goal.completed:
                # Simple completion check - in real implementation, this would be more sophisticated
                relevant_memories = self.get_relevant_memories(goal.type)
                if any(memory.satisfaction and memory.satisfaction > 7 for memory in relevant_memories):
                    goal.complete()
                    print(f"🎉 Goal completed: {goal}")
    
    def get_status(self) -> str:
        """Get current status of the agent"""
        total_goals = len(self.goals)
        completed_goals = len([g for g in self.goals if g.completed])
        
        status = f"""
📊 AGENT STATUS: {self.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Goals: {completed_goals}/{total_goals} completed
🧠 Memories: {len(self.memory)} experiences stored
🔧 Tools: {len(self.tools)} available

CURRENT GOALS:
"""
        for goal in self.goals:
            status += f"   {goal}\n"
            
        if self.memory:
            status += f"\nRECENT MEMORIES:\n"
            for memory in self.memory[-3:]:  # Show last 3 memories
                status += f"   {memory}\n"
        
        return status


# Example usage and demonstration
if __name__ == "__main__":
    print("🚀 Creating a Basic Trip Planning Agent\n")
    
    # Create an agent
    trip_agent = BasicAgent("TravelBuddy")
    
    # Add some goals (like planning a trip)
    trip_agent.add_goal("research_destination", {"destination": "Rome", "duration": 14}, priority=3)
    trip_agent.add_goal("plan_budget", {"total_budget": 3000, "duration": 14}, priority=2)
    trip_agent.add_goal("book_flight", {"destination": "Rome", "dates": "June 15-29"}, priority=1)
    
    # Add some simple tools
    def simple_search(params):
        query = params.get('query', 'general search')
        return f"Found information about {query}: Great destination with rich history!"
    
    def budget_calculator(params):
        budget = params.get('total_budget', 0)
        duration = params.get('duration', 1)
        daily_budget = budget / duration
        return f"Daily budget: ${daily_budget:.2f}"
    
    def flight_search(params):
        destination = params.get('destination', 'unknown')
        return f"Found flights to {destination} starting from $800"
    
    trip_agent.add_tool("web_search", simple_search)
    trip_agent.add_tool("budget_calculator", budget_calculator)
    trip_agent.add_tool("flight_api", flight_search)
    
    # Run a few planning cycles
    print("\n🎬 Starting Agent Planning Cycles...\n")
    
    for cycle in range(5):
        print(f"--- Planning Cycle {cycle + 1} ---")
        result = trip_agent.run_planning_cycle()
        print(f"Result: {result}\n")
        
        if "All goals completed" in result:
            break
    
    # Show final status
    print(trip_agent.get_status())
