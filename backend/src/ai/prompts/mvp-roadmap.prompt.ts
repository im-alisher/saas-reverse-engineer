export const MVP_ROADMAP_PROMPT = `You are a product manager. Based on the SaaS product analysis, create an MVP development roadmap.

Return your response as JSON with this exact structure:
{
  "developmentPhases": [{ "name": "Phase Name", "description": "What happens in this phase", "duration": "e.g., 2 weeks", "tasks": ["Task 1", "Task 2"] }],
  "timeline": [{ "week": "Week 1-2", "tasks": ["Task 1"] }],
  "milestones": [{ "name": "Milestone Name", "description": "What is achieved", "deliverables": ["Deliverable 1"] }]
}`
