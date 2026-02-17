export const STEPS = [
    {
        id: 1,
        name: 'Problem',
        path: '/rb/01-problem',
        prompt: 'Create a problem statement and core value proposition for an AI Resume Builder. Focus on ATS compatibility and keyword optimization.',
        verification: [
            'Is the problem statement clearly defined (ATS rejection)?',
            'Is the target audience identified (Job seekers)?',
            'Is the core value proposition unique (AI keyword optimization)?',
            'Does it address the specific pain point of formatting?',
            'Is the solution feasible within the scope?'
        ],
        breakTests: [
            'What if the user is in a creative field (non-ATS)?',
            'Does it handle different language/region standards?',
            'Why wouldn\'t a user just use ChatGPT directly?'
        ]
    },
    {
        id: 2,
        name: 'Market',
        path: '/rb/02-market',
        prompt: 'Analyze the market for AI Resume Builders. Identify competitors, target audience, and key differentiators.',
        verification: [
            'Are at least 3 direct competitors analyzed?',
            'Is the Total Addressable Market (TAM) estimated?',
            'Are key differentiators clearly listed?',
            'Is the pricing model aligned with the target audience?'
        ],
        breakTests: [
            'What if a major competitor releases a free version?',
            'Is the niche too small?'
        ]
    },
    {
        id: 3,
        name: 'Architecture',
        path: '/rb/03-architecture',
        prompt: 'Design the system architecture. Define the frontend (React/Vite), backend (Node/Python), and AI integration points.',
        verification: [
            'Is the tech stack clearly defined (React, Node, etc.)?',
            'Are the AI integration points (OpenAI/Gemini) identified?',
            ' Is data flow between frontend and backend mapped?',
            'Are security considerations (PII) addressed?'
        ],
        breakTests: [
            'What happens if the AI API is down?',
            'How does it handle large concurrent users?'
        ]
    },
    {
        id: 4,
        name: 'HLD',
        path: '/rb/04-hld',
        prompt: 'Create a High Level Design (HLD) document. Show component interactions, data flow, and external services.',
        verification: [
            'Are all major system components represented?',
            'Are external system dependencies shown?',
            'Is the high-level data flow clear?',
            'Are storage solutions defined?'
        ],
        breakTests: [
            'Is the system scalable?',
            'Are there single points of failure?'
        ]
    },
    {
        id: 5,
        name: 'LLD',
        path: '/rb/05-lld',
        prompt: 'Create a Low Level Design (LLD). Define API endpoints, database schema, and class/component structures.',
        verification: [
            'Are API endpoints defined with methods and payloads?',
            'Is the database schema normalized?',
            'Are component prop types defined?',
            'Are error handling states mapped?'
        ],
        breakTests: [
            'Can the schema handle schema evolution?',
            'Are API rate limits considered?'
        ]
    },
    {
        id: 6,
        name: 'Build',
        path: '/rb/06-build',
        prompt: 'Implement the core features. Build the resume editor, AI generation logic, and export functionality.',
        verification: [
            'Does the application compile without errors?',
            'Can a user input resume data?',
            'Does the AI generation produce valid output?',
            'Is the export to PDF functional?'
        ],
        breakTests: [
            'What if the user inputs special characters?',
            'What if the network fails during generation?',
            'Does it work on mobile devices?'
        ]
    },
    {
        id: 7,
        name: 'Test',
        path: '/rb/07-test',
        prompt: 'Develop a testing strategy. Write unit tests for utilities and integration tests for the API.',
        verification: [
            'Are critical paths covered by unit tests?',
            'Do integration tests pass?',
            'Is test coverage above 70%?',
            'Are edge cases tested?'
        ],
        breakTests: [
            'Do mocks accurately reflect API behavior?',
            'Are race conditions tested?'
        ]
    },
    {
        id: 8,
        name: 'Ship',
        path: '/rb/08-ship',
        prompt: 'Prepare for deployment. validte environment variables, build scripts, and set up CI/CD pipeline.',
        verification: [
            'Does the production build succeed?',
            'Are environment variables securely managed?',
            'Is the deployment pipeline configured?',
            'Is the live URL accessible?'
        ],
        breakTests: [
            'What if the deployment fails halfway?',
            'Is rollback strategy defined?'
        ]
    },
];
