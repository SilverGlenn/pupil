"""Deterministic, dependency-free extraction. Run from lane root: python3 tests/A/extract.py.
Only writes the six owned curriculum modules; demo roster is separately precomputed.
Markdown emphasis/code delimiters are presentation markup, not spoken curricular copy.
"""
from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parents[2]
tech=(ROOT/'curriculum/01-tech-literacy-curriculum.md').read_text()
english=(ROOT/'curriculum/02-basic-english-curriculum.md').read_text()
typing=(ROOT/'curriculum/03-typing-and-games-spec.md').read_text()
def clean(s):
    s=s.replace('`','').replace('**','')
    s=re.sub(r'\*([^*]+)\*',r'\1',s)
    return s.strip()
def field(s,label):
    m=re.search(r'- \*\*'+re.escape(label)+r':?\*\*:? (.*)',s)
    assert m,(label,s[:100])
    return m[1].strip()
def track(id):
    for prefix,value in [('L4A','track_4a'),('L4B','track_4b'),('L1','level_1'),('L2','level_2'),('L3','level_3')]:
        if prefix in id:return value
    raise ValueError(id)
def output(file,imports,exports):
    content='// Generated from the approved curriculum by tests/A/extract.py. Do not paraphrase.\n'+imports+'\n'
    for name,type_,value in exports:
        content+=f'export const {name}: {type_} = '+json.dumps(value,ensure_ascii=False,indent=2)+';\n'
    (ROOT/'src/data'/file).write_text(content)
lessons=[]
# Module headers delimit lessons, so level banners never become curricular fields.
for module in re.finditer(r'### Module ([\w.]+): ([^\n]+)\n([\s\S]*?)(?=\n### Module|\n## 4\.)',tech):
    mid,mtitle,body=module.groups()
    for m in re.finditer(r'#### Lesson ([\w.]+): ([^\n]+)\n([\s\S]*?)(?=\n#### Lesson|\Z)',body):
        id,title,s=m.groups()
        visual=s.split('- **Visual & Art Direction:**\n')[1].split('- **Step-by-Step Lesson Script:**')[0]
        visual='\n'.join(clean(re.sub(r'^\s*- ', '',line)) for line in visual.strip().splitlines())
        cards=[clean(re.sub(r'\n\s+', '\n',c)) for c in re.findall(r'- \*Card \d+:\* "([\s\S]*?)"(?=\n  - \*Card|\n- \*\*Audio)',s)]
        assert cards,id
        voice=clean(re.search(r'Voiceover Script:\*\*\n\s*> "([\s\S]*?)"\n',s)[1])
        tip=clean(re.search(r'Real-Life Philippine Tip:\*\*\n\s*> (.*)',s)[1])
        question=clean(field(s,'Question'))
        options=[clean(re.sub(r'\s*\*\(Correct\)\*','',o)) for o in re.findall(r'^    - [A-D]\) (.*)',s,re.M)]
        assert len(options)==4,id
        correct=ord(field(s,'Correct Answer'))-ord('A')
        good=clean(field(s,'Feedback (Correct)').strip('"'))
        bad=clean(field(s,'Feedback (Incorrect)').strip('"'))
        lessons.append(dict(lessonId='LES-'+id,level={'1':'preschool','2':'elem_lower','3':'elem_upper','4':'highschool'}[id[0]],title=clean(title),category='tech_literacy',isFoundationBridge=id.startswith('4A'),moduleId='MOD-'+mid,moduleTitle=mtitle,summary=clean(field(s,'Target Competency')),slides=[dict(slideId=f'LES-{id}-card-{i+1}',headline=f'Card {i+1}',bodyText=c,ttsAudioText=c,illustrationKey='tech-'+id.replace('.','-'),visualDescription=visual) for i,c in enumerate(cards)],quiz=[dict(questionId='LES-'+id+'-Q1',questionText=question,ttsAudioText=question,options=options,correctIndex=correct,explanation=good,incorrectExplanation=bad,optionFeedback=[good if i==correct else bad for i in range(4)])],realLifeTip=tip,voiceoverScript=voice,visualDescription=visual))
