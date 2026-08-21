"""
Budget Planner Agent - Smart Financial Planning for Travel

This agent demonstrates intelligent budget allocation and expense tracking,
just like how you would carefully plan and monitor expenses for a 14-day trip.
"""

from datetime import datetime
from typing import Dict, List, Any, Tuple
import json


class BudgetPlannerAgent:
    """
    An intelligent budget planning agent that helps optimize travel spending.
    
    Like a financial advisor for your trip, this agent can:
    - Analyze budget distribution across categories
    - Provide smart allocation recommendations
    - Track expenses in real-time
    - Adjust recommendations based on spending patterns
    - Alert about budget overruns
    """
    
    def __init__(self, total_budget: float, trip_duration: int = 14):
        self.name = "BudgetWise"
        self.total_budget = total_budget
        self.trip_duration = trip_duration
        self.daily_budget = total_budget / trip_duration
        
        # Budget categories and default allocations
        self.categories = {
            'accommodation': {'default_pct': 0.35, 'allocated': 0, 'spent': 0, 'priority': 'high'},
            'food': {'default_pct': 0.25, 'allocated': 0, 'spent': 0, 'priority': 'high'},
            'activities': {'default_pct': 0.20, 'allocated': 0, 'spent': 0, 'priority': 'medium'},
            'transport': {'default_pct': 0.15, 'allocated': 0, 'spent': 0, 'priority': 'high'},
            'shopping': {'default_pct': 0.05, 'allocated': 0, 'spent': 0, 'priority': 'low'}
        }
        
        # Expense tracking
        self.expenses = []
        self.recommendations = []
        self.alerts = []
        
        # Initialize with default allocation
        self._calculate_initial_allocation()
    
    def _calculate_initial_allocation(self):
        """Calculate initial budget allocation based on default percentages"""
        for category in self.categories:
            default_pct = self.categories[category]['default_pct']
            self.categories[category]['allocated'] = self.total_budget * default_pct
        
        print(f"💰 Budget initialized: ${self.total_budget:.2f} for {self.trip_duration} days")
        print(f"📊 Daily budget: ${self.daily_budget:.2f}")
    
    def analyze_budget_distribution(self, priorities: List[str] = None) -> Dict[str, float]:
        """
        Analyze and optimize budget distribution based on priorities.
        Like how you would adjust your budget based on what matters most to you.
        """
        print(f"🎯 Analyzing budget distribution with priorities: {priorities or 'default'}")
        
        if not priorities:
            return {cat: data['allocated'] for cat, data in self.categories.items()}
        
        # Adjust allocations based on priorities
        adjustments = self._calculate_priority_adjustments(priorities)
        
        # Apply adjustments while maintaining total budget
        adjusted_allocations = {}
        total_adjustment = 0
        
        for category, data in self.categories.items():
            base_allocation = data['allocated']
            adjustment = adjustments.get(category, 0)
            adjusted_allocations[category] = base_allocation + adjustment
            total_adjustment += adjustment
        
        # Ensure total equals original budget (handle rounding)
        if abs(total_adjustment) > 0.01:
            # Adjust the largest category to balance
            largest_cat = max(adjusted_allocations, key=adjusted_allocations.get)
            adjusted_allocations[largest_cat] -= total_adjustment
        
        # Update internal allocations
        for category in self.categories:
            self.categories[category]['allocated'] = adjusted_allocations[category]
        
        return adjusted_allocations
    
    def _calculate_priority_adjustments(self, priorities: List[str]) -> Dict[str, float]:
        """Calculate how to adjust budget based on user priorities"""
        adjustments = {cat: 0 for cat in self.categories}
        adjustment_amount = self.total_budget * 0.05  # 5% of total budget to redistribute
        
        priority_mappings = {
            'luxury_accommodation': ('accommodation', 0.15),
            'food_experience': ('food', 0.12),
            'activity_focused': ('activities', 0.15),
            'shopping_trip': ('shopping', 0.08),
            'budget_conscious': ('food', -0.08),  # Reduce food budget
            'backpacker_style': ('accommodation', -0.15),  # Reduce accommodation
            'cultural_immersion': ('activities', 0.10),
            'adventure_travel': ('activities', 0.12),
            'romantic_getaway': ('food', 0.08),
        }
        
        for priority in priorities:
            if priority in priority_mappings:
                category, adjustment_pct = priority_mappings[priority]
                adjustments[category] += self.total_budget * adjustment_pct
        
        # Balance adjustments (money has to come from somewhere)
        total_positive = sum(adj for adj in adjustments.values() if adj > 0)
        if total_positive > 0:
            # Reduce other categories proportionally
            for category in adjustments:
                if adjustments[category] <= 0:  # Don't further reduce already reduced categories
                    reduction = (total_positive / len([c for c in adjustments if adjustments[c] <= 0]))
                    adjustments[category] -= reduction
        
        return adjustments
    
    def get_smart_recommendations(self) -> List[str]:
        """Generate smart budget recommendations based on budget size and duration"""
        recommendations = []
        
        # Daily budget analysis
        if self.daily_budget < 50:
            recommendations.extend([
                "💡 Consider staying in hostels or budget hotels to maximize your experiences",
                "🥪 Mix of street food, groceries, and occasional restaurant meals",
                "🚶 Walk more and use public transport - great way to see the city!",
                "🎫 Look for free walking tours and museum free days",
                "📱 Use budget travel apps like Rome2Rio for transport planning"
            ])
        elif self.daily_budget > 200:
            recommendations.extend([
                "✨ You have room for luxury experiences and premium accommodations",
                "🍷 Consider fine dining experiences and wine tastings",
                "🚗 Private transport or taxis for convenience",
                "🎭 Premium activities like private tours or shows",
                "🏨 Boutique hotels or luxury accommodations"
            ])
        else:
            recommendations.extend([
                "👍 Great balance possible between comfort and experiences",
                "🏨 Mix of mid-range hotels and nice restaurants",
                "🎯 Focus budget on your top 2-3 priorities",
                "🚇 Efficient use of public transport with occasional taxis",
                "🍽️ Mix of local restaurants and special dining experiences"
            ])
        
        # Category-specific recommendations
        accommodation_pct = (self.categories['accommodation']['allocated'] / self.total_budget) * 100
        food_pct = (self.categories['food']['allocated'] / self.total_budget) * 100
        
        if accommodation_pct > 40:
            recommendations.append(f"🏨 You're allocating {accommodation_pct:.1f}% to accommodation - consider if location/luxury is worth it")
        
        if food_pct > 30:
            recommendations.append(f"🍽️ High food budget ({food_pct:.1f}%) - perfect for culinary adventures!")
        
        self.recommendations = recommendations
        return recommendations
    
    def track_expense(self, category: str, amount: float, description: str, date: str = None) -> str:
        """Track an expense and provide budget feedback"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        if category not in self.categories:
            return f"❌ Unknown category: {category}. Use: {', '.join(self.categories.keys())}"
        
        # Record the expense
        expense = {
            'id': len(self.expenses) + 1,
            'category': category,
            'amount': amount,
            'description': description,
            'date': date,
            'timestamp': datetime.now()
        }
        self.expenses.append(expense)
        
        # Update spent amount
        self.categories[category]['spent'] += amount
        
        # Calculate remaining budget in category
        allocated = self.categories[category]['allocated']
        spent = self.categories[category]['spent']
        remaining = allocated - spent
        
        # Generate feedback
        feedback_msg = f"💸 Expense logged: ${amount:.2f} for {description}"
        
        if remaining < 0:
            overspend = abs(remaining)
            alert_msg = f"⚠️ Over budget in {category}! Overspent by ${overspend:.2f}"
            self.alerts.append({
                'type': 'over_budget',
                'category': category,
                'amount': overspend,
                'message': alert_msg,
                'timestamp': datetime.now()
            })
            feedback_msg += f"\n{alert_msg}"
            
            # Suggest reallocation
            suggestions = self._suggest_budget_reallocation(category, overspend)
            if suggestions:
                feedback_msg += f"\n💡 Suggestions: {suggestions}"
                
        else:
            remaining_pct = (remaining / allocated) * 100 if allocated > 0 else 0
            feedback_msg += f"\n✅ Remaining in {category}: ${remaining:.2f} ({remaining_pct:.1f}%)"
            
            if remaining_pct < 20:
                feedback_msg += f"\n⚠️ Running low on {category} budget!"
        
        return feedback_msg
    
    def _suggest_budget_reallocation(self, overspent_category: str, overspend_amount: float) -> str:
        """Suggest how to reallocate budget when overspending occurs"""
        suggestions = []
        
        # Find categories with remaining budget
        available_categories = []
        for cat, data in self.categories.items():
            if cat != overspent_category:
                remaining = data['allocated'] - data['spent']
                if remaining > 0:
                    available_categories.append((cat, remaining, data['priority']))
        
        # Sort by priority (low priority categories first for reallocation)
        priority_order = {'low': 0, 'medium': 1, 'high': 2}
        available_categories.sort(key=lambda x: priority_order.get(x[2], 1))
        
        remaining_to_cover = overspend_amount
        
        for cat, available, priority in available_categories:
            if remaining_to_cover <= 0:
                break
                
            can_reallocate = min(available * 0.5, remaining_to_cover)  # Don't take more than 50%
            if can_reallocate >= 10:  # Only suggest if meaningful amount
                suggestions.append(f"Consider reducing {cat} budget by ${can_reallocate:.0f}")
                remaining_to_cover -= can_reallocate
        
        return "; ".join(suggestions) if suggestions else "Consider increasing total budget"
    
    def get_spending_analysis(self) -> Dict[str, Any]:
        """Get comprehensive spending analysis"""
        total_spent = sum(expense['amount'] for expense in self.expenses)
        remaining_budget = self.total_budget - total_spent
        days_remaining = max(1, self.trip_duration - len(set(exp['date'] for exp in self.expenses)))
        
        # Category analysis
        category_analysis = {}
        for category, data in self.categories.items():
            allocated = data['allocated']
            spent = data['spent']
            remaining = allocated - spent
            spent_pct = (spent / allocated * 100) if allocated > 0 else 0
            
            category_analysis[category] = {
                'allocated': allocated,
                'spent': spent,
                'remaining': remaining,
                'spent_percentage': spent_pct,
                'status': 'over_budget' if remaining < 0 else 'on_track' if spent_pct < 80 else 'almost_spent'
            }
        
        # Spending trends
        daily_spending = {}
        for expense in self.expenses:
            date = expense['date']
            if date not in daily_spending:
                daily_spending[date] = 0
            daily_spending[date] += expense['amount']
        
        avg_daily_spending = total_spent / len(daily_spending) if daily_spending else 0
        
        return {
            'total_budget': self.total_budget,
            'total_spent': total_spent,
            'remaining_budget': remaining_budget,
            'days_remaining': days_remaining,
            'daily_budget_target': self.daily_budget,
            'avg_daily_spending': avg_daily_spending,
            'spending_pace': 'ahead' if avg_daily_spending > self.daily_budget else 'behind',
            'category_breakdown': category_analysis,
            'daily_spending': daily_spending,
            'alerts_count': len(self.alerts)
        }
    
    def generate_budget_report(self) -> str:
        """Generate a comprehensive budget report"""
        analysis = self.get_spending_analysis()
        
        report = f"""
