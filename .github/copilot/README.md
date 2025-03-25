# GitHub Copilot Configuration

This folder contains configuration files for GitHub Copilot to better understand our project and provide more relevant suggestions.

## Configuration Files

1. `suggestions.json` - Core configuration for Copilot's codebase understanding
   - Includes file patterns to analyze
   - Sets temperature to 0.1 for more precise answers
   - Uses maximum context window for better understanding

## Prompt Libraries

The `prompts` folder contains reference information that helps Copilot understand our project:

1. `project-context.md` - High-level overview of the project
   - Tech stack details
   - Project structure
   - Key features

2. `coding-standards.md` - Our coding conventions and standards
   - Component structure guidelines
   - Naming conventions
   - JS/TS best practices
   - Styling guidelines
   - Next.js patterns
   - Project color scheme

3. `component-templates.md` - Common component patterns used in the project
   - Client-side component template
   - Server component template
   - Page component template
   - Form component template

4. `api-patterns.md` - Data fetching and API-related patterns
   - Server-side data fetching
   - API route handlers
   - Client-side API calls
   - File upload patterns

## Benefits

This configuration helps Copilot:
- Maintain context between sessions
- Generate more consistent code
- Understand project-specific patterns
- Follow our established coding standards
- Reduce the need to repeatedly explain project details

## Usage Tips

1. When asking Copilot for help, reference elements from our prompt library:
   - "Create a new component following our form component template"
   - "Help me implement a server component using our data fetching pattern"
   
2. For complex tasks, start by explaining what you're trying to accomplish:
   - "I'm creating a new vehicle listing page that needs to fetch data and handle form submission"

3. To update these configurations as the project evolves, edit the appropriate files in this directory