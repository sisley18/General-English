const dataPart3 = {
    units: [
        {
            id: 1,
            level: 'A2',
            title: "Describing People",
            topic: "Physical appearance and personality",
            vocabulary: [
                { word: "Tall", ipa: "tɔːl", def: "Of great or more than average height" },
                { word: "Friendly", ipa: "ˈfrendli", def: "Kind and pleasant" },
                { word: "Shy", ipa: "ʃaɪ", def: "Nervous or timid in the company of other people" },
                { word: "Hair", ipa: "heər", def: "The fine threadlike strands growing from the skin" }
            ],
            grammar: {
                title: "Comparative Adjectives",
                explanation: "Add -er to short adjectives, or use 'more' with long adjectives to compare two things.",
                example: "She is taller than him. He is more friendly than his brother.",
                quizzes: [
                    { question: "My car is _____ than yours.", options: ["fast", "faster", "more fast"], correct: 1 },
                    { question: "This book is _____ than that one.", options: ["interesting", "more interesting", "interestinger"], correct: 1 }
                ]
            },
            listening: {
                title: "My Best Friend",
                transcript: "My best friend is Sarah. She is taller than me and has long dark hair. She is very friendly and funny.",
                questions: [
                    { q: "Who is taller?", options: ["Sarah", "The speaker"], correct: 0 },
                    { q: "What is Sarah's personality?", options: ["Shy and quiet", "Friendly and funny"], correct: 1 }
                ]
            },
            writing: "Describe your best friend. What do they look like? What is their personality like?",
            speaking: "Compare yourself with a family member."
        },
        {
            id: 2,
            level: 'A2',
            title: "Travel and Transport",
            topic: "Going on holiday, transportation",
            vocabulary: [
                { word: "Airport", ipa: "ˈeəpɔːt", def: "A complex of runways and buildings for the take-off, landing, and maintenance of civil aircraft" },
                { word: "Ticket", ipa: "ˈtɪkɪt", def: "A piece of paper or card that gives the holder a certain right" },
                { word: "Luggage", ipa: "ˈlʌɡɪdʒ", def: "Suitcases or other bags in which to pack personal belongings for traveling" }
            ],
            grammar: {
                title: "Superlative Adjectives",
                explanation: "Use 'the' + -est for short adjectives, or 'the most' for long adjectives to compare three or more things.",
                example: "It was the best holiday. This is the most expensive hotel.",
                quizzes: [
                    { question: "Mount Everest is the _____ mountain in the world.", options: ["high", "higher", "highest"], correct: 2 },
                    { question: "That was the _____ movie I have ever seen.", options: ["bad", "worse", "worst"], correct: 2 }
                ]
            },
            writing: "Write about the best holiday you have ever had.",
            speaking: "Discuss the pros and cons of traveling by plane vs by train."
        },
        {
            id: 3,
            level: 'A2',
            title: "Work and Professions",
            topic: "Jobs, workplaces, and duties",
            vocabulary: [
                { word: "Manager", ipa: "ˈmænɪdʒər", def: "A person responsible for controlling or administering an organization or group of staff" },
                { word: "Office", ipa: "ˈɒfɪs", def: "A room, set of rooms, or building used as a place for commercial, professional, or bureaucratic work" },
                { word: "Salary", ipa: "ˈsæləri", def: "A fixed regular payment, typically paid on a monthly or biweekly basis" }
            ],
            grammar: {
                title: "Have to / Don't have to",
                explanation: "Use 'have to' for obligation. Use 'don't have to' for lack of obligation (it's not necessary).",
                example: "I have to wear a uniform at work. You don't have to work on Sundays.",
                quizzes: [
                    { question: "She _____ wake up early tomorrow because it's Saturday.", options: ["has to", "doesn't have to", "have to"], correct: 1 },
                    { question: "We _____ wear a hard hat on the construction site.", options: ["have to", "has to", "don't have to"], correct: 0 }
                ]
            },
            writing: "Describe your dream job. What do you have to do? What don't you have to do?",
            speaking: "Interview your partner about their current job or studies."
        }
    ]
};
