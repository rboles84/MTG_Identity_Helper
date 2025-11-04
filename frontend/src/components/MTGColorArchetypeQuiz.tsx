import { useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

type Color = 'white' | 'blue' | 'black' | 'red' | 'green';

type Choice = {
  label: string;
  description: string;
  weights: Partial<Record<Color, number>>;
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
    id: 'tempo',
    prompt: 'How do you prefer to set the pace of a Commander game?',
    choices: [
      {
        label: 'Control the table and ration resources',
        description: 'Slow things down with removal, stax, and rule-setting enchantments.',
        weights: { white: 3, blue: 2 },
      },
      {
        label: 'Adapt and counter opponents proactively',
        description: 'Stay reactive with instants, counterspells, and value engines.',
        weights: { blue: 3, black: 1 },
      },
      {
        label: 'Apply relentless pressure',
        description: 'Keep opponents on the back foot with damage and combat triggers.',
        weights: { red: 3, green: 1 },
      },
      {
        label: 'Accelerate into massive threats',
        description: 'Ramp hard and develop a board that threatens to snowball.',
        weights: { green: 3, red: 1 },
      },
    ],
  },
  {
    id: 'interaction',
    prompt: 'Which type of interaction feels most rewarding?',
    choices: [
      {
        label: 'Protecting the team',
        description: 'Flash in solutions, sweep the board, or shield allies.',
        weights: { white: 3, blue: 1 },
      },
      {
        label: 'Countermagic and trickery',
        description: 'Counterspells, bounce, and copying spells mid-stack.',
        weights: { blue: 3 },
      },
      {
        label: 'Targeted removal and sacrifice',
        description: 'Edicts, kill spells, and reanimation loops.',
        weights: { black: 3, white: 1 },
      },
      {
        label: 'Burn, fight, and combat tricks',
        description: 'Direct damage, fight mechanics, and aggressive blowouts.',
        weights: { red: 2, green: 2 },
      },
    ],
  },
  {
    id: 'resource',
    prompt: 'How do you generate long-term advantage?',
    choices: [
      {
        label: 'Token swarms and anthem effects',
        description: 'Create an army and keep it coordinated.',
        weights: { white: 3, green: 2 },
      },
      {
        label: 'Card draw and tutoring',
        description: 'Dig for precise answers and maintain card velocity.',
        weights: { blue: 2, black: 2 },
      },
      {
        label: 'Graveyard recursion',
        description: 'Grind value out of the graveyard and drain opponents.',
        weights: { black: 3, green: 1 },
      },
      {
        label: 'Mana acceleration and ramp',
        description: 'Explode onto the battlefield with extra lands and mana.',
        weights: { green: 3, red: 1 },
      },
    ],
  },
  {
    id: 'table',
    prompt: 'What role do you gravitate toward at a multiplayer table?',
    choices: [
      {
        label: 'Table sheriff',
        description: 'Police explosive plays and keep the game fair for everyone.',
        weights: { white: 3, blue: 1 },
      },
      {
        label: 'Scheming mastermind',
        description: 'Lay traps, accrue inevitability, and strike when it matters.',
        weights: { blue: 2, black: 2 },
      },
      {
        label: 'Agent of chaos',
        description: 'Force action, incite combat, and revel in unpredictability.',
        weights: { red: 3, blue: 1 },
      },
      {
        label: 'Nature’s champion',
        description: 'Amplify your board and crash in with overwhelming force.',
        weights: { green: 3, white: 1 },
      },
    ],
  },
  {
    id: 'wincon',
    prompt: 'When it’s time to close the game, what feels best?',
    choices: [
      {
        label: 'Locking the table out',
        description: 'Assemble a soft lock or pillow-fort while advancing your plan.',
        weights: { white: 2, blue: 2 },
      },
      {
        label: 'Big spell blowouts',
        description: 'Storm turns, extra turns, or copying haymakers.',
        weights: { blue: 2, red: 2 },
      },
      {
        label: 'Drain life totals dry',
        description: 'Combo kills, aristocrats, and resource denial.',
        weights: { black: 3, blue: 1 },
      },
      {
        label: 'Combat damage finale',
        description: 'Overrun effects, double strike, and hasty finishers.',
        weights: { red: 2, green: 2 },
      },
    ],
  },
  {
    id: 'risk',
    prompt: 'How much risk are you comfortable taking?',
    choices: [
      {
        label: 'Mitigate risk and play the long game',
        description: 'Redundant answers, protective shields, and measured plays.',
        weights: { white: 2, blue: 2 },
      },
      {
        label: 'Calculated gambles',
        description: 'Tempo swings, counter-wars, and resource exchanges.',
        weights: { blue: 2, black: 1, red: 1 },
      },
      {
        label: 'High risk, high reward',
        description: 'All-in combos, sacrifice everything for inevitability.',
        weights: { black: 3, red: 1 },
      },
      {
        label: 'Trust in natural growth',
        description: 'Invest in board presence and let inevitability happen.',
        weights: { green: 3, white: 1 },
      },
    ],
  },
  {
    id: 'tabletalk',
    prompt: 'How do you leverage politics at the table?',
    choices: [
      {
        label: 'Forge alliances',
        description: 'Offer protection, share resources, and set up mutual wins.',
        weights: { white: 3, green: 1 },
      },
      {
        label: 'Negotiate information',
        description: 'Bluff, reveal, and manipulate the stack to your favor.',
        weights: { blue: 2, black: 1 },
      },
      {
        label: 'Threaten retaliation',
        description: 'Promise retribution and punish anyone who crosses you.',
        weights: { black: 2, red: 2 },
      },
      {
        label: 'Start fireworks',
        description: 'Encourage brawls and keep the game lively.',
        weights: { red: 3, green: 1 },
      },
    ],
  },
  {
    id: 'aesthetics',
    prompt: 'Pick the deck aesthetic that excites you most.',
    choices: [
      {
        label: 'Knights, angels, and community unity',
        description: 'March in formation and support your allies.',
        weights: { white: 3 },
      },
      {
        label: 'Artifacts, knowledge, and arcane mastery',
        description: 'Assemble engines, tinker with combos, and outthink opponents.',
        weights: { blue: 3 },
      },
      {
        label: 'Demons, zombies, and gothic ambition',
        description: 'Command the macabre and weaponize the grave.',
        weights: { black: 3 },
      },
      {
        label: 'Dragons, elementals, and wild beasts',
        description: 'Let instinct guide you to a triumphant roar.',
        weights: { red: 2, green: 2 },
      },
    ],
  },
];

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

function aggregateScores(answers: Record<string, number>): Record<Color, number> {
  const totals: Record<Color, number> = {
    white: 0,
    blue: 0,
    black: 0,
    red: 0,
    green: 0,
  };

  for (const question of questions) {
    const choiceIndex = answers[question.id];
    if (choiceIndex === undefined) continue;
    const choice = question.choices[choiceIndex];
    for (const [color, weight] of Object.entries(choice.weights)) {
      totals[color as Color] += weight ?? 0;
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

const initialAnswers: Record<string, number> = {};

function MTGColorArchetypeQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => {
    const totalAnswered = Object.keys(answers).length;
    return Math.round((totalAnswered / questions.length) * 100);
  }, [answers]);

  const scores = useMemo(() => aggregateScores(answers), [answers]);

  function handleSelect(questionId: string, choiceIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
    setError(null);
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
                {question.choices.map((choice, index) => {
                  const isActive = selected === index;
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => handleSelect(question.id, index)}
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
      <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
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
