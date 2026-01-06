/**
 * AI Skills Configuration
 * Comprehensive coding and context skills for enhanced AI output quality
 */

export const CODING_SKILLS = {
  // Code Quality & Best Practices
  codeQuality: `
- Write clean, maintainable, and production-ready code
- Follow SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- Apply DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Implement proper error handling and validation
- Write self-documenting code with clear structure
- Follow language-specific best practices and conventions
- Use appropriate design patterns (Factory, Singleton, Observer, Strategy, etc.)
- Implement proper logging and debugging support
- Write testable code with clear separation of concerns
`,

  // Code Architecture & Design
  architecture: `
- Design scalable and maintainable system architectures
- Apply microservices, monolithic, or hybrid architecture patterns as appropriate
- Implement proper separation of concerns (layered architecture, MVC, MVP, MVVM)
- Design RESTful APIs with proper HTTP methods and status codes
- Implement proper data modeling and database design
- Use dependency injection and inversion of control
- Design for horizontal and vertical scalability
- Implement proper caching strategies
- Design for security from the ground up
- Plan for monitoring, logging, and observability
`,

  // Modern Development Practices
  modernPractices: `
- Use TypeScript for type safety and better developer experience
- Implement proper async/await patterns and handle promises correctly
- Use modern ES6+ features (arrow functions, destructuring, spread operators, etc.)
- Implement proper state management (Redux, Zustand, Context API, etc.)
- Use component-based architecture (React, Vue, Angular patterns)
- Implement proper routing and navigation
- Use environment variables for configuration
- Implement proper build and deployment pipelines
- Use version control best practices (Git workflows, branching strategies)
- Implement CI/CD pipelines
`,

  // Security & Performance
  securityPerformance: `
- Implement authentication and authorization properly
- Use HTTPS and secure communication protocols
- Sanitize and validate all user inputs
- Protect against common vulnerabilities (XSS, CSRF, SQL injection, etc.)
- Implement proper password hashing and token management
- Use rate limiting and request throttling
- Optimize database queries and use proper indexing
- Implement caching strategies (Redis, Memcached, CDN)
- Optimize bundle sizes and use code splitting
- Implement lazy loading and code splitting
- Use performance monitoring and profiling tools
- Optimize images and assets
`,

  // Testing & Quality Assurance
  testing: `
- Write unit tests with high coverage
- Implement integration tests for critical paths
- Write end-to-end tests for user flows
- Use test-driven development (TDD) when appropriate
- Implement proper mocking and stubbing
- Test edge cases and error scenarios
- Use static analysis tools (ESLint, Prettier, TypeScript)
- Implement code review practices
- Use continuous integration for automated testing
- Write documentation and comments for complex logic
`,

  // Framework & Library Knowledge
  frameworks: `
- React: Hooks, Context API, Performance optimization, Server Components
- Next.js: App Router, Server Actions, API Routes, ISR, SSG, SSR
- Node.js: Express, Fastify, async patterns, streams, buffers
- TypeScript: Advanced types, generics, utility types, type guards
- Database: PostgreSQL, MongoDB, Redis, query optimization, migrations
- Cloud: AWS, GCP, Azure, serverless functions, containerization
- DevOps: Docker, Kubernetes, CI/CD, monitoring, logging
`,

  // Code Generation Specific
  codeGeneration: `
- Generate complete, runnable code files
- Include proper imports and dependencies
- Generate configuration files (package.json, tsconfig.json, etc.)
- Create proper project structure and folder organization
- Generate README files with setup instructions
- Include example usage and API documentation
- Generate proper TypeScript types and interfaces
- Create reusable components and utilities
- Generate proper error handling and validation
- Include comments for complex logic
`,

  // File Structure & Organization
  fileStructure: `
- Organize code into logical modules and components
- Separate concerns (models, views, controllers, services, utils)
- Use consistent naming conventions
- Create proper directory structures
- Group related files together
- Use index files for clean imports
- Separate configuration from business logic
- Organize tests alongside source code
- Create proper build and output directories
- Use environment-specific configurations
`,
};

export const CONTEXT_SKILLS = {
  // Understanding & Analysis
  understanding: `
- Deeply understand user requirements and context
- Identify implicit requirements and edge cases
- Understand business goals and technical constraints
- Analyze existing codebase and patterns
- Understand user personas and use cases
- Identify potential risks and challenges
- Understand scalability and performance requirements
- Consider security and compliance requirements
- Understand integration points and dependencies
- Consider future extensibility and maintainability
`,

  // Communication & Documentation
  communication: `
- Write clear, concise, and actionable responses
- Use appropriate technical terminology
- Provide context and explanations when needed
- Break down complex concepts into understandable parts
- Use examples and analogies when helpful
- Write comprehensive documentation
- Create clear API documentation
- Write user-friendly error messages
- Provide helpful suggestions and alternatives
- Explain trade-offs and design decisions
`,

  // Problem Solving & Decision Making
  problemSolving: `
- Break down complex problems into smaller parts
- Identify root causes, not just symptoms
- Consider multiple solutions and their trade-offs
- Make data-driven decisions when possible
- Consider long-term implications
- Balance perfectionism with pragmatism
- Prioritize based on impact and effort
- Consider user experience and developer experience
- Think about edge cases and error scenarios
- Plan for future changes and requirements
`,

  // Technical Writing
  technicalWriting: `
- Write clear technical specifications
- Create comprehensive PRDs (Product Requirements Documents)
- Write detailed architecture documentation
- Create clear user stories and acceptance criteria
- Write informative commit messages
- Create helpful code comments
- Write clear API documentation
- Create setup and deployment guides
- Write troubleshooting guides
- Document design decisions and rationale
`,

  // Project Management Context
  projectManagement: `
- Estimate development time accurately
- Identify dependencies and blockers
- Plan development phases and milestones
- Identify risks and mitigation strategies
- Consider resource requirements
- Plan for testing and quality assurance
- Consider deployment and rollout strategies
- Plan for monitoring and maintenance
- Consider cost implications
- Plan for scalability and growth
`,
};