💰 COMPREHENSIVE BUDGET REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 BUDGET OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Total Budget: ${analysis['total_budget']:.2f}
💸 Total Spent: ${analysis['total_spent']:.2f}
💰 Remaining: ${analysis['remaining_budget']:.2f}

🎯 Daily Targets vs Actual:
   Target: ${analysis['daily_budget_target']:.2f}/day
   Actual: ${analysis['avg_daily_spending']:.2f}/day
   Pace: {'🔥 Spending ahead of target' if analysis['spending_pace'] == 'ahead' else '✅ Spending below target'}

📈 CATEGORY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        for category, data in analysis['category_breakdown'].items():
            status_emoji = {
                'over_budget': '🚨',
                'almost_spent': '⚠️',
                'on_track': '✅'
            }
            
            emoji = status_emoji.get(data['status'], '➖')
            report += f"   {emoji} {category.title()}\n"
            report += f"      Allocated: ${data['allocated']:.2f}\n"
            report += f"      Spent: ${data['spent']:.2f} ({data['spent_percentage']:.1f}%)\n"
            report += f"      Remaining: ${data['remaining']:.2f}\n\n"
        
        # Add recommendations
        if self.recommendations:
            report += "💡 SMART RECOMMENDATIONS\n"
            report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            for rec in self.recommendations:
                report += f"   {rec}\n"
        
        # Add recent alerts
        if self.alerts:
            report += "\n🚨 RECENT ALERTS\n"
            report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            for alert in self.alerts[-3:]:  # Show last 3 alerts
                report += f"   {alert['message']}\n"
        
        report += f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        report += f"📅 Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        
        return report
    
    def predict_budget_outcome(self) -> Dict[str, Any]:
        """Predict budget outcome based on current spending patterns"""
        analysis = self.get_spending_analysis()
        
        if not analysis['daily_spending']:
            return {"prediction": "No spending data available for prediction"}
        
        # Calculate projected spending
        avg_daily = analysis['avg_daily_spending']
        days_remaining = analysis['days_remaining']
        projected_additional_spending = avg_daily * days_remaining
        projected_total_spending = analysis['total_spent'] + projected_additional_spending
        
        # Determine outcome
        if projected_total_spending <= self.total_budget * 0.95:  # Within 5%
            outcome = "on_track"
            message = "You're on track to stay within budget! 🎯"
        elif projected_total_spending <= self.total_budget * 1.1:  # Within 10% over
            outcome = "slight_overspend"
            message = "You might slightly exceed budget, but manageable. ⚠️"
        else:
            outcome = "significant_overspend"
            message = "Significant budget overspend predicted. Consider adjustments! 🚨"
        
        return {
            'outcome': outcome,
            'message': message,
            'projected_total': projected_total_spending,
            'projected_overspend': max(0, projected_total_spending - self.total_budget),
            'daily_adjustment_needed': max(0, (projected_total_spending - self.total_budget) / days_remaining) if days_remaining > 0 else 0,
            'confidence': min(100, len(analysis['daily_spending']) * 10)  # More data = more confidence
        }


