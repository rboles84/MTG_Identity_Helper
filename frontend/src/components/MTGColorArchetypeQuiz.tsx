import { useEffect, useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

type Color = 'white' | 'blue' | 'black' | 'red' | 'green';

type ChoiceKey = 'A' | 'B' | 'C';

type Choice = {
  key: ChoiceKey;
  label: string;
  description: string;
};

type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
};

type CommanderRecommendation = {
  identity: string;
  title: string;
  subtitle: string;
  summary: string;
};

type Result = {
  identityKey: string;
  colors: Color[];
  scores: Record<Color, number>;
  commander: CommanderRecommendation;
};

const colorDetails: Record<Color, { label: string; gradient: string; description: string }> = {
  white: {
    label: 'White',
    gradient: 'from-amber-200/80 via-amber-300/80 to-amber-200/80',
    description: 'Order, balance, community, and structure.',
  },
  blue: {
    label: 'Blue',
    gradient: 'from-sky-300/80 via-blue-400/80 to-sky-300/80',
    description: 'Knowledge, control, and inevitability.',
  },
  black: {
    label: 'Black',
    gradient: 'from-slate-700/80 via-slate-900/80 to-slate-800/80',
    description: 'Ambition, recursion, and ruthless efficiency.',
  },
  red: {
    label: 'Red',
    gradient: 'from-rose-400/80 via-red-500/80 to-orange-400/80',
    description: 'Emotion, velocity, and explosive finishers.',
  },
  green: {
    label: 'Green',
    gradient: 'from-emerald-400/80 via-green-500/80 to-teal-400/80',
    description: 'Growth, resilience, and overwhelming board presence.',
  },
};

