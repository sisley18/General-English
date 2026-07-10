const dataPart2 = {
    units: [
        {
            id: 3,
            level: 'A1',
            title: "Daily Routines",
            topic: "Everyday activities and time",
            vocabulary: [
                { word: "Wake up", ipa: "weɪk ʌp", def: "Stop sleeping" },
                { word: "Breakfast", ipa: "ˈbrekfəst", def: "The first meal of the day" },
                { word: "Work", ipa: "wɜːrk", def: "Activity involving mental or physical effort done to achieve a purpose or result" },
                { word: "Lunch", ipa: "lʌntʃ", def: "A meal eaten in the middle of the day" },
                { word: "Dinner", ipa: "ˈdɪnər", def: "The main meal of the day, taken either around midday or in the evening" }
            ],
            listening: {
                title: "My Morning",
                transcript: "I wake up at 7 AM. I have breakfast and then I go to work at 8:30 AM. I have lunch at 1 PM.",
                questions: [
                    { q: "What time does he wake up?", options: ["7 AM", "8 AM", "6 AM"], correct: 0 },
                    { q: "When does he go to work?", options: ["8:30 AM", "9:00 AM", "7:30 AM"], correct: 0 }
                ]
            },
            grammar: {
                title: "Present Simple",
                explanation: "Use the present simple for habits and routines. Add -s or -es for he/she/it.",
                example: "I wake up at 7 AM. She wakes up at 6 AM.",
                quizzes: [
                    { question: "He _____ breakfast at 8 AM.", options: ["have", "has", "having"], correct: 1 },
                    { question: "They _____ to school by bus.", options: ["go", "goes", "going"], correct: 0 }
                ]
            },
            pronunciation: {
                word_stress: [
                    { word: "BREAK-fast", syllables: ["BREAK", "fast"], correct: 0 },
                    { word: "DIN-ner", syllables: ["DIN", "ner"], correct: 0 }
                ]
            },
            writing: "Describe your daily morning routine. What time do you wake up? What do you eat for breakfast?",
            speaking: "Talk about your typical weekend routine.",
            videos: [
                { title: "Daily Routines in English", channel: "English Learning", duration: "4:15", url: "https://www.youtube.com/watch?v=qD1pnquN_RM" }
            ]
        },
        {
            id: 4,
            level: 'A1',
            title: "Food and Drink",
            topic: "Meals, ordering food, likes and dislikes",
            vocabulary: [
                { word: "Water", ipa: "ˈwɔːtər", def: "A colorless, transparent, odorless liquid" },
                { word: "Bread", ipa: "bred", def: "Food made of flour, water, and yeast or another leavening agent" },
                { word: "Apple", ipa: "ˈæpl", def: "A round fruit with red or green skin and a whitish interior" },
                { word: "Cheese", ipa: "tʃiːz", def: "A food made from the pressed curds of milk" },
                { word: "Restaurant", ipa: "ˈrestrɒnt", def: "A place where people pay to sit and eat meals" }
            ],
            grammar: {
                title: "Countable and Uncountable Nouns",
                explanation: "Use 'a/an' with singular countable nouns. Use 'some' with plural or uncountable nouns in positive sentences.",
                example: "I have an apple. I want some water.",
                quizzes: [
                    { question: "I would like _____ milk, please.", options: ["a", "an", "some"], correct: 2 },
                    { question: "She eats _____ orange every day.", options: ["a", "an", "some"], correct: 1 }
                ]
            },
            collocations: [
                { pair: ["Have", "breakfast"], context: "I usually _____ breakfast at 8 AM.", distractors: ["Do", "Make"] },
                { pair: ["Drink", "water"], context: "You should _____ water every day.", distractors: ["Eat", "Take"] }
            ],
            writing: "Write a short paragraph about your favorite food and what you usually eat for lunch.",
            speaking: "Roleplay: Ordering food in a restaurant."
        },
        {
            id: 5,
            level: 'A1',
            title: "Places in Town",
            topic: "City vocabulary, giving directions",
            vocabulary: [
                { word: "Hospital", ipa: "ˈhɒspɪtl", def: "An institution providing medical treatment" },
                { word: "Park", ipa: "pɑːrk", def: "A large public green area in a town" },
                { word: "Bank", ipa: "bæŋk", def: "A financial institution" },
                { word: "Supermarket", ipa: "ˈsuːpərmɑːrkɪt", def: "A large self-service grocery store" }
            ],
            grammar: {
                title: "There is / There are",
                explanation: "Use 'there is' for singular nouns and 'there are' for plural nouns to describe what exists in a place.",
                example: "There is a park near my house. There are two banks.",
                quizzes: [
                    { question: "_____ a hospital in the city center.", options: ["There is", "There are", "They are"], correct: 0 },
                    { question: "_____ many shops in this street.", options: ["There is", "There are", "There am"], correct: 1 }
                ]
            },
            writing: "Describe your neighborhood. What places are there near your house?",
            speaking: "Give directions from your house to the nearest supermarket."
        },
        {
            id: 6,
            level: 'A1',
            title: "Past Events",
            topic: "Talking about the past",
            vocabulary: [
                { word: "Yesterday", ipa: "ˈjestərdeɪ", def: "The day before today" },
                { word: "Last week", ipa: "lɑːst wiːk", def: "The week before the current one" },
                { word: "Tired", ipa: "ˈtaɪərd", def: "In need of sleep or rest" },
                { word: "Happy", ipa: "ˈhæpi", def: "Feeling or showing pleasure or contentment" }
            ],
            grammar: {
                title: "Past Simple: Verb 'to be'",
                explanation: "Use 'was' for I/he/she/it. Use 'were' for you/we/they.",
                example: "I was at home yesterday. They were happy.",
                quizzes: [
                    { question: "She _____ at the park yesterday.", options: ["was", "were", "is"], correct: 0 },
                    { question: "We _____ tired last night.", options: ["was", "were", "are"], correct: 1 }
                ]
            },
            writing: "Write about where you were yesterday and how you felt.",
            speaking: "Tell your partner about your last weekend."
        }
    ]
};