# Example usage and demonstration
if __name__ == "__main__":
    print("🚀 Budget Planner Agent Demonstration\n")
    
    # Create budget planner for 14-day trip with $3000
    budget_agent = BudgetPlannerAgent(3000, 14)
    
    print("💰 INITIAL BUDGET ANALYSIS")
    print("=" * 50)
    
    # Analyze budget distribution with priorities
    allocations = budget_agent.analyze_budget_distribution(['food_experience', 'cultural_immersion'])
    
    print("\n📊 Budget Allocation:")
    for category, amount in allocations.items():
        percentage = (amount / 3000) * 100
        print(f"   {category.title()}: ${amount:.2f} ({percentage:.1f}%)")
    
    # Get smart recommendations
    print("\n💡 Smart Recommendations:")
    recommendations = budget_agent.get_smart_recommendations()
    for rec in recommendations:
        print(f"   {rec}")
    
    print("\n" + "=" * 50)
    print("💸 SIMULATING EXPENSES...")
    print("=" * 50)
    
    # Simulate some expenses
    expenses_to_track = [
        ('accommodation', 120, 'Hotel Rome - Night 1', '2024-06-15'),
        ('food', 45, 'Dinner at Trastevere', '2024-06-15'),
        ('transport', 25, 'Airport to city center', '2024-06-15'),
        ('activities', 85, 'Colosseum and Forum tour', '2024-06-16'),
        ('food', 65, 'Lunch + Dinner + Breakfast', '2024-06-16'),
        ('accommodation', 120, 'Hotel Rome - Night 2', '2024-06-16'),
        ('shopping', 150, 'Souvenirs and local crafts', '2024-06-17'),  # This will cause overspend
        ('activities', 95, 'Vatican Museums tour', '2024-06-17')
    ]
    
    for category, amount, description, date in expenses_to_track:
        result = budget_agent.track_expense(category, amount, description, date)
        print(f"\n{result}")
    
    print("\n" + "=" * 70)
    print("📊 COMPREHENSIVE BUDGET ANALYSIS")
    print("=" * 70)
    
    # Generate full report
    report = budget_agent.generate_budget_report()
    print(report)
    
    print("\n" + "=" * 70)
    print("🔮 BUDGET PREDICTION")
    print("=" * 70)
    
    # Get budget prediction
    prediction = budget_agent.predict_budget_outcome()
    print(f"📈 Outcome Prediction: {prediction['message']}")
    print(f"💰 Projected Total Spending: ${prediction['projected_total']:.2f}")
    if prediction['projected_overspend'] > 0:
        print(f"🚨 Projected Overspend: ${prediction['projected_overspend']:.2f}")
        print(f"💡 Daily Reduction Needed: ${prediction['daily_adjustment_needed']:.2f}")
    print(f"🎯 Prediction Confidence: {prediction['confidence']:.0f}%")