const questions: Question[] = [
  {
    id: 'opening_hand',
    prompt: 'When you fan open an opening hand, what makes you nod with confidence?',
    choices: [
      {
        key: 'A',
        label: 'A. Efficient answers and patient resource development',
        description: 'You want early interaction and smoothing spells so the game starts on your terms.',
      },
      {
        key: 'B',
        label: 'B. Card selection and incremental advantages',
        description: 'Tutors, cantrips, and subtle engines set up the value you plan to harvest later.',
      },
      {
        key: 'C',
        label: 'C. Explosive mana and proactive threats',
        description: 'Ramp pieces and hard-hitting creatures mean you get to dictate tempo immediately.',
      },
    ],
  },
  {
    id: 'midgame_plan',
    prompt: 'As the table develops, how do you like to steer the mid-game?',
    choices: [
      {
        key: 'A',
        label: 'A. Build an efficient board machine',
        description: 'Tokens, counters, and support effects keep your formation solid and helpful.',
      },
      {
        key: 'B',
        label: 'B. Keep the stack lively and unpredictable',
        description: 'You prefer a flurry of instants and tempo plays that reward quick thinking.',
      },
      {
        key: 'C',
        label: 'C. Pressure life totals relentlessly',
        description: 'Sacrifice outlets, burn, and aggressive creatures keep everyone on the back foot.',
      },
    ],
  },
  {
    id: 'win_condition',
    prompt: 'What does a satisfying win look like to you?',
    choices: [
      {
        key: 'A',
        label: 'A. Slowly drain away resistance',
        description: 'Attrition, taxation, and inevitability grind out the final life points.',
      },
      {
        key: 'B',
        label: 'B. Triumph with coordinated combat',
        description: 'A disciplined strike team or battalion closes the door with precision swings.',
      },
      {
        key: 'C',
        label: 'C. Overwhelm with recursion and growth',
        description: 'Graveyard engines and resilient threats make removal feel pointless.',
      },
    ],
  },
  {
    id: 'table_politics',
    prompt: 'Table politics flare up. What is your instinctive move?',
    choices: [
      {
        key: 'A',
        label: 'A. Negotiate from a calm position of control',
        description: 'Offer protection, propose ceasefires, and keep order through diplomacy.',
      },
      {
        key: 'B',
        label: 'B. Broker deals that advance everyone',
        description: 'Leverage shared growth, card draw, and collective ramp to earn trust.',
      },
      {
        key: 'C',
        label: 'C. Wield threats as leverage',
        description: 'Make it clear that crossing you leads to immediate consequences.',
      },
    ],
  },
  {
    id: 'problem_solving',
    prompt: 'A player threatens to combo off. How do you respond?',
    choices: [
      {
        key: 'A',
        label: 'A. Rally defenses and lock the table down',
        description: 'Protective permanents and team-wide buffs shield against sudden swings.',
      },
      {
        key: 'B',
        label: 'B. Dig for precise interaction',
        description: 'You rely on card selection to find the exact countermeasure you need.',
      },
      {
        key: 'C',
        label: 'C. Turn up the pressure immediately',
        description: 'Force opponents onto the back foot with combat and damage to end the game first.',
      },
    ],
  },
  {
    id: 'deck_aesthetic',
    prompt: 'Which deck aesthetic are you most excited to sleeve up?',
    choices: [
      {
        key: 'A',
        label: 'A. Gothic cathedrals and solemn rituals',
        description: 'Themes of duty, retribution, and carefully orchestrated order speak to you.',
      },
      {
        key: 'B',
        label: 'B. Verdant laboratories and living spells',
        description: 'Organic growth meets arcane experimentation in your ideal deck vibe.',
      },
      {
        key: 'C',
        label: 'C. Martial banners and heroic charge',
        description: 'You love the spectacle of warriors, dragons, and blazing battlefields.',
      },
    ],
  },
  {
    id: 'comeback',
    prompt: 'When you fall behind, what is the comeback plan?',
    choices: [
      {
        key: 'A',
        label: 'A. Establish layered defenses',
        description: 'Board wipes, protection, and clean answers reset the pace in your favor.',
      },
      {
        key: 'B',
        label: 'B. Lean on inevitability from the graveyard',
        description: 'Value engines recycle key permanents until you reassemble your engine.',
      },
      {
        key: 'C',
        label: 'C. Intimidate the table with explosive plays',
        description: 'Revenge triggers and burn make opponents think twice about finishing you off.',
      },
    ],
  },
  {
    id: 'toolkit',
    prompt: 'What is your Commander toolkit without fail?',
    choices: [
      {
        key: 'A',
        label: 'A. Tutors for enchantments and utility creatures',
        description: 'You ensure the right silver bullets are always within reach.',
      },
      {
        key: 'B',
        label: 'B. Instant-speed tricks and spell copying',
        description: 'You stockpile reactive tools that scale with every cast.',
      },
      {
        key: 'C',
        label: 'C. Ramp, haste, and combat upgrades',
        description: 'Mana bursts and battle-ready boosters keep your threats lethal.',
      },
    ],
  },
];

const scoringMap: Record<string, Record<ChoiceKey, Color[]>> = {
  opening_hand: {
    A: ['white', 'blue'],
    B: ['blue', 'black'],
    C: ['red', 'green'],
  },
  midgame_plan: {
    A: ['white', 'green'],
    B: ['blue', 'red'],
    C: ['black', 'red'],
  },
  win_condition: {
    A: ['white', 'black'],
    B: ['white', 'red'],
    C: ['black', 'green'],
  },
  table_politics: {
    A: ['white', 'blue'],
    B: ['green', 'blue'],
    C: ['black', 'red'],
  },
  problem_solving: {
    A: ['white', 'green'],
    B: ['blue', 'black'],
    C: ['red', 'green'],
  },
  deck_aesthetic: {
    A: ['white', 'black'],
    B: ['green', 'blue'],
    C: ['white', 'red'],
  },
  comeback: {
    A: ['white', 'blue'],
    B: ['black', 'green'],
    C: ['black', 'red'],
  },
  toolkit: {
    A: ['white', 'green'],
    B: ['blue', 'red'],
    C: ['red', 'green'],
  },
};