assert len(lessons)==35,len(lessons)
output('techLessons.ts',"import type {Lesson} from '../types/curriculum';",[('techLessons','Lesson[]',lessons)])
vocab=[]
vocab_notes={}
for m in re.finditer(r'#### Card (\S+): ([^\n]+)\n([\s\S]*?)(?=\n#### |\n---)',english):
    id,title,s=m.groups()
    category=field(s,'Category');pos,theme=re.match(r'(.*?) \((.*)\)',category).groups()
    # Contract supports one primary part of speech; first source classification wins.
    pos=pos.split(' / ')[0].lower().replace(' ','_')
    art=field(s,'Simple Art/Icon Description');audio=field(s,'Audio Pronunciation Guide')
    # Retain the full guide, including stress/syllable notes and the source's unusual Research alternative spelling.
    vocab_notes[id]=dict(category=category,pronunciationGuide=audio)
    phonetic=clean(audio[audio.index('['):])
    syllables=clean(audio[:audio.index('[')])
    vocab.append(dict(id=id,level=track(id),term=field(s,'Word / Phrase'),category=dict(partOfSpeech=pos,theme=theme),definition=field(s,'Ultra-Simple Definition'),exampleSentence=field(s,'Example Sentence'),visualAsset=dict(iconId='icon_'+title.lower().replace(' ','_'),altText=art,designPrompt=art),audioGuide=dict(syllabification=syllables,phoneticSpelling=phonetic)))
assert len(vocab)==75
output('englishVocab.ts',"import type {VocabCard} from '../types/curriculum';",[('vocabCards','VocabCard[]',vocab),('vocabSourceNotes','Record<string,{category:string;pronunciationGuide:string}>',vocab_notes)])
sentences=[]
for m in re.finditer(r'#### Exercise (\S+): ([^\n]+)\n([\s\S]*?)(?=\n#### |\n---)',english):
    id,title,s=m.groups()
    sentences.append(dict(id=id,level=track(id),grammarSkill=field(s,'Grammar Skill'),promptInstruction=field(s,'Prompt Instruction'),targetTiles=json.loads(field(s,'Ordered Target Word Tiles').strip('`')),distractorTiles=json.loads(field(s,'Distractor Word Tiles').strip('`')),targetSentence=field(s,'Completed Target Sentence'),contextHint=dict(visualDescription=field(s,'Visual / Audio Context Hint'))))
assert len(sentences)==30
output('englishSentences.ts',"import type {SentenceExercise} from '../types/curriculum';",[('sentenceExercises','SentenceExercise[]',sentences)])
stories=[]
for m in re.finditer(r'#### Passage (\S+): ([^\n]+)\n([\s\S]*?)(?=\n#### |\n---)',english):
    id,title,s=m.groups()
    text=s.split('**Story Text:**\n\n')[1].split('\n\n**Comprehension Quiz:**')[0]
    quiz=[]
    for q in re.finditer(r'\*\*Question (\d+):\*\* ([^\n]+)\n([\s\S]*?)(?=\n\*\*Question|\Z)',s):
        opts=[]
        for o in re.finditer(r'- ([A-D])\. ([^\n]+)\n  - \*Feedback:\* ([^\n]+)',q[3]):
            opts.append(dict(key=o[1],text=o[2].replace(' *(Correct)*',''),isCorrect='*(Correct)*' in o[2],feedback=o[3]))
        assert len(opts)==4,(id,q[1])
        quiz.append(dict(questionId=id+'-Q'+q[1],questionText=q[2],options=opts))
    stories.append(dict(id=id,level=track(id),title=title,metadata=dict(wordCount=int(field(s,'Word Count').split()[0]),targetLexile=field(s,'Lexile / Readability Target'),coreVocabulary=field(s,'Core Vocabulary').split(', ')),paragraphs=text.split('\n\n'),quiz=quiz))
