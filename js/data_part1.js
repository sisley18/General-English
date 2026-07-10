const dataPart1 = {
    units: [
        {
            id: 1,
            level: 'A1',
            title: "Hello! Nice to Meet You",
            topic: "Greetings & Introductions",
            vocabulary: [
                { word: "Hello", ipa: "həˈləʊ", def: "Used as a greeting" },
                { word: "Goodbye", ipa: "ɡʊdˈbaɪ", def: "Used when parting or at the end of a conversation" },
                { word: "Name", ipa: "neɪm", def: "A word by which a person is known" },
                { word: "Country", ipa: "ˈkʌntri", def: "A nation with its own government" },
                { word: "Age", ipa: "eɪdʒ", def: "How old someone or something is" },
                { word: "Teacher", ipa: "ˈtiːtʃər", def: "A person who teaches in a school" },
                { word: "Student", ipa: "ˈstjuːdənt", def: "A person who is studying at a school or college" },
                { word: "Friend", ipa: "frend", def: "A person with whom one has a bond of mutual affection" },
                { word: "Nice", ipa: "naɪs", def: "Pleasant; agreeable; satisfactory" },
                { word: "Please", ipa: "pliːz", def: "Used to ask for something politely" }
            ],
            listening: {
                title: "Meeting at School",
                transcript: "Hello! My name is Ana. What is your name? Nice to meet you, Ana. I am David. Where are you from? I am from Spain. And you? I am from the USA. Are you a student? Yes, I am. I am 20 years old.",
                questions: [
                    { q: "What is her name?", options: ["Maria", "Ana", "Sarah"], correct: 1 },
                    { q: "Where is David from?", options: ["Spain", "The USA", "UK"], correct: 1 },
                    { q: "Is David a student?", options: ["Yes", "No", "We don't know"], correct: 0 }
                ]
            },
            reading: {
                title: "About Me",
                text: "My name is John. I am 25 years old. I am a student. I am from London. London is a big city in the UK.",
                questions: [
                    { q: "How old is John?", options: ["20", "25", "30"], correct: 1 },
                    { q: "Where is John from?", options: ["London", "New York", "Paris"], correct: 0 }
                ]
            },
            grammar: {
                title: "Verb 'to be'",
                explanation: "Use am/is/are to talk about names, ages, and countries.",
                example: "I am a student. She is a teacher.",
                quizzes: [
                    { question: "I _____ a student.", options: ["am", "is", "are"], correct: 0 },
                    { question: "She _____ from Italy.", options: ["am", "is", "are"], correct: 1 },
                    { question: "They _____ my friends.", options: ["am", "is", "are"], correct: 2 }
                ]
            },
            verb_patterns: {
                exercises: [
                    { sentence: "I want _____ English.", options: ["to learn", "learning", "learn"], correct: 0 },
                    { sentence: "She likes _____ music.", options: ["listening", "to listen", "listen"], correct: 0 }
                ]
            },
            pronunciation: {
                word_stress: [
                    { word: "TEA-cher", syllables: ["TEA", "cher"], correct: 0 },
                    { word: "stu-DENT", syllables: ["stu", "DENT"], correct: 1 }
                ],
                sentence_stress: [
                    { sentence: "My name is Ana.", stressed: ["name", "Ana"] },
                    { sentence: "I am from Spain.", stressed: ["Spain"] }
                ]
            },
            collocations: [
                { pair: ["Nice", "to meet you"], context: "_____ to meet you.", distractors: ["Good", "Happy"] },
                { pair: ["Where", "are you from?"], context: "_____ are you from?", distractors: ["What", "How"] }
            ],
            writing: "Write a short paragraph introducing yourself (name, age, country, job).",
            speaking: "Introduce yourself to your partner.",
            videos: [
                { title: "Greetings and Introductions", channel: "English Class 101", duration: "5:00", url: "https://youtube.com/watch?v=hello" }
            ]
        },
        {
            id: 2,
            level: 'A1',
            title: "My Family & Friends",
            topic: "Family, relationships, descriptions",
            vocabulary: [
                { word: "Mother", ipa: "ˈmʌðər", def: "A female parent" }
            ],
            grammar: {
                title: "Possessive Adjectives",
                explanation: "Use my, your, his, her, its, our, their.",
                example: "This is my mother. Her name is Mary.",
                quizzes: [
                    { question: "This is _____ book (I).", options: ["my", "your", "his"], correct: 0 }
                ]
            }
        }
    ]
};