const commanderRecommendations: Record<string, CommanderRecommendation> = {
  W: {
    identity: 'W',
    title: "Light-Paws, Emperor's Voice",
    subtitle: 'Voltron value with protective auras.',
    summary: 'Lean into supportive enchantments and combat tricks while defending allies.',
  },
  U: {
    identity: 'U',
    title: 'Talrand, Sky Summoner',
    subtitle: 'Instant-speed mastery and flying token pressure.',
    summary: 'Every counterspell builds an army while you dictate the stack.',
  },
  B: {
    identity: 'B',
    title: 'K\'rrik, Son of Yawgmoth',
    subtitle: 'Life is a resource and the graveyard is your hand.',
    summary: 'Convert life into overwhelming tempo swings and recursion loops.',
  },
  R: {
    identity: 'R',
    title: 'Torbran, Thane of Red Fell',
    subtitle: 'Each spark becomes a blaze.',
    summary: 'Win via combat and direct damage amplified with every source.',
  },
  G: {
    identity: 'G',
    title: 'Azusa, Lost but Seeking',
    subtitle: 'Lands, lands, and more lands.',
    summary: 'Accelerate mana to drop oversized threats ahead of schedule.',
  },
  WB: {
    identity: 'W B',
    title: 'Teysa Karlov',
    subtitle: 'Death triggers pay dividends.',
    summary: 'Double up aristocrat triggers while you govern the table.',
  },
  WR: {
    identity: 'W R',
    title: 'Aurelia, the Warleader',
    subtitle: 'Lead charge after charge until opponents fall.',
    summary: 'Multiple combat steps turn a disciplined army into a blazing victory.',
  },
  UB: {
    identity: 'U B',
    title: 'Yuriko, the Tiger\'s Shadow',
    subtitle: 'Ninja infiltration meets top-deck control.',
    summary: 'Chip away with unblockable threats while stacking huge reveals.',
  },
  UR: {
    identity: 'U R',
    title: 'Veyran, Voice of Duality',
    subtitle: 'Prowess turns every spell into lethal damage.',
    summary: 'Copy instants and sorceries to scale your arcane barrage.',
  },
  UG: {
    identity: 'U G',
    title: 'Tatyova, Benthic Druid',
    subtitle: 'Every land drop is card advantage.',
    summary: 'Ramp, draw, and overwhelm with a tide of resources.',
  },
  WG: {
    identity: 'W G',
    title: 'Sigarda, Heron\'s Grace',
    subtitle: 'Protect the team while scaling a resilient board.',
    summary: 'Blend tokens, anthem effects, and hexproof shields for inevitability.',
  },
  BR: {
    identity: 'B R',
    title: 'Anje Falkenrath',
    subtitle: 'Madness-fueled velocity.',
    summary: 'Loot furiously, combo off, and recur threats from the grave.',
  },
  BG: {
    identity: 'B G',
    title: 'Meren of Clan Nel Toth',
    subtitle: 'Experience counters loop your best creatures.',
    summary: 'Sacrifice for value, then recur crucial creatures each turn.',
  },
  RG: {
    identity: 'R G',
    title: 'Xenagos, God of Revels',
    subtitle: 'Hasty power-multiplying party god.',
    summary: 'Buff a massive attacker every combat for explosive damage.',
  },
  WU: {
    identity: 'W U',
    title: 'Brago, King Eternal',
    subtitle: 'Value engines reset every combat step.',
    summary: 'Blink your best permanents and lock in incremental advantage.',
  },
  WUR: {
    identity: 'W U R',
    title: 'Kykar, Wind\'s Fury',
    subtitle: 'Spells become spirit armies and mana.',
    summary: 'Noncreature spells generate evasive threats and ramp simultaneously.',
  },
  WUB: {
    identity: 'W U B',
    title: 'Aminatou, the Fateshifter',
    subtitle: 'Manipulate fate with effortless blink lines.',
    summary: 'Top-deck control mixes with blink and combo potential.',
  },
  WBG: {
    identity: 'W B G',
    title: 'Nethroi, Apex of Death',
    subtitle: 'Mutate recursion with toolbox flexibility.',
    summary: 'Reanimate utility creatures and grind value each mutation.',
  },
  WRG: {
    identity: 'W R G',
    title: 'Marath, Will of the Wild',
    subtitle: 'Adaptable counters and combat leverage.',
    summary: 'Flex between tokens, removal, and combat math.',
  },
  UBR: {
    identity: 'U B R',
    title: 'Kess, Dissident Mage',
    subtitle: 'Flashback every turn for endless storms.',
    summary: 'Recast your graveyard to dominate the stack and finish explosively.',
  },
  UBG: {
    identity: 'U B G',
    title: 'Muldrotha, the Gravetide',
    subtitle: 'Permanent recursion each turn cycle.',
    summary: 'Grind advantage from the graveyard while answering threats.',
  },
  URG: {
    identity: 'U R G',
    title: 'Animar, Soul of Elements',
    subtitle: 'Creature combo with elemental resilience.',
    summary: 'Cheat on creature costs and loop value engines to overwhelm the board.',
  },
  BRG: {
    identity: 'B R G',
    title: 'Korvold, Fae-Cursed King',
    subtitle: 'Sacrifice feeds your unstoppable draw engine.',
    summary: 'Treasure, food, and token fodder become cards and counters.',
  },
  WUG: {
    identity: 'W U G',
    title: 'Roon of the Hidden Realm',
    subtitle: 'Blink value with a protective body.',
    summary: 'Flicker utility creatures and lock up the board.',
  },
  WBR: {
    identity: 'W B R',
    title: 'Isshin, Two Heavens as One',
    subtitle: 'Double the trigger, double the trouble.',
    summary: 'Aggressive combat triggers and go-wide strategies shine here.',
  },
  WUBR: {
    identity: 'W U B R',
    title: 'Breya, Etherium Shaper',
    subtitle: 'Artifact combo queen of the shard.',
    summary: 'Leverage artifacts for flexible removal, token swarms, and explosive combos.',
  },
  WUBG: {
    identity: 'W U B G',
    title: 'Atraxa, Praetors\' Voice',
    subtitle: 'The queen of value engines and counter synergies.',
    summary: 'Combine control, recursion, and board presence seamlessly.',
  },
  UBRG: {
    identity: 'U B R G',
    title: 'Yidris, Maelstrom Wielder',
    subtitle: 'Cascade chaos with pinpoint follow-through.',
    summary: 'Connect in combat to cascade multiple spells and snowball value.',
  },
  WBRG: {
    identity: 'W B R G',
    title: 'Saskia the Unyielding',
    subtitle: 'Combat aggression with a political twist.',
    summary: 'Point Saskia wisely to multiply combat damage output.',
  },
  WURG: {
    identity: 'W U R G',
    title: 'Kynaios and Tiro of Meletis',
    subtitle: 'Group hug with precise tempo control.',
    summary: 'Share resources to steer the table while setting up your own finish.',
  },
  FIVE: {
    identity: 'W U B R G',
    title: 'Kenrith, the Returned King',
    subtitle: 'Every ability in one charismatic package.',
    summary: 'Customize your game plan every time you shuffle up.',
  },
};