assert len(stories)==13
output('englishStories.ts',"import type {StoryPassage} from '../types/curriculum';",[('storyPassages','StoryPassage[]',stories)])
drills=[]
for m in re.finditer(r'#### Drill (\d+)\.(\d+): ([^\n]+)\n([\s\S]*?)(?=\n#### Drill|\n---)',typing):
    stage,_,title,s=m.groups()
    drills.append(dict(drillId=field(s,'drillId').strip('`'),stageNumber=int(stage),title=field(s,'title'),focusKeys=json.loads(field(s,'focusKeys').strip('`')),targetText=field(s,'targetText').strip('`'),pedagogicalGoal=field(s,'pedagogicalGoal'),promptInstruction=field(s,'promptInstruction'),ttsPrompt=field(s,'ttsPrompt')))
assert len(drills)==60
output('typingDrills.ts',"import type {TypingDrill} from '../types/typing';",[('typingDrills','TypingDrill[]',drills)])
jeep=[]
for line in typing.splitlines():
    if line.startswith('| `jep-'):
        row=[clean(x) for x in line.strip('|').split('|')]
        id,tier,word,category,image,*distractors=row
        jeep.append(dict(id=id,tier=int(tier[-1]),targetWord=word,category=category,correctImage=image,distractors=[d for d in distractors if d!='—']))
