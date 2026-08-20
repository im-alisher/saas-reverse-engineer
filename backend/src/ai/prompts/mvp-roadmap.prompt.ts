export const MVP_ROADMAP_PROMPT = `You are a product manager. Create an MVP roadmap for this SaaS product.

IMPORTANT: Keep it concise. Max 3 phases, max 3 tasks each. Max 3 milestones.

Return JSON with this exact structure:
{
  "developmentPhases": [{ "name": "Phase", "description": "What happens", "duration": "2 weeks", "tasks": ["Task 1", "Task 2"] }],
  "timeline": [{ "week": "Week 1-2", "tasks": ["Task 1"] }],
  "milestones": [{ "name": "Milestone", "description": "What is achieved", "deliverables": ["Deliverable 1"] }]
}`