function normalizeIdentityKey(colors: Color[]): string {
  const map: Record<Color, string> = {
    white: 'W',
    blue: 'U',
    black: 'B',
    red: 'R',
    green: 'G',
  };
  const order = ['W', 'U', 'B', 'R', 'G'];

  return colors
    .map((color) => map[color])
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .join('');
}

function resolveCommander(identityKey: string, colors: Color[]): CommanderRecommendation {
  const direct = commanderRecommendations[identityKey];
  if (direct) {
    return direct;
  }

  if (colors.length === 0) {
    return {
      identity: 'Colorless',
      title: 'Karn, the Great Creator',
      subtitle: 'A toolbox of artifacts awaits.',
      summary: 'Lean on artifacts and utility lands to cover every weakness.',
    };
  }

  if (colors.length === 1) {
    return commanderRecommendations[identityKey] ?? commanderRecommendations.W;
  }

  if (colors.length >= 4) {
    return commanderRecommendations.FIVE;
  }

  return {
    identity: colors
      .map((color) => colorDetails[color].label)
      .join(', '),
    title: 'Partner Pairing',
    subtitle: 'Combine colors to fit your unique playstyle.',
    summary: 'Consider partner commanders or hybrid shells to express all aspects of your plan.',
  };
}

function aggregateScores(answers: Record<string, ChoiceKey>): Record<Color, number> {
  const totals: Record<Color, number> = {
    white: 0,
    blue: 0,
    black: 0,
    red: 0,
    green: 0,
  };

  for (const [questionId, choiceKey] of Object.entries(answers)) {
    const colorPair = scoringMap[questionId]?.[choiceKey];
    if (!colorPair) continue;
    for (const color of colorPair) {
      totals[color] += 1;
    }
  }

  return totals;
}

