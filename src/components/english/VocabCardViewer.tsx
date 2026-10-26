import {useEffect,useState} from 'react';
import type {VocabCard} from '../../types/curriculum';
import {speakText,stopSpeech} from '../../utils/speechTts';
/** Explicit aliases keep full curricular picture descriptions out of overlapping word dispatch. */
const pictureConcepts:Record<string,string>={
 'bright yellow smiling sun':'sun','rain cloud':'rain','blue ocean wave':'wave',
 'orange sleeping cat':'cat','brown dog':'dog','green frog':'frog',
 'open storybook':'book','wooden chair':'chair','red apple':'apple',
 'ripe yellow mango':'mango','yellow banana':'banana','green coconut':'coconut-fruit','red papaya':'papaya',
 'yellow sharpened pencil':'pencil','blue water bottle':'bottle','school notebook':'notebook','eraser':'eraser',
 'clear glass of water':'water','hot cup of milk':'milk','soup bowl':'soup','plate of rice':'rice',
 'colorful passenger jeepney':'jeepney','yellow tricycle':'tricycle','school bus':'school bus','bicycle':'bicycle',
 'girl reading a library book':'person-reading','boy running on track':'run','child sleeping':'sleep','kid singing':'sing',
 'hands planting a green seedling':'hands-seedling','watering can':'watering can','cooking soup':'cooking-pot','painting picture':'painting',
 'room full of books & study desks':'library-room','basketball court':'court','market stall':'market-stall','playground':'playground',
 'long river bridge with road':'bridge','mountain trail':'mountain','sandy beach':'beach','airport runway':'airport',
 'desktop computer display screen':'monitor','computer mouse':'mouse','audio speaker':'speaker','usb flash drive':'usb',
 'yellow digital file folder icon':'folder','trash can icon':'trash','web search icon':'search','printer':'printer',
 'computer typing keyboard':'keyboard','game controller':'game controller','camera lens':'camera','power plug':'plug',
 'arrow pointing down into tray':'arrow pointing down','arrow pointing up':'arrow pointing up','refresh circle':'refresh','lock symbol':'lock'
};
/** Compact offline vector concepts. No answer text is drawn. */
export function ConceptArt({concept,studio=false}:{concept:string;studio?:boolean}){const input=concept.toLowerCase();const c=pictureConcepts[input]??input;let art;
 if(c==='red')art=<circle cx="60" cy="56" r="37" fill="#EF4444"/>;
 else if(c==='yellow')art=<polygon points="60,10 74,40 108,44 83,68 90,102 60,85 30,102 37,68 12,44 46,40" fill="#FBBF24"/>;
 else if(c==='cat')art=<><ellipse cx="60" cy="75" rx="30" ry="22" fill="#FB923C"/><path d="M35 50L32 22L52 38H68L88 22L85 50Z" fill="#FB923C"/><path d="M42 52Q48 58 54 52M66 52Q72 58 78 52M87 77Q116 50 108 84Q101 105 76 94" fill="none"/><path d="M47 64H25M73 64H95"/></>;
 else if(c==='dog')art=<><ellipse cx="60" cy="77" rx="27" ry="24" fill="#A16207"/><circle cx="60" cy="43" r="24" fill="#A16207"/><ellipse cx="34" cy="48" rx="10" ry="23" fill="#78350F"/><ellipse cx="86" cy="48" rx="10" ry="23" fill="#78350F"/><circle cx="51" cy="41" r="3"/><circle cx="69" cy="41" r="3"/><path d="M54 54H66L60 60ZM84 78Q111 76 103 57" fill="#334155"/></>;
 else if(c==='frog')art=<><ellipse cx="60" cy="72" rx="35" ry="26" fill="#22C55E"/><circle cx="39" cy="43" r="17" fill="#22C55E"/><circle cx="81" cy="43" r="17" fill="#22C55E"/><circle cx="39" cy="43" r="7" fill="#FFFFFF"/><circle cx="81" cy="43" r="7" fill="#FFFFFF"/><circle cx="39" cy="43" r="3"/><circle cx="81" cy="43" r="3"/><path d="M42 71Q60 86 78 71M30 85L12 100H40M90 85L108 100H80" fill="none"/></>;
 else if(c==='apple')art=<><path d="M60 35C15 10 12 75 38 99Q50 108 60 99Q80 112 97 82C118 35 86 16 60 35Z" fill="#EF4444"/><path d="M60 35L64 10M64 24Q78 2 94 18Q78 32 64 24" fill="#16A34A"/></>;
 else if(c==='coconut-fruit')art=<><circle cx="60" cy="68" r="37" fill="#22C55E"/><ellipse cx="60" cy="40" rx="27" ry="14" fill="#F8FAFC"/><path d="M67 40L80 10H97" fill="none" stroke="#0891B2" strokeWidth="5"/></>;
 else if(c==='bottle')art=<><path d="M45 15H75V40L85 53V100H35V53L45 40Z" fill="#38BDF8"/><rect x="43" y="8" width="34" height="12" rx="3" fill="#1D4ED8"/><path d="M35 64H85V86H35Z" fill="#E2E8F0"/></>;
 else if(c==='notebook')art=<><rect x="25" y="12" width="75" height="93" rx="4" fill="#93C5FD"/><path d="M40 12V105M50 35H87M50 50H87M50 65H87M50 80H87"/>{[25,45,65,85].map(y=><path key={y} d={`M15 ${y}H31`} strokeWidth="5"/>)}</>;
 else if(c==='person-reading')art=<><circle cx="60" cy="22" r="16" fill="#C08457"/><path d="M33 80V56Q60 35 87 56V80" fill="#93C5FD"/><path d="M60 69Q35 48 15 63V101Q38 88 60 106Q82 88 105 101V63Q85 48 60 69Z" fill="#E2E8F0"/><path d="M60 69V106"/></>;
 else if(c==='hands-seedling')art=<><path d="M10 69L39 90H81L110 69M10 83L34 106H86L110 83" fill="#C08457"/><path d="M60 87V40M60 65Q25 65 30 37Q60 36 60 65M60 52Q93 50 91 22Q60 22 60 52" fill="#22C55E"/></>;
 else if(c==='cooking-pot')art=<><path d="M25 50H95V89Q60 112 25 89ZM25 62H8V80H25M95 62H112V80H95" fill="#94A3B8"/><path d="M40 32Q50 22 40 8M60 32Q70 22 60 8M80 52L97 16" fill="none" strokeWidth="5"/></>;
 else if(c==='library-room')art=<><path d="M10 12H110V72H10ZM10 42H110M43 12V72M77 12V72" fill="#E2E8F0"/>{[18,28,51,61,85,95].map(x=><path key={x} d={`M${x} 18V36M${x} 48V65`} stroke="#0891B2" strokeWidth="5"/>)}<path d="M25 84H95M35 84V108M85 84V108M16 91V108M104 91V108" fill="none" strokeWidth="5"/></>;
 else if(c==='market-stall')art=<><path d="M10 40L25 12H95L110 40Z" fill="#FBBF24"/><path d="M20 40V100M100 40V100M15 74H105V95H15Z" fill="#A16207"/>{[30,50,70,90].map(x=><circle key={x} cx={x} cy="66" r="9" fill={x<60?'#22C55E':'#FBBF24'}/>)}</>;
 else if(c==='wave')art=<><path d="M0 75Q28 70 35 45Q54 5 86 35Q50 20 62 52Q72 75 120 67V112H0Z" fill="#38BDF8"/><path d="M5 93Q32 79 60 93T115 93" fill="none" stroke="#F8FAFC"/></>;
 else if(/mouse/.test(c))art=<><rect x="35" y="24" width="50" height="78" rx="25" fill="#94A3B8"/><path d="M60 24V52M35 55H85M60 24Q35 5 70 4" fill="none"/></>;
 else if(/arrow pointing down/.test(c))art=<path d="M60 12V75M38 53L60 75L82 53M20 78V98H100V78" fill="none" stroke="#0891B2" strokeWidth="6"/>;
 else if(/arrow pointing up/.test(c))art=<path d="M60 98V28M38 50L60 28L82 50" fill="none" stroke="#0891B2" strokeWidth="6"/>;
 else if(/school bus/.test(c))art=<><rect x="25" y="10" width="70" height="85" rx="10" fill="#FBBF24"/><path d="M33 23H87V58H33Z" fill="#BAE6FD"/><circle cx="38" cy="78" r="6" fill="#F8FAFC"/><circle cx="82" cy="78" r="6" fill="#F8FAFC"/><path d="M32 95V108M88 95V108" strokeWidth="10"/></>;
 else if(/tricycle/.test(c))art=<><circle cx="25" cy="83" r="15" fill="#64748B"/><circle cx="69" cy="83" r="15" fill="#64748B"/><path d="M25 83L44 46L69 83H25M40 46H60M44 46L35 28" fill="none"/><rect x="73" y="36" width="33" height="49" rx="4" fill="#22C55E"/><path d="M72 30H109M92 36V65"/></>;
 else if(/bicycle/.test(c))art=<><circle cx="25" cy="80" r="20" fill="none"/><circle cx="93" cy="80" r="20" fill="none"/><path d="M25 80L48 40L67 80H25L79 40L93 80M77 40L70 22H90M38 36H58" fill="none" stroke="#0891B2" strokeWidth="4"/></>;
 else if(/papaya/.test(c))art=<><ellipse cx="60" cy="60" rx="30" ry="45" fill="#FB923C"/><ellipse cx="60" cy="60" rx="12" ry="30" fill="#334155"/>{[35,48,61,74,87].map(y=><circle key={y} cx="60" cy={y} r="3" fill="#0F172A"/>)}</>;
 else if(/eraser/.test(c))art=<><path d="M20 75L65 22L105 53L60 100Z" fill="#F9A8D4"/><path d="M20 75L42 49L82 79L60 100Z" fill="#93C5FD"/></>;
 else if(/milk|cup/.test(c))art=<><path d="M23 35H85V90H23ZM85 45Q120 40 108 72H85" fill="#F8FAFC"/><path d="M35 22Q45 12 35 2M60 22Q70 12 60 2" fill="none"/></>;
 else if(/soup|rice/.test(c))art=<><path d="M15 55H105Q98 100 60 100Q22 100 15 55Z" fill="#E2E8F0"/><ellipse cx="60" cy="55" rx="45" ry="15" fill={/rice/.test(c)?'#FFFFFF':'#FBBF24'}/>{[35,48,61,74,87].map(x=><path key={x} d={`M${x} 51l4 5`} stroke={/rice/.test(c)?'#94A3B8':'#16A34A'}/>)}</>;
 else if(/speaker/.test(c))art=<><rect x="30" y="10" width="60" height="95" rx="5" fill="#64748B"/><circle cx="60" cy="36" r="12" fill="#0F172A"/><circle cx="60" cy="77" r="21" fill="#0F172A"/></>;
 else if(/usb/.test(c))art=<><rect x="40" y="40" width="40" height="65" rx="8" fill="#0891B2"/><path d="M45 40V12H75V40M53 20V30M67 20V30" fill="#CBD5E1"/></>;
 else if(/search|clarify|inquire/.test(c))art=<><circle cx="48" cy="45" r="30" fill="none" stroke="#0891B2" strokeWidth="6"/><path d="M70 68L105 103" strokeWidth="10"/></>;
 else if(/printer/.test(c))art=<><rect x="15" y="40" width="90" height="47" rx="5" fill="#64748B"/><path d="M30 40V10H90V40M30 70H90V105H30Z" fill="#F8FAFC"/><path d="M40 83H80M40 94H75"/></>;
 else if(/game controller/.test(c))art=<><path d="M23 38Q60 25 97 38L110 85Q100 110 79 80H41Q15 110 10 85Z" fill="#64748B"/><path d="M30 47V70M19 58H42"/><circle cx="84" cy="51" r="5" fill="#34D399"/><circle cx="96" cy="63" r="5" fill="#FB7185"/></>;
 else if(/camera/.test(c))art=<><path d="M10 35H35L43 20H78L85 35H110V97H10Z" fill="#64748B"/><circle cx="60" cy="65" r="25" fill="#BAE6FD"/></>;
 else if(/plug|electricity/.test(c))art=<><path d="M45 12V40M75 12V40M30 40H90V65Q90 90 60 90Q30 90 30 65ZM60 90V110" fill="#FBBF24"/></>;
 else if(/trash/.test(c))art=<><path d="M30 32L38 103H82L90 32M20 30H100M45 30V15H75V30M48 45V90M70 45V90" fill="none" stroke="#64748B" strokeWidth="5"/></>;
 else if(/mountain/.test(c))art=<><path d="M5 100L45 15L78 75L96 40L118 100Z" fill="#64748B"/><path d="M42 100L60 78L46 64L58 43" fill="none" stroke="#FBBF24"/></>;
 else if(/beach|ocean|island/.test(c))art=<><path d="M0 65Q30 40 60 65T120 65V115H0Z" fill="#38BDF8"/><path d="M0 70Q40 60 85 100L0 115Z" fill="#FDE68A"/></>;
 else if(/airport/.test(c))art=<><path d="M15 110L40 10H80L105 110Z" fill="#64748B"/><path d="M60 20V35M60 45V60M60 70V85M60 95V110" stroke="#FFFFFF" strokeWidth="5"/></>;
 else if(/playground/.test(c))art=<><path d="M20 100L40 15H80L100 100M40 15H80M53 15V65M70 15V65M48 68H76" fill="none" stroke="#0891B2" strokeWidth="5"/></>;
 else if(/court/.test(c))art=<><path d="M10 35H110V103H10Z" fill="#FB923C"/><path d="M60 35V103M10 69H110"/><circle cx="60" cy="69" r="14" fill="none"/></>;
 else if(/sleep/.test(c))art=<><path d="M15 45V100M15 72H105V100M20 50H100V72H20Z" fill="#93C5FD"/><circle cx="35" cy="58" r="12" fill="#C08457"/></>;
 else if(/sing/.test(c))art=<><circle cx="48" cy="35" r="18" fill="#C08457"/><path d="M48 53V92M85 20V65M85 20L105 15V58"/><ellipse cx="78" cy="68" rx="8" ry="5"/><ellipse cx="98" cy="61" rx="8" ry="5"/></>;
 else if(/watering can/.test(c))art=<><rect x="18" y="45" width="55" height="50" rx="8" fill="#22C55E"/><path d="M25 45V22H65V45M73 60L100 35L110 45L78 80" fill="none" strokeWidth="6"/></>;
 else if(/painting/.test(c))art=<><path d="M25 15H95V85H25ZM60 85V110M25 110L60 85L95 110" fill="#F8FAFC"/><path d="M35 65L52 40L68 60L85 30" fill="none" stroke="#E11D48" strokeWidth="6"/></>;
 else if(/notification/.test(c))art=<><path d="M25 80Q40 70 38 40A22 22 0 0 1 82 40Q80 70 95 80ZM50 90Q60 110 70 90" fill="#FBBF24"/><circle cx="88" cy="22" r="10" fill="#EF4444"/></>;
 else if(/settings/.test(c))art=<><circle cx="60" cy="55" r="32" fill="#64748B"/><circle cx="60" cy="55" r="14" fill="#E2E8F0"/>{[0,45,90,135,180,225,270,315].map(a=><path key={a} d="M60 20V7" stroke="#64748B" strokeWidth="12" transform={`rotate(${a} 60 55)`}/>)}</>;
 else if(/attachment/.test(c))art=<path d="M42 65L75 30Q95 10 105 30Q112 42 98 56L55 98Q35 118 18 97Q5 80 23 62L69 16" fill="none" stroke="#94A3B8" strokeWidth="8"/>;
 else if(/date|deadline|schedule/.test(c))art=<><rect x="15" y="22" width="90" height="80" rx="4" fill="#E2E8F0"/><path d="M15 42H105M35 10V32M85 10V32"/>{[0,1,2,3,4,5].map(i=><rect key={i} x={30+i%3*23} y={55+Math.floor(i/3)*25} width="10" height="10" fill={i===4?'#EF4444':'#64748B'}/>)}</>;
 else if(/announcement/.test(c))art=<><path d="M20 42H45L95 15V90L45 67H20ZM35 67L45 100H60L52 70" fill="#0891B2"/><path d="M105 35L116 25M108 55H120M105 75L116 85"/></>;
 else if(/purpose/.test(c))art=<><circle cx="60" cy="55" r="42" fill="none" stroke="#0891B2" strokeWidth="6"/><circle cx="60" cy="55" r="26" fill="none"/><circle cx="60" cy="55" r="10" fill="#F43F5E"/><path d="M60 55L110 5M92 5H110V23"/></>;
 else if(/sun|morning|yellow star/.test(c))art=<><circle cx="60" cy="55" r="24" fill="#FBBF24"/>{[0,45,90,135,180,225,270,315].map(a=><path key={a} d="M60 18V8" transform={`rotate(${a} 60 55)`}/>)}</>;
 else if(/mango/.test(c))art=<><path d="M65 25C105 25 107 66 75 88C45 109 18 73 34 47Q45 23 65 25Z" fill="#FBBF24"/><path d="M65 25Q73 5 92 15Q87 29 65 25" fill="#16A34A"/></>;
 else if(/banana/.test(c))art=<path d="M30 20Q35 85 98 64Q75 108 35 78Q12 57 30 20Z" fill="#FDE047"/>;
 else if(/cat|dog|frog/.test(c))art=<><ellipse cx="60" cy="75" rx="30" ry="22" fill={/frog/.test(c)?'#22C55E':/dog/.test(c)?'#A16207':'#FB923C'}/><path d="M35 50L32 22L52 38H68L88 22L85 50Z" fill={/dog/.test(c)?'#A16207':'#FB923C'}/><circle cx="48" cy="50" r="3"/><circle cx="72" cy="50" r="3"/><path d="M53 63Q60 70 67 63"/></>;
 else if(/water|glass|bottle/.test(c))art=<><path d="M36 22H84L78 94H42Z" fill="#BAE6FD"/><path d="M39 48Q60 38 81 48L77 90H43Z" fill="#38BDF8"/></>;
 else if(/rain|cloud/.test(c)&&!/upload|download/.test(c))art=<><path d="M25 54Q8 30 35 27Q50 2 72 25Q108 20 101 54Z" fill="#94A3B8"/><path d="M35 65L27 83M60 65L52 83M85 65L77 83" stroke="#0284C7"/></>;
 else if(/tree|garden|plant|seedling|coconut/.test(c))art=<><path d="M60 98V53" stroke="#92400E" strokeWidth="9"/><path d="M60 56Q8 70 22 30Q45 12 60 34Q78 2 100 30Q110 62 60 56Z" fill="#22C55E"/></>;
 else if(/jeepney|bus|tricycle|vehicle/.test(c))art=<><path d="M12 40H84L106 62V86H12Z" fill={studio?'#0891B2':'#FBBF24'}/><path d="M20 46H78V65H20ZM84 48L100 65H84Z" fill="#BAE6FD"/><circle cx="32" cy="87" r="10" fill="#334155"/><circle cx="87" cy="87" r="10" fill="#334155"/></>;
 else if(/keyboard/.test(c))art=<><rect x="8" y="35" width="104" height="50" rx="5" fill="#64748B"/>{Array.from({length:24},(_,i)=><rect key={i} x={15+i%8*12} y={43+Math.floor(i/8)*11} width="8" height="7" fill="#E2E8F0"/>)}</>;
 else if(/monitor|computer|desktop|research/.test(c))art=<><rect x="15" y="15" width="90" height="60" rx="4" fill="#38BDF8"/><path d="M60 75V95M35 96H85"/></>;
 else if(/folder/.test(c))art=<path d="M15 32V22H48L58 34H106V92H15Z" fill="#FBBF24"/>;
 else if(/download|upload|submit/.test(c))art=<><path d="M20 72V95H100V72M60 15V74M40 54L60 74L80 54" fill="none" stroke="#0891B2" transform={/upload/.test(c)?'rotate(180 60 55)':undefined}/></>;
 else if(/lock|password|protect|account|verification/.test(c))art=<><rect x="28" y="48" width="64" height="50" rx="7" fill="#14B8A6"/><path d="M40 48V28A20 20 0 0 1 80 28V48" fill="none"/><circle cx="60" cy="70" r="5"/></>;
 else if(/book|library|reading|room full of books/.test(c))art=<><path d="M60 30Q35 10 10 26V90Q38 77 60 96Q82 77 110 90V26Q85 10 60 30Z" fill="#E2E8F0"/><path d="M60 30V96M22 40L47 43M22 55L47 58M74 43L98 40M74 58L98 55"/></>;
 else if(/pencil|write|drawing|feedback/.test(c))art=<><path d="M25 93L34 65L87 12L105 30L52 83Z" fill="#FBBF24"/><path d="M34 65L52 83M25 93L38 88"/></>;
 else if(/fish/.test(c))art=<><ellipse cx="55" cy="55" rx="35" ry="22" fill="#38BDF8"/><path d="M85 55L110 30V80Z" fill="#38BDF8"/><circle cx="35" cy="50" r="4"/></>;
 else if(/house|store|market|hall|village/.test(c))art=<><path d="M12 48L60 12L108 48Z" fill="#EF4444"/><path d="M24 48H96V100H24Z" fill="#FDE68A"/><path d="M50 100V67H74V100M32 56H43V71H32"/></>;
 else if(/ball|basket/.test(c))art=<><circle cx="60" cy="55" r="38" fill="#FB923C"/><path d="M22 55H98M60 17V93M34 27Q75 55 34 83M86 27Q45 55 86 83"/></>;
 else if(/cancel|trash|delete/.test(c))art=<><path d="M35 35L85 85M85 35L35 85" stroke="#EF4444" strokeWidth="10"/></>;
 else if(/confirm|permission/.test(c))art=<path d="M20 55L47 82L100 25" stroke="#10B981" strokeWidth="10" fill="none"/>;
 else if(/bridge/.test(c))art=<><path d="M8 75H112M20 75V100M100 75V100M20 75Q60 5 100 75M20 75V45M40 75V29M60 75V22M80 75V29M100 75V45" fill="none" stroke="#64748B"/></>;
 else if(/chair/.test(c))art=<path d="M28 15H80V65H95V78H28ZM28 78V105M88 78V105" fill="#A16207"/>;
 else if(/mouse/.test(c))art=<><rect x="35" y="24" width="50" height="78" rx="25" fill="#94A3B8"/><path d="M60 24V52M35 55H85M60 24Q35 5 70 4" fill="none"/></>;
 else if(/arrow|refresh|recycle/.test(c))art=<><path d="M90 38A35 35 0 1 0 93 75M90 15V40H65" fill="none" stroke="#10B981" strokeWidth="6"/></>;
 else if(/run|jump|sing|friend|teacher|mother|father|profile|volunteer|community/.test(c))art=<><circle cx="60" cy="24" r="14" fill="#C08457"/><path d="M60 40V75M60 48L29 66M60 48L91 35M60 75L34 103M60 75L87 97" fill="none" strokeWidth="9"/></>;
 else art=<><rect x="25" y="12" width="70" height="92" rx="5" fill={studio?'#164E63':'#E2E8F0'}/><path d="M38 35H80M38 50H80M38 65H70M38 80H75" stroke={studio?'#67E8F9':'#334155'}/></>;
 return <svg viewBox="0 0 120 115" role="img" aria-label={concept} style={{width:140,height:130}} stroke={studio?'#CBD5E1':'#1E293B'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{art}</svg>
}
export function VocabCardViewer({cards,onComplete,initialIndex=0,onChange}:{cards:VocabCard[];onComplete?:(id:string)=>void;initialIndex?:number;onChange?:(index:number)=>void}){const [index,setIndex]=useState(initialIndex);const [flipped,setFlipped]=useState(false);const card=cards[Math.min(index,cards.length-1)];useEffect(()=>()=>stopSpeech(),[]);if(!card)return <p>No cards available.</p>;return <section className="card stack"><p>Card {index+1} of {cards.length}</p><ConceptArt concept={card.term}/><h2>{card.term}</h2><p>{card.audioGuide.syllabification} {card.audioGuide.phoneticSpelling}</p><button aria-expanded={flipped} onClick={()=>setFlipped(f=>!f)}>Flip card</button>{flipped&&<div><p>{card.definition}</p><p>{card.exampleSentence}</p><p className="muted">{card.category.theme}</p></div>}<div className="actions"><button onClick={()=>speakText(`${card.term}. ${card.definition}. ${card.exampleSentence}`)}>Listen</button><button onClick={()=>onComplete?.(card.id)}>I know this word</button><button disabled={index===0} onClick={()=>{setIndex(index-1);setFlipped(false);onChange?.(index-1)}}>Previous card</button><button disabled={index===cards.length-1} onClick={()=>{setIndex(index+1);setFlipped(false);onChange?.(index+1)}}>Next card</button></div></section>}
export default VocabCardViewer;