scramble=[]
for line in typing.splitlines():
    if line.startswith('| `sb-'):
        id,words,sentence,grammar,tts=[clean(x) for x in line.strip('|').split('|')]
        n=int(id.split('-')[1]);level=['level_1','level_2','level_3','track_4b'][(n-1)//5]
        scramble.append(dict(id=id,level=level,scrambledWords=json.loads(words),correctSentence=sentence,grammarFocus=grammar,ttsAudioScript=tts.strip('"')))
cases=[]
def case(id,title,message,scam,explanation,sender='',kind='SMS',clues=None):
    # Missing source sender/clue fields remain explicit rather than inventing an identity.
    clues=clues or dict(senderClue=explanation,urlClue=explanation,urgencyClue=explanation)
    cases.append(dict(id=id,senderDisplay=title,senderRaw=sender,messageType=kind,messageBody=message,inspectionClues=clues,isScam=scam,explanationFeedback=explanation,redFlagsList=[explanation] if scam else []))
for m in re.finditer(r'\d\. \*\*Case (\d) \((.*?)\):\*\*\n([\s\S]*?)(?=\n\d\. \*\*Case|\n####)',tech):
    n,title,s=m.groups();message=re.search(r'\*Message:\* "(.*)"',s)[1];explanation=re.search(r'\*Explanation:\* (.*)',s)[1]
    case('tech-case-'+n,title,message,'**SCAM**' in s,explanation,kind='EMAIL' if n=='4' else 'SMS')
for m in re.finditer(r'#### Scenario C\.(\d): ([^\n]+)\n([\s\S]*?)(?=\n#### Scenario|\n---)',typing):
    n,title,s=m.groups();message=re.search(r'\*(?:Text|Message)\*: `"(.*)"`',s)[1];explanation=re.search(r'\*\*Detective Explanation\*\*: (.*)',s)[1]
    sender=re.search(r'\*Sender\*: `([^`]+)`',s)
    case('game-case-'+n,title,message,n!='2',explanation,sender[1] if sender else '',kind='EMAIL' if n=='2' else 'MESSENGER' if n=='4' else 'SMS')
assert len(cases)==9,len(cases)
# Additional concrete messages in lesson art and the inspector wireframe, with their supplied analysis.
for id,title,message in [('free-load','The Free Load Scam','Congratulations! You won 500 Pesos free mobile load from DepEd raffle. Claim here: ...'),('account-threat','The Account Threat Scam','Your account is locked! Click this link right now or lose your money!'),('scholarship','The Fake Scholarship Lure','Claim your 10,000 Pesos cash allowance assistance. Enter your family details here.')]:
    case('tech-lure-'+id,title,message,True,'Social Engineering works by manipulating your emotions: fear, greed, curiosity, or urgency.')
case('tech-art-gcash','Unknown Sender','URGENT GCASH NOTICE: Your account has been suspended due to unauthorized activity! Click here within 10 minutes to verify your identity or your balance will be confiscated: http://bit.ly/gcash-verify-sec99',True,'Artificial Panic & Urgency ("within 10 minutes"). Threat of financial loss ("balance confiscated"). Shortened / Suspicious URL (bit.ly/... instead of gcash.com). Grammatical inconsistencies.',sender='+639951234567')
case('tech-art-otp','Customer Support Representative','Good day, to unfreeze your account, please read me the 6-digit OTP code sent to your phone.',True,'STOP! Bank & GCash staff will NEVER ask for your OTP or MPIN!')
case('tech-quiz-deped','Unknown mobile number','DepEd Assistance: You won 5,000 Pesos! Click http://claim-free-cash.xyz now to receive your GCash!',True,'This is a classic phishing lure using greed to steal information. Never click suspicious links from unknown senders.')
case('tech-inspector-wireframe','+63 917 849 2011','ADVISORY: Your GCash wallet has been temporarily restricted! To restore transactions, confirm your 6-digit OTP immediately: Visit: http://gcash-account-reactivation.xyz/portal Failure to do so within 10 mins will freeze your account.',True,'Domain is gcash-account-reactivation.xyz. The official domain of GCash is strictly gcash.com. This is a spoofed domain!',sender='+63 917 849 2011',clues=dict(senderClue='Unknown individual 11-digit mobile number; not an official 3-digit or 4-digit verified telecom broadcast.',urlClue='Domain is gcash-account-reactivation.xyz. The official domain of GCash is strictly gcash.com. This is a spoofed domain!',urgencyClue="High-pressure artificial urgency: 'within 10 minutes'. Classic emotional manipulation tactic."))
case('game-inbox-wireframe','0999-FREE-LOAD (Unknown Sender)',"CONGRATULATIONS! YOU WON 50,000 PESOS! Click this link now: http://free-load-claim.ru/win.exe Send your home address and your parent's PIN number immediately!",True,'Notice the unknown number and the request for secrets!',sender='0999-FREE-LOAD')
files=[]
for line in typing.splitlines():
    if re.match(r'\| `(?:philippine_eagle|science_plants|national_anthem|math_quiz_scores|class_field_trip|corregidor_history)',line):
        name,kind,folder,concept=[clean(x) for x in line.strip('|').split('|')]
        files.append(dict(id=name,name=name,extension=name.rsplit('.',1)[1],correctFolderId=folder.strip('[]'),currentFolderId='DESKTOP',isSaved=False,lastSavedTimestamp=0))
pools={1:list('AEIOU'),2:list('ASDFJKL'),3:list('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),4:list('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#?!-.:;/')}
assert len(jeep)==15 and len(scramble)==20 and len(files)==6
output('gameData.ts',"import type {JeepneyWordItem,ScrambleItem} from '../types/games';\nimport type {ScamScenario,FileItem} from '../types/simulators';",[('jeepneyWordBank','JeepneyWordItem[]',jeep),('fallingKeysPool','Record<number,string[]>',pools),('sentenceScrambleBank','ScrambleItem[]',scramble),('scamDatabase','ScamScenario[]',cases),('detectiveFileBank','FileItem[]',files)])
print(f'Extracted {len(lessons)} lessons, {len(vocab)} vocab, {len(sentences)} sentences, {len(stories)} stories, {len(drills)} drills, {len(jeep)} Jeepney, {len(scramble)} scrambles, {len(cases)} scam cases.')