function determineIdentity(scores: Record<Color, number>): Color[] {
  const entries = Object.entries(scores) as [Color, number][];
  const maxScore = Math.max(...entries.map(([, value]) => value));
  if (maxScore <= 0) {
    return [];
  }

  const significant = entries
    .filter(([, value]) => maxScore - value <= 2 && value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  return significant.slice(0, 5);
}

function formatIdentityLabel(colors: Color[]): string {
  if (!colors.length) {
    return 'Colorless';
  }

  return colors.map((color) => colorDetails[color].label).join(' / ');
}

const initialAnswers: Record<string, ChoiceKey> = {};

const STORAGE_KEY = 'mtg-color-archetype-answers';

type AnswerMap = Record<string, ChoiceKey>;

const PRESET_ANSWER_SETS: { id: string; label: string; answers: AnswerMap }[] = [
  {
    id: 'azorius-control',
    label: 'Azorius Control (W/U)',
    answers: {
      opening_hand: 'A',
      midgame_plan: 'A',
      win_condition: 'A',
      table_politics: 'A',
      problem_solving: 'A',
      deck_aesthetic: 'A',
      comeback: 'A',
      toolkit: 'A',
    },
  },
  {
    id: 'rakdos-aristocrats',
    label: 'Rakdos Aristocrats (B/R)',
    answers: {
      opening_hand: 'C',
      midgame_plan: 'C',
      win_condition: 'C',
      table_politics: 'C',
      problem_solving: 'C',
      deck_aesthetic: 'C',
      comeback: 'C',
      toolkit: 'C',
    },
  },
  {
    id: 'selesnya-ramp',
    label: 'Selesnya Ramp (W/G)',
    answers: {
      opening_hand: 'A',
      midgame_plan: 'A',
      win_condition: 'B',
      table_politics: 'B',
      problem_solving: 'A',
      deck_aesthetic: 'B',
      comeback: 'B',
      toolkit: 'A',
    },
  },
];

function sanitizeAnswers(candidate: Partial<Record<string, ChoiceKey>> | null | undefined): AnswerMap {
  const sanitized: AnswerMap = {};

  if (!candidate) {
    return sanitized;
  }

  for (const question of questions) {
    const value = candidate[question.id];
    if (typeof value === 'string') {
      const validKeys = new Set(question.choices.map((choice) => choice.key));
      if (validKeys.has(value as ChoiceKey)) {
        sanitized[question.id] = value as ChoiceKey;
      }
    }
  }

  return sanitized;
}

function encodeAnswersToHashString(answers: AnswerMap): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const json = JSON.stringify(answers);
  return window.btoa(encodeURIComponent(json));
}

