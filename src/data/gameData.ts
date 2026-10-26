// Generated from the approved curriculum by tests/A/extract.py. Do not paraphrase.
import type {JeepneyWordItem,ScrambleItem} from '../types/games';
import type {ScamScenario,FileItem} from '../types/simulators';
export const jeepneyWordBank: JeepneyWordItem[] = [
  {
    "id": "jep-01",
    "tier": 1,
    "targetWord": "Sun",
    "category": "Nature",
    "correctImage": "Bright yellow smiling sun",
    "distractors": [
      "Rain cloud",
      "Blue ocean wave"
    ]
  },
  {
    "id": "jep-02",
    "tier": 1,
    "targetWord": "Cat",
    "category": "Animals",
    "correctImage": "Orange sleeping cat",
    "distractors": [
      "Brown dog",
      "Green frog"
    ]
  },
  {
    "id": "jep-03",
    "tier": 1,
    "targetWord": "Book",
    "category": "School",
    "correctImage": "Open storybook",
    "distractors": [
      "Wooden chair",
      "Red apple"
    ]
  },
  {
    "id": "jep-04",
    "tier": 2,
    "targetWord": "Mango",
    "category": "Food",
    "correctImage": "Ripe yellow mango",
    "distractors": [
      "Yellow banana",
      "Green coconut",
      "Red papaya"
    ]
  },
  {
    "id": "jep-05",
    "tier": 2,
    "targetWord": "Pencil",
    "category": "School",
    "correctImage": "Yellow sharpened pencil",
    "distractors": [
      "Blue water bottle",
      "School notebook",
      "Eraser"
    ]
  },
  {
    "id": "jep-06",
    "tier": 2,
    "targetWord": "Water",
    "category": "Everyday",
    "correctImage": "Clear glass of water",
    "distractors": [
      "Hot cup of milk",
      "Soup bowl",
      "Plate of rice"
    ]
  },
  {
    "id": "jep-07",
    "tier": 2,
    "targetWord": "Jeepney",
    "category": "Vehicles",
    "correctImage": "Colorful passenger jeepney",
    "distractors": [
      "Yellow tricycle",
      "School bus",
      "Bicycle"
    ]
  },
  {
    "id": "jep-08",
    "tier": 3,
    "targetWord": "Reading",
    "category": "Actions",
    "correctImage": "Girl reading a library book",
    "distractors": [
      "Boy running on track",
      "Child sleeping",
      "Kid singing"
    ]
  },
  {
    "id": "jep-09",
    "tier": 3,
    "targetWord": "Planting",
    "category": "Actions",
    "correctImage": "Hands planting a green seedling",
    "distractors": [
      "Watering can",
      "Cooking soup",
      "Painting picture"
    ]
  },
  {
    "id": "jep-10",
    "tier": 3,
    "targetWord": "Library",
    "category": "Places",
    "correctImage": "Room full of books & study desks",
    "distractors": [
      "Basketball court",
      "Market stall",
      "Playground"
    ]
  },
  {
    "id": "jep-11",
    "tier": 3,
    "targetWord": "Bridge",
    "category": "Places",
    "correctImage": "Long river bridge with road",
    "distractors": [
      "Mountain trail",
      "Sandy beach",
      "Airport runway"
    ]
  },
  {
    "id": "jep-12",
    "tier": 4,
    "targetWord": "Monitor",
    "category": "Technology",
    "correctImage": "Desktop computer display screen",
    "distractors": [
      "Computer mouse",
      "Audio speaker",
      "USB flash drive"
    ]
  },
  {
    "id": "jep-13",
    "tier": 4,
    "targetWord": "Folder",
    "category": "Technology",
    "correctImage": "Yellow digital file folder icon",
    "distractors": [
      "Trash can icon",
      "Web search icon",
      "Printer"
    ]
  },
  {
    "id": "jep-14",
    "tier": 4,
    "targetWord": "Keyboard",
    "category": "Technology",
    "correctImage": "Computer typing keyboard",
    "distractors": [
      "Game controller",
      "Camera lens",
      "Power plug"
    ]
  },
  {
    "id": "jep-15",
    "tier": 4,
    "targetWord": "Download",
    "category": "Technology",
    "correctImage": "Arrow pointing down into tray",
    "distractors": [
      "Arrow pointing up",
      "Refresh circle",
      "Lock symbol"
    ]
  }
];
export const fallingKeysPool: Record<number,string[]> = {
  "1": [
    "A",
    "E",
    "I",
    "O",
    "U"
  ],
  "2": [
    "A",
    "S",
    "D",
    "F",
    "J",
    "K",
    "L"
  ],
  "3": [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ],
  "4": [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "_",
    "@",
    "#",
    "?",
    "!",
    "-",
    ".",
    ":",
    ";",
    "/"
  ]
};
export const sentenceScrambleBank: ScrambleItem[] = [
  {
    "id": "sb-01",
    "level": "level_1",
    "scrambledWords": [
      "cat.",
      "The",
      "sleeps"
    ],
    "correctSentence": "The cat sleeps.",
    "grammarFocus": "Determiner + Noun + Intransitive Verb",
    "ttsAudioScript": "The cat sleeps."
  },
  {
    "id": "sb-02",
    "level": "level_1",
    "scrambledWords": [
      "mangoes.",
      "like",
      "I"
    ],
    "correctSentence": "I like mangoes.",
    "grammarFocus": "Pronoun + Verb + Plural Noun",
    "ttsAudioScript": "I like mangoes."
  },
  {
    "id": "sb-03",
    "level": "level_1",
    "scrambledWords": [
      "is",
      "sun",
      "The",
      "hot."
    ],
    "correctSentence": "The sun is hot.",
    "grammarFocus": "Predicate Adjective",
    "ttsAudioScript": "The sun is hot."
  },
  {
    "id": "sb-04",
    "level": "level_1",
    "scrambledWords": [
      "Birds",
      "high.",
      "fly"
    ],
    "correctSentence": "Birds fly high.",
    "grammarFocus": "Noun + Verb + Adverb",
    "ttsAudioScript": "Birds fly high."
  },
  {
    "id": "sb-05",
    "level": "level_1",
    "scrambledWords": [
      "We",
      "school.",
      "love"
    ],
    "correctSentence": "We love school.",
    "grammarFocus": "Plural Pronoun + Transitive Verb",
    "ttsAudioScript": "We love school."
  },
  {
    "id": "sb-06",
    "level": "level_2",
    "scrambledWords": [
      "yellow",
      "ride",
      "the",
      "jeepney.",
      "We"
    ],
    "correctSentence": "We ride the yellow jeepney.",
    "grammarFocus": "Adjective before Noun",
    "ttsAudioScript": "We ride the yellow jeepney."
  },
  {
    "id": "sb-07",
    "level": "level_2",
    "scrambledWords": [
      "opens",
      "her",
      "Maria",
      "laptop."
    ],
    "correctSentence": "Maria opens her laptop.",
    "grammarFocus": "Proper Noun + Singular Verb + Object",
    "ttsAudioScript": "Maria opens her laptop."
  },
  {
    "id": "sb-08",
    "level": "level_2",
    "scrambledWords": [
      "pencils",
      "have",
      "sharp",
      "Two",
      "boys."
    ],
    "correctSentence": "Two boys have sharp pencils.",
    "grammarFocus": "Number Quantifier + Adjective",
    "ttsAudioScript": "Two boys have sharp pencils."
  },
  {
    "id": "sb-09",
    "level": "level_2",
    "scrambledWords": [
      "Teacher",
      "smiles",
      "Our",
      "today."
    ],
    "correctSentence": "Our Teacher smiles today.",
    "grammarFocus": "Possessive Determiner + Adverb of Time",
    "ttsAudioScript": "Our Teacher smiles today."
  },
  {
    "id": "sb-10",
    "level": "level_2",
    "scrambledWords": [
      "clean",
      "water",
      "Drink",
      "every",
      "day."
    ],
    "correctSentence": "Drink clean water every day.",
    "grammarFocus": "Imperative Command",
    "ttsAudioScript": "Drink clean water every day."
  },
  {
    "id": "sb-11",
    "level": "level_3",
    "scrambledWords": [
      "save",
      "button",
      "Click",
      "to",
      "work.",
      "your",
      "blue",
      "the"
    ],
    "correctSentence": "Click the blue button to save your work.",
    "grammarFocus": "Infinitive of Purpose",
    "ttsAudioScript": "Click the blue button to save your work."
  },
  {
    "id": "sb-12",
    "level": "level_3",
    "scrambledWords": [
      "swim",
      "in",
      "Small",
      "the",
      "river.",
      "cool",
      "fishes"
    ],
    "correctSentence": "Small fishes swim in the cool river.",
    "grammarFocus": "Plural Subject-Verb Agreement",
    "ttsAudioScript": "Small fishes swim in the cool river."
  },
  {
    "id": "sb-13",
    "level": "level_3",
    "scrambledWords": [
      "homework",
      "We",
      "submit",
      "before",
      "our",
      "Friday."
    ],
    "correctSentence": "We submit our homework before Friday.",
    "grammarFocus": "Prepositional Time Phrase",
    "ttsAudioScript": "We submit our homework before Friday."
  },
  {
    "id": "sb-14",
    "level": "level_3",
    "scrambledWords": [
      "keyboard",
      "Keep",
      "dry",
      "and",
      "the",
      "clean."
    ],
    "correctSentence": "Keep the keyboard clean and dry.",
    "grammarFocus": "Conjunction connecting adjectives",
    "ttsAudioScript": "Keep the keyboard clean and dry."
  },
  {
    "id": "sb-15",
    "level": "level_3",
    "scrambledWords": [
      "reads",
      "a",
      "story",
      "Leo",
      "his",
      "sister.",
      "to"
    ],
    "correctSentence": "Leo reads a story to his sister.",
    "grammarFocus": "Indirect Object with Preposition",
    "ttsAudioScript": "Leo reads a story to his sister."
  },
  {
    "id": "sb-16",
    "level": "track_4b",
    "scrambledWords": [
      "strangers",
      "password",
      "Never",
      "your",
      "secret",
      "online.",
      "with",
      "share"
    ],
    "correctSentence": "Never share your secret password with strangers online.",
    "grammarFocus": "Adverb of Frequency + Security Rule",
    "ttsAudioScript": "Never share your secret password with strangers online."
  },
  {
    "id": "sb-17",
    "level": "track_4b",
    "scrambledWords": [
      "file",
      "your",
      "name",
      "project.",
      "with",
      "Save",
      "name_science.pdf",
      "the"
    ],
    "correctSentence": "Save your file with the name name_science.pdf project.",
    "grammarFocus": "Naming convention instruction",
    "ttsAudioScript": "Save your file with the name name_science.pdf project."
  },
  {
    "id": "sb-18",
    "level": "track_4b",
    "scrambledWords": [
      "messages",
      "delete",
      "suspicious",
      "Always",
      "unknown",
      "from",
      "numbers."
    ],
    "correctSentence": "Always delete suspicious messages from unknown numbers.",
    "grammarFocus": "Security imperative + Adjective phrase",
    "ttsAudioScript": "Always delete suspicious messages from unknown numbers."
  },
  {
    "id": "sb-19",
    "level": "track_4b",
    "scrambledWords": [
      "computer",
      "Log",
      "out",
      "of",
      "the",
      "finishing",
      "after",
      "class."
    ],
    "correctSentence": "Log out of the computer after finishing class.",
    "grammarFocus": "Phrasal Verb + Temporal Clause",
    "ttsAudioScript": "Log out of the computer after finishing class."
  },
  {
    "id": "sb-20",
    "level": "track_4b",
    "scrambledWords": [
      "helps",
      "Polite",
      "us",
      "communication",
      "collaborate",
      "classmates.",
      "with",
      "effectively"
    ],
    "correctSentence": "Polite communication helps us collaborate effectively with classmates.",
    "grammarFocus": "Complex Subject + Adverbial Manner",
    "ttsAudioScript": "Polite communication helps us collaborate effectively with classmates."
  }
];
export const scamDatabase: ScamScenario[] = [
  {
    "id": "tech-case-1",
    "senderDisplay": "GCash OTP Scam",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Hi Ma'am/Sir, this is GCash Support. An unauthorized login was detected in Davao. Please reply with the 6-digit OTP sent to your inbox to cancel the transfer.",
    "inspectionClues": {
      "senderClue": "Legitimate support staff will NEVER ask you to text or read your OTP.",
      "urlClue": "Legitimate support staff will NEVER ask you to text or read your OTP.",
      "urgencyClue": "Legitimate support staff will NEVER ask you to text or read your OTP."
    },
    "isScam": true,
    "explanationFeedback": "Legitimate support staff will NEVER ask you to text or read your OTP.",
    "redFlagsList": [
      "Legitimate support staff will NEVER ask you to text or read your OTP."
    ]
  },
  {
    "id": "tech-case-2",
    "senderDisplay": "Official School Portal Notification",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "From: DEPED-QC. Good day. First Quarter Periodical Examinations will begin on October 28, 2026. Review materials are available at your school portal: https://qc.deped.gov.ph.",
    "inspectionClues": {
      "senderClue": "Comes from an official broadcast channel, uses a clean `.gov.ph` domain, and does not ask for passwords, OTPs, or money.",
      "urlClue": "Comes from an official broadcast channel, uses a clean `.gov.ph` domain, and does not ask for passwords, OTPs, or money.",
      "urgencyClue": "Comes from an official broadcast channel, uses a clean `.gov.ph` domain, and does not ask for passwords, OTPs, or money."
    },
    "isScam": false,
    "explanationFeedback": "Comes from an official broadcast channel, uses a clean `.gov.ph` domain, and does not ask for passwords, OTPs, or money.",
    "redFlagsList": []
  },
  {
    "id": "tech-case-3",
    "senderDisplay": "Free Mobile Load Raffle",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Congratulations SIM# 0918***! You have won 1,000 PHP free Smart/Globe load in our mid-year consumer raffle. Claim now at http://bit.ly/claim-free-load-ph2026.",
    "inspectionClues": {
      "senderClue": "Unsolicited raffle win for a contest never entered; uses a shortened URL to disguise a phishing page.",
      "urlClue": "Unsolicited raffle win for a contest never entered; uses a shortened URL to disguise a phishing page.",
      "urgencyClue": "Unsolicited raffle win for a contest never entered; uses a shortened URL to disguise a phishing page."
    },
    "isScam": true,
    "explanationFeedback": "Unsolicited raffle win for a contest never entered; uses a shortened URL to disguise a phishing page.",
    "redFlagsList": [
      "Unsolicited raffle win for a contest never entered; uses a shortened URL to disguise a phishing page."
    ]
  },
  {
    "id": "tech-case-4",
    "senderDisplay": "Classroom Teacher Submission Reminder",
    "senderRaw": "",
    "messageType": "EMAIL",
    "messageBody": "Email from: `santos.m@manilacityschool.edu.ph`. Subject: Math Project Submission Deadline. Good day class, please submit your Math Project PDF through our Google Classroom stream by Friday 5:00 PM.",
    "inspectionClues": {
      "senderClue": "Verified institutional `.edu.ph` email, clear context, no threats, and standard academic instruction.",
      "urlClue": "Verified institutional `.edu.ph` email, clear context, no threats, and standard academic instruction.",
      "urgencyClue": "Verified institutional `.edu.ph` email, clear context, no threats, and standard academic instruction."
    },
    "isScam": false,
    "explanationFeedback": "Verified institutional `.edu.ph` email, clear context, no threats, and standard academic instruction.",
    "redFlagsList": []
  },
  {
    "id": "tech-case-5",
    "senderDisplay": "Fake Social Media Account Security Alert",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Facebook Security Team: Your profile has been reported for copyright violation. Login within 24 hours at http://facebook-verify-profile.online/auth or your account will be permanently deleted.",
    "inspectionClues": {
      "senderClue": "Phishing domain `.online` attempting to harvest social media login credentials through fear.",
      "urlClue": "Phishing domain `.online` attempting to harvest social media login credentials through fear.",
      "urgencyClue": "Phishing domain `.online` attempting to harvest social media login credentials through fear."
    },
    "isScam": true,
    "explanationFeedback": "Phishing domain `.online` attempting to harvest social media login credentials through fear.",
    "redFlagsList": [
      "Phishing domain `.online` attempting to harvest social media login credentials through fear."
    ]
  },
  {
    "id": "game-case-1",
    "senderDisplay": "The Free Online Game Load Scam",
    "senderRaw": "FREE-RELOAD-WINNER",
    "messageType": "SMS",
    "messageBody": "URGENT! You won 1,000 Pesos mobile load! Click http://bit.ly/freeload-now and enter your mother's bank card number in 5 minutes!",
    "inspectionClues": {
      "senderClue": "Real contests never ask for secret parent information. Never click strange shortened links from people you do not know.",
      "urlClue": "Real contests never ask for secret parent information. Never click strange shortened links from people you do not know.",
      "urgencyClue": "Real contests never ask for secret parent information. Never click strange shortened links from people you do not know."
    },
    "isScam": true,
    "explanationFeedback": "Real contests never ask for secret parent information. Never click strange shortened links from people you do not know.",
    "redFlagsList": [
      "Real contests never ask for secret parent information. Never click strange shortened links from people you do not know."
    ]
  },
  {
    "id": "game-case-2",
    "senderDisplay": "The School Teacher Email",
    "senderRaw": "teacher.faye@sanjose-elem.edu.ph",
    "messageType": "EMAIL",
    "messageBody": "Good afternoon, class. Please read pages 12 to 15 in your science textbook before our lesson on Monday. Have a restful weekend!",
    "inspectionClues": {
      "senderClue": "Look at the sender address ending in `.edu.ph`. It is polite, does not ask for money or passwords, and is from your verified teacher.",
      "urlClue": "Look at the sender address ending in `.edu.ph`. It is polite, does not ask for money or passwords, and is from your verified teacher.",
      "urgencyClue": "Look at the sender address ending in `.edu.ph`. It is polite, does not ask for money or passwords, and is from your verified teacher."
    },
    "isScam": false,
    "explanationFeedback": "Look at the sender address ending in `.edu.ph`. It is polite, does not ask for money or passwords, and is from your verified teacher.",
    "redFlagsList": []
  },
  {
    "id": "game-case-3",
    "senderDisplay": "The \"Virus Detected!\" Fake Browser Alert",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Your device will break in 30 seconds! Call 1-800-FAKE-HELP or download CleanTabletFast.exe immediately!",
    "inspectionClues": {
      "senderClue": "Fake virus pop-ups try to scare you into downloading harmful software. Websites cannot scan your computer through a simple page. Just close the tab!",
      "urlClue": "Fake virus pop-ups try to scare you into downloading harmful software. Websites cannot scan your computer through a simple page. Just close the tab!",
      "urgencyClue": "Fake virus pop-ups try to scare you into downloading harmful software. Websites cannot scan your computer through a simple page. Just close the tab!"
    },
    "isScam": true,
    "explanationFeedback": "Fake virus pop-ups try to scare you into downloading harmful software. Websites cannot scan your computer through a simple page. Just close the tab!",
    "redFlagsList": [
      "Fake virus pop-ups try to scare you into downloading harmful software. Websites cannot scan your computer through a simple page. Just close the tab!"
    ]
  },
  {
    "id": "game-case-4",
    "senderDisplay": "Social Media Password Request from a \"Friend\"",
    "senderRaw": "",
    "messageType": "MESSENGER",
    "messageBody": "Hey! I forgot my password for Pupil PH. Can you send me your username and 4-digit PIN so I can play your games?",
    "inspectionClues": {
      "senderClue": "Your 4-digit PIN is strictly for you. Real friends will never ask you to compromise your account. The teacher can always give them their own login.",
      "urlClue": "Your 4-digit PIN is strictly for you. Real friends will never ask you to compromise your account. The teacher can always give them their own login.",
      "urgencyClue": "Your 4-digit PIN is strictly for you. Real friends will never ask you to compromise your account. The teacher can always give them their own login."
    },
    "isScam": true,
    "explanationFeedback": "Your 4-digit PIN is strictly for you. Real friends will never ask you to compromise your account. The teacher can always give them their own login.",
    "redFlagsList": [
      "Your 4-digit PIN is strictly for you. Real friends will never ask you to compromise your account. The teacher can always give them their own login."
    ]
  },
  {
    "id": "tech-lure-free-load",
    "senderDisplay": "The Free Load Scam",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Congratulations! You won 500 Pesos free mobile load from DepEd raffle. Claim here: ...",
    "inspectionClues": {
      "senderClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
      "urlClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
      "urgencyClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency."
    },
    "isScam": true,
    "explanationFeedback": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
    "redFlagsList": [
      "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency."
    ]
  },
  {
    "id": "tech-lure-account-threat",
    "senderDisplay": "The Account Threat Scam",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Your account is locked! Click this link right now or lose your money!",
    "inspectionClues": {
      "senderClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
      "urlClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
      "urgencyClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency."
    },
    "isScam": true,
    "explanationFeedback": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
    "redFlagsList": [
      "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency."
    ]
  },
  {
    "id": "tech-lure-scholarship",
    "senderDisplay": "The Fake Scholarship Lure",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Claim your 10,000 Pesos cash allowance assistance. Enter your family details here.",
    "inspectionClues": {
      "senderClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
      "urlClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
      "urgencyClue": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency."
    },
    "isScam": true,
    "explanationFeedback": "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.",
    "redFlagsList": [
      "Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency."
    ]
  },
  {
    "id": "tech-art-gcash",
    "senderDisplay": "Unknown Sender",
    "senderRaw": "+639951234567",
    "messageType": "SMS",
    "messageBody": "URGENT GCASH NOTICE: Your account has been suspended due to unauthorized activity! Click here within 10 minutes to verify your identity or your balance will be confiscated: http://bit.ly/gcash-verify-sec99",
    "inspectionClues": {
      "senderClue": "Artificial Panic & Urgency (\"within 10 minutes\"). Threat of financial loss (\"balance confiscated\"). Shortened / Suspicious URL (bit.ly/... instead of gcash.com). Grammatical inconsistencies.",
      "urlClue": "Artificial Panic & Urgency (\"within 10 minutes\"). Threat of financial loss (\"balance confiscated\"). Shortened / Suspicious URL (bit.ly/... instead of gcash.com). Grammatical inconsistencies.",
      "urgencyClue": "Artificial Panic & Urgency (\"within 10 minutes\"). Threat of financial loss (\"balance confiscated\"). Shortened / Suspicious URL (bit.ly/... instead of gcash.com). Grammatical inconsistencies."
    },
    "isScam": true,
    "explanationFeedback": "Artificial Panic & Urgency (\"within 10 minutes\"). Threat of financial loss (\"balance confiscated\"). Shortened / Suspicious URL (bit.ly/... instead of gcash.com). Grammatical inconsistencies.",
    "redFlagsList": [
      "Artificial Panic & Urgency (\"within 10 minutes\"). Threat of financial loss (\"balance confiscated\"). Shortened / Suspicious URL (bit.ly/... instead of gcash.com). Grammatical inconsistencies."
    ]
  },
  {
    "id": "tech-art-otp",
    "senderDisplay": "Customer Support Representative",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "Good day, to unfreeze your account, please read me the 6-digit OTP code sent to your phone.",
    "inspectionClues": {
      "senderClue": "STOP! Bank & GCash staff will NEVER ask for your OTP or MPIN!",
      "urlClue": "STOP! Bank & GCash staff will NEVER ask for your OTP or MPIN!",
      "urgencyClue": "STOP! Bank & GCash staff will NEVER ask for your OTP or MPIN!"
    },
    "isScam": true,
    "explanationFeedback": "STOP! Bank & GCash staff will NEVER ask for your OTP or MPIN!",
    "redFlagsList": [
      "STOP! Bank & GCash staff will NEVER ask for your OTP or MPIN!"
    ]
  },
  {
    "id": "tech-quiz-deped",
    "senderDisplay": "Unknown mobile number",
    "senderRaw": "",
    "messageType": "SMS",
    "messageBody": "DepEd Assistance: You won 5,000 Pesos! Click http://claim-free-cash.xyz now to receive your GCash!",
    "inspectionClues": {
      "senderClue": "This is a classic phishing lure using greed to steal information. Never click suspicious links from unknown senders.",
      "urlClue": "This is a classic phishing lure using greed to steal information. Never click suspicious links from unknown senders.",
      "urgencyClue": "This is a classic phishing lure using greed to steal information. Never click suspicious links from unknown senders."
    },
    "isScam": true,
    "explanationFeedback": "This is a classic phishing lure using greed to steal information. Never click suspicious links from unknown senders.",
    "redFlagsList": [
      "This is a classic phishing lure using greed to steal information. Never click suspicious links from unknown senders."
    ]
  },
  {
    "id": "tech-inspector-wireframe",
    "senderDisplay": "+63 917 849 2011",
    "senderRaw": "+63 917 849 2011",
    "messageType": "SMS",
    "messageBody": "ADVISORY: Your GCash wallet has been temporarily restricted! To restore transactions, confirm your 6-digit OTP immediately: Visit: http://gcash-account-reactivation.xyz/portal Failure to do so within 10 mins will freeze your account.",
    "inspectionClues": {
      "senderClue": "Unknown individual 11-digit mobile number; not an official 3-digit or 4-digit verified telecom broadcast.",
      "urlClue": "Domain is gcash-account-reactivation.xyz. The official domain of GCash is strictly gcash.com. This is a spoofed domain!",
      "urgencyClue": "High-pressure artificial urgency: 'within 10 minutes'. Classic emotional manipulation tactic."
    },
    "isScam": true,
    "explanationFeedback": "Domain is gcash-account-reactivation.xyz. The official domain of GCash is strictly gcash.com. This is a spoofed domain!",
    "redFlagsList": [
      "Domain is gcash-account-reactivation.xyz. The official domain of GCash is strictly gcash.com. This is a spoofed domain!"
    ]
  },
  {
    "id": "game-inbox-wireframe",
    "senderDisplay": "0999-FREE-LOAD (Unknown Sender)",
    "senderRaw": "0999-FREE-LOAD",
    "messageType": "SMS",
    "messageBody": "CONGRATULATIONS! YOU WON 50,000 PESOS! Click this link now: http://free-load-claim.ru/win.exe Send your home address and your parent's PIN number immediately!",
    "inspectionClues": {
      "senderClue": "Notice the unknown number and the request for secrets!",
      "urlClue": "Notice the unknown number and the request for secrets!",
      "urgencyClue": "Notice the unknown number and the request for secrets!"
    },
    "isScam": true,
    "explanationFeedback": "Notice the unknown number and the request for secrets!",
    "redFlagsList": [
      "Notice the unknown number and the request for secrets!"
    ]
  }
];
export const detectiveFileBank: FileItem[] = [
  {
    "id": "philippine_eagle.png",
    "name": "philippine_eagle.png",
    "extension": "png",
    "correctFolderId": "Pictures",
    "currentFolderId": "DESKTOP",
    "isSaved": false,
    "lastSavedTimestamp": 0
  },
  {
    "id": "science_plants.docx",
    "name": "science_plants.docx",
    "extension": "docx",
    "correctFolderId": "Documents",
    "currentFolderId": "DESKTOP",
    "isSaved": false,
    "lastSavedTimestamp": 0
  },
  {
    "id": "national_anthem.mp3",
    "name": "national_anthem.mp3",
    "extension": "mp3",
    "correctFolderId": "Music & Audio",
    "currentFolderId": "DESKTOP",
    "isSaved": false,
    "lastSavedTimestamp": 0
  },
  {
    "id": "math_quiz_scores.xlsx",
    "name": "math_quiz_scores.xlsx",
    "extension": "xlsx",
    "correctFolderId": "Documents",
    "currentFolderId": "DESKTOP",
    "isSaved": false,
    "lastSavedTimestamp": 0
  },
  {
    "id": "class_field_trip.jpg",
    "name": "class_field_trip.jpg",
    "extension": "jpg",
    "correctFolderId": "Pictures",
    "currentFolderId": "DESKTOP",
    "isSaved": false,
    "lastSavedTimestamp": 0
  },
  {
    "id": "corregidor_history.pdf",
    "name": "corregidor_history.pdf",
    "extension": "pdf",
    "correctFolderId": "Documents",
    "currentFolderId": "DESKTOP",
    "isSaved": false,
    "lastSavedTimestamp": 0
  }
];
