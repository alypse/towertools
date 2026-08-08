import bossIcon from '../assets/apps/boss.webp';
import botIcon from '../assets/apps/bot.webp';
import cardsIcon from '../assets/apps/cards.webp';
import cellIcon from '../assets/apps/cell.webp';
import coinIcon from '../assets/apps/coin.webp';
import elsSimulatorIcon from '../assets/apps/els_simulator.webp';
import labIcon from '../assets/apps/lab.webp';
import labPlannerIcon from '../assets/apps/lab_planner.webp';
import lscIcon from '../assets/apps/lsc.webp';
import modsIcon from '../assets/apps/mods.webp';
import moduleTrackerIcon from '../assets/apps/module-tracker.webp';
import mvnIcon from '../assets/apps/mvn.webp';
import stoneIcon from '../assets/apps/stone.webp';
import thetowerlolIcon from '../assets/apps/thetowerlol.png';
import towerstarIcon from '../assets/apps/towerstar.webp';
import uwIcon from '../assets/apps/uw.webp';
import wsIcon from '../assets/apps/ws.webp';
import diceIcon from '../assets/apps/dice.png';

export const APPLIST = {
  name: 'Apps',
  apps: [
    {
      id: 0,
      name: "Skye's Tool Thread",
      icon: towerstarIcon,
      description: "Skye's Tool Thread - The source of trurth for all things Tower and Skye! CDs nutz gottem.",
      url: 'https://discord.com/channels/850137217828388904/1241233346894364813/1241233350782353408',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 1,
      name: 'What Tier Should I Farm?',
      icon: coinIcon,
      description:
        'Use this to track your farm runs and figure out where you should be farming, as well as graph/analyze phases during the course of a run to optimize individual phases.',
      url: 'https://what-tier-should-i-farm.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 2,
      name: 'Enemy Stats Calculator',
      icon: bossIcon,
      description: 'Check enemy stats at any wave in any tier, and quickly figure out what wave has comparable stats in other tiers.',
      url: 'https://tower-enemy-stats.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 3,
      name: 'Lab Calculator',
      icon: labIcon,
      description:
        'Look up lab costs, plan out your entire lab progress, optimize how far to run your lab speed. Use "Show Costs" to look at Lab Speed/Discount labs or to look at times with Speedup applied.',
      url: 'https://tower-lab-calculator.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 4,
      name: 'Workshop Calculator',
      icon: wsIcon,
      description:
        "Look up / calculate the cost for workshop upgrades and workshop enhancements. Figure out which upgrade will save you the most cash to max everything per coin spent. See a quick overview to share your build with others and see a breakdown of how many coins you've spent. This helps plan your Coin spend in your workshop.",
      url: 'https://tower-workshop-calculator.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 5,
      name: 'Module Calculator',
      icon: modsIcon,
      description:
        'Look up and compare module costs and values between various levels at each rarity, figure out how long it will take you to level them up, see how high they would be with a different shard discount, and calculate weekly shard income.',
      url: 'https://tower-module-calculator.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 6,
      name: 'Stone Calculator',
      icon: stoneIcon,
      description:
        "Calculate the cost and time it will take to upgrade your UW to various levels, look at tables of their overall costs, look at UW+ upgrade costs, see how much you've spent on each thing, calculate GT+ Combo bonus, and compare ROI of each GT+ level.",
      url: 'https://tower-stone-calculator.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 7,
      name: 'Bot Calculator',
      icon: botIcon,
      description: "Calculate the cost and time it will take to upgrade your bots to various levels and see how much you've spent.",
      url: 'https://tower-bot-calculator.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 8,
      name: 'Cell Calculator',
      icon: cellIcon,
      description: 'Estimate your cell income on each tier to compare which one is better, analyze cells/kill roi, and simulate cell farming results.',
      url: 'https://tower-cell-calculator.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 9,
      name: 'Tournament Results',
      icon: thetowerlolIcon,
      description: 'Tournament results for The Tower.',
      url: 'https://thetower.lol/',
      author: 'this_guy',
      status: 'Supported',
    },
    {
      id: 10,
      name: 'Multiverse Calculator',
      icon: mvnIcon,
      description: 'Calculate the synchronized cooldowns with Multiverse Nexus Core Module, including mod and substat qualities.',
      url: 'https://mvn.thetower.tools/',
      author: 'Alypse',
      status: 'Supported',
    },
    {
      id: 11,
      name: 'Card Tracker',
      icon: cardsIcon,
      description: 'Track your card collection, see how many gems have been spent and are remaining to spend on cards.',
      url: 'https://tower-card-tracker.vercel.app/',
      author: 'Hazy',
      status: 'Supported',
    },
    {
      id: 12,
      name: 'Lab-Speedup Calculator',
      icon: lscIcon,
      description: 'Experiment with different lab speed-up setups and find out how many cells it will cost.',
      url: 'https://tower-lab-speedup-calc.vercel.app/',
      author: 'Hazy',
      status: 'Supported',
    },
    {
      id: 13,
      name: 'What UW Should I Pick?',
      icon: uwIcon,
      description:
        'Consult this before picking any UW for an up to date suggestion on which one you should pick given your current owned UW and options, as well as a description of the use of each UW, their + upgrades, and important module synergies.',
      url: 'https://what-uw-should-i-pick.netlify.app/',
      author: 'Skye',
      status: 'Supported',
    },
    {
      id: 14,
      name: 'Lab Planner',
      icon: labPlannerIcon,
      description: 'Plan your lab time in advance to counter goldfish memory issues!',
      url: 'https://tower-lab-planner.vercel.app/',
      author: 'Hazy',
      status: 'Supported',
    },
    {
      id: 15,
      name: 'Enemy Level Skip Simulator',
      icon: elsSimulatorIcon,
      description:
        'Simulate Enemy Level Skips for a run to get an accurate idea of how many skips to expect.  Accounts for freeups, cash purchased levels, and more.',
      url: 'https://towerels.pythonanywhere.com/',
      author: 'Andy1292',
      status: 'Supported',
    },
    {
      id: 16,
      name: 'Module Tracker',
      icon: moduleTrackerIcon,
      description: 'Track your modules statistics and gems spent.',
      url: 'https://tower-module-tracker.vercel.app/',
      author: 'Hazy',
      status: 'Supported',
    },
    {
      id: 17,
      name: 'Substat Calculator',
      icon: diceIcon,
      description: 'Calculate and plan the substats of your mods.',
      url: 'https://substat-calculator.netlify.app/',
      author: 'Zanny',
      type: 'app',
      status: 'Supported',
    },
  ],
};