function decodeAnswersFromHashString(encoded: string): AnswerMap | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const json = decodeURIComponent(window.atob(encoded));
    const parsed = JSON.parse(json) as Partial<Record<string, ChoiceKey>>;
    const sanitized = sanitizeAnswers(parsed);
    return Object.keys(sanitized).length ? sanitized : null;
  } catch (error) {
    return null;
  }
}

function loadAnswersFromLocalStorage(): AnswerMap | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<Record<string, ChoiceKey>>;
    const sanitized = sanitizeAnswers(parsed);
    return Object.keys(sanitized).length ? sanitized : null;
  } catch (error) {
    return null;
  }
}

function buildShareableLink(answers: AnswerMap): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const sanitized = sanitizeAnswers(answers);
  const encoded = Object.keys(sanitized).length ? encodeAnswersToHashString(sanitized) : '';
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${encoded ? `#${encoded}` : ''}`;
}

function MTGColorArchetypeQuiz() {
  const [answers, setAnswers] = useState<Record<string, ChoiceKey>>(initialAnswers);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hashValue = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;

    if (hashValue) {
      const decoded = decodeAnswersFromHashString(hashValue);
      if (decoded) {
        setAnswers(decoded);
        return;
      }
    }

    const stored = loadAnswersFromLocalStorage();
    if (stored) {
      setAnswers(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const sanitized = sanitizeAnswers(answers);
    const hasAnswers = Object.keys(sanitized).length > 0;

    if (hasAnswers) {
      const encoded = encodeAnswersToHashString(sanitized);
      if (window.location.hash.slice(1) !== encoded) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, '', `${pathname}${search}#${encoded}`);
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } else {
      if (window.location.hash) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, '', `${pathname}${search}`);
      }
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [answers]);

  useEffect(() => {
    if (!status || typeof window === 'undefined') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatus(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [status]);

  const progress = useMemo(() => {
    const totalAnswered = Object.keys(answers).length;
    return Math.round((totalAnswered / questions.length) * 100);
  }, [answers]);

  const scores = useMemo(() => aggregateScores(answers), [answers]);

  function handleSelect(questionId: string, choiceKey: ChoiceKey) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceKey }));
    setError(null);
    setStatus(null);
  }

  function handleSubmit() {
    if (Object.keys(answers).length !== questions.length) {
      setError('Answer every question to unlock your color identity.');
      return;
    }

    const colors = determineIdentity(scores);
    const identityKey = normalizeIdentityKey(colors);
    const commander = resolveCommander(identityKey, colors);

    setResult({ identityKey, colors, scores, commander });
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
    setError(null);
    setStatus('Quiz reset. Start fresh!');
  }

  async function handleCopyShareLink() {
    if (Object.keys(answers).length === 0) {
      setStatus('Select some answers to generate a shareable link.');
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const link = buildShareableLink(answers);

    try {
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        copied = true;
      } else if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copied = true;
      }

      if (!copied) {
        throw new Error('Clipboard unavailable');
      }

      setStatus('Shareable link copied to clipboard.');
    } catch (error) {
      setStatus(`Copy failed. You can manually copy this link: ${link}`);
    }
  }

  function handleExportResult() {
    if (!result) {
      setStatus('Reveal your identity before exporting results.');
      return;
    }

    if (typeof document === 'undefined' || typeof URL === 'undefined') {
      setStatus('Export is not supported in this environment.');
      return;
    }

    const payload = {
      answers: sanitizeAnswers(answers),
      scores,
      result,
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mtg-color-identity-result.json';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    setStatus('Result exported as JSON.');
  }

  function handleApplyPreset() {
    const preset = PRESET_ANSWER_SETS.find((option) => option.id === selectedPresetId);
    if (!preset) {
      setStatus('Choose a preset to load answers.');
      return;
    }

    setAnswers({ ...preset.answers });
    setResult(null);
    setError(null);
    setStatus(`Loaded preset answers: ${preset.label}.`);
  }

  return (
    <Card className="w-full border-slate-800/60 bg-slate-900/80 backdrop-blur">
      <CardHeader className="border-b border-slate-800/40">
        <CardTitle className="text-3xl font-semibold text-primary">
          Color Archetype Quiz
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Answer a series of thematic prompts to reveal which Commander color identity resonates
          with your preferred playstyle.
        </CardDescription>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-emerald-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {questions.map((question) => {
          const selected = answers[question.id];
          return (
            <div key={question.id} className="space-y-4 rounded-lg border border-slate-800/60 p-5">
              <div>
                <p className="text-lg font-semibold text-slate-100">{question.prompt}</p>
                <p className="text-sm text-muted-foreground">
                  Choose the option that best mirrors your instincts.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {question.choices.map((choice) => {
                  const isActive = selected === choice.key;
                  return (
                    <button
                      key={choice.key}
                      type="button"
                      onClick={() => handleSelect(question.id, choice.key)}
                      className={`group flex flex-col items-start gap-2 rounded-xl border px-4 py-4 text-left transition hover:border-primary/70 hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive ? 'border-primary/80 bg-slate-800/80 shadow-lg' : 'border-slate-800/80'
                      }`}
                    >
                      <span className="text-base font-medium text-slate-100">{choice.label}</span>
                      <span className="text-sm text-muted-foreground">{choice.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {error ? <p className="text-sm font-medium text-red-400">{error}</p> : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="flex-1 rounded-lg border border-slate-700/80 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-slate-500 hover:text-slate-200"
          >
            Copy Share Link
          </button>
          <button
            type="button"
            onClick={handleExportResult}
            className="flex-1 rounded-lg border border-slate-700/80 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-slate-500 hover:text-slate-200"
          >
            Export Result JSON
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={selectedPresetId}
            onChange={(event) => setSelectedPresetId(event.target.value)}
            className="flex-1 rounded-lg border border-slate-800/80 bg-slate-900 px-4 py-2 text-sm text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Sample answer strings</option>
            {PRESET_ANSWER_SETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleApplyPreset}
            className="rounded-lg border border-slate-700/80 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-slate-500 hover:text-slate-200"
          >
            Load Answers
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 rounded-lg border border-slate-700/80 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-slate-500 hover:text-slate-200"
          >
            Reset Quiz
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-110"
          >
            Reveal Identity
          </button>
        </div>
        {status ? <p className="text-sm font-medium text-primary/90">{status}</p> : null}
      </CardFooter>
      {result ? (
        <div className="space-y-6 border-t border-slate-800/50 bg-slate-950/80 p-6">
          <h3 className="text-2xl font-semibold text-primary">Your Commander Identity</h3>
          <div className="flex flex-wrap gap-3">
            {result.colors.map((color) => (
              <div
                key={color}
                className={`flex min-w-[140px] flex-1 flex-col gap-1 rounded-lg bg-gradient-to-br ${colorDetails[color].gradient} p-4 text-slate-950`}
              >
                <span className="text-lg font-bold">{colorDetails[color].label}</span>
                <span className="text-xs font-medium uppercase tracking-wider">
                  {colorDetails[color].description}
                </span>
                <span className="text-xs font-semibold">
                  Score: {result.scores[color].toFixed(0)}
                </span>
              </div>
            ))}
            {result.colors.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-muted-foreground">
                No dominant color detected — your answers were perfectly balanced or undecided.
              </div>
            ) : null}
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Suggested Commander ({result.commander.identity})
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {result.commander.title}
            </p>
            <p className="text-base text-primary/90">{result.commander.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {result.commander.summary}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Identity Summary
            </p>
            <p className="mt-2 text-lg text-slate-100">{formatIdentityLabel(result.colors)}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Use these color insights to guide deckbuilding — from mana base decisions to spell
              selection and win condition planning.
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

export default MTGColorArchetypeQuiz;