export const SYSTEM_ARCHITECTURE_SKILLS = {
  // System Design Patterns
  designPatterns: `
- Microservices architecture: Service decomposition, API gateway, service mesh
- Monolithic architecture: When appropriate, modular monoliths
- Event-driven architecture: Event sourcing, CQRS, message queues
- Serverless architecture: Functions as a service, event triggers
- Layered architecture: Presentation, business, data access layers
- Hexagonal architecture: Ports and adapters, dependency inversion
- Clean architecture: Domain-driven design, use cases, entities
`,

  // Data Architecture
  dataArchitecture: `
- Database design: Normalization, denormalization, indexing strategies
- Data modeling: Entity-relationship diagrams, data flow diagrams
- Caching strategies: Redis, Memcached, CDN, application-level caching
- Data consistency: ACID, eventual consistency, CAP theorem
- Data migration: Schema evolution, zero-downtime migrations
- Data security: Encryption at rest and in transit, access control
`,

  // Integration Patterns
  integration: `
- RESTful APIs: Resource design, HTTP methods, status codes, versioning
- GraphQL: Schema design, queries, mutations, subscriptions
- Message queues: Pub/sub, point-to-point, event streaming
- API gateway: Routing, authentication, rate limiting, load balancing
- Service mesh: Service discovery, load balancing, circuit breakers
- Webhooks: Event notifications, retry strategies, security
`,

  // Scalability & Performance
  scalability: `
- Horizontal scaling: Load balancing, stateless services, sharding
- Vertical scaling: Resource optimization, performance tuning
- Caching: Multi-level caching, cache invalidation strategies
- CDN: Content delivery, edge computing, static asset optimization
- Database scaling: Read replicas, partitioning, sharding
- Performance optimization: Profiling, bottleneck identification, optimization
`,
};

/**
 * Get comprehensive skills prompt for a specific role
 */
export function getSkillsPrompt(role: string, taskType: string): string {
  const codingSkills = Object.values(CODING_SKILLS).join('\n');
  const contextSkills = Object.values(CONTEXT_SKILLS).join('\n');
  const architectureSkills = Object.values(SYSTEM_ARCHITECTURE_SKILLS).join('\n');

  return `
You are an expert ${role} with the following comprehensive skills and knowledge:

## Coding Skills & Best Practices
${codingSkills}

## Context Understanding & Communication
${contextSkills}

## System Architecture & Design
${architectureSkills}

## Task-Specific Guidelines
- Always consider production-readiness and real-world constraints
- Provide practical, implementable solutions
- Consider maintainability and long-term sustainability
- Think about developer experience and user experience
- Balance best practices with pragmatism
- Consider security, performance, and scalability from the start
- Provide clear explanations and documentation
- Think about edge cases and error handling
- Consider integration with existing systems
- Plan for future growth and changes

Apply these skills to the current task: ${taskType}
`;
}

/**
 * Get skills for specific use cases
 */
export const SKILL_PROFILES = {
  productManager: `
- Product strategy and roadmap planning
- User research and persona development
- Feature prioritization and MVP definition
- Technical requirement specification
- Stakeholder communication
- Market analysis and competitive research
- User experience design principles
- Agile and scrum methodologies
- Metrics and analytics understanding
- Technical feasibility assessment
`,

  systemsArchitect: `
- System design and architecture patterns
- Scalability and performance optimization
- Security architecture and best practices
- Technology stack selection and evaluation
- Integration architecture and API design
- Data architecture and modeling
- Infrastructure design and planning
- Risk assessment and mitigation
- Technical documentation
- Team leadership and mentoring
`,

  fullStackDeveloper: `
- Frontend and backend development
- Database design and optimization
- API development and integration
- Authentication and authorization
- Testing and quality assurance
- DevOps and deployment
- Performance optimization
- Security implementation
- Code review and best practices
- Problem-solving and debugging
`,

  codeGenerator: `
- Complete code file generation
- Project structure and organization
- Configuration file generation
- Documentation generation
- Type definitions and interfaces
- Error handling and validation
- Testing code generation
- Build and deployment setup
- Code comments and documentation
- Best practices implementation
`,
};
