const OPTIMIZED_CARD_EXTENSIONS = {
  "Magistus Chorozo": {
    apiName: "Magistus Chorozo",
    status: "Released-card database entry",
    type: "Fusion Monster",
    race: "Spellcaster",
    attribute: "DARK",
    level: 4,
    atk: 1000,
    def: 2800,
    effect:
      "1 Fusion, Synchro, Xyz, or Link Monster + 1 Spellcaster monster. Must first be Fusion Summoned, or Special Summoned from the Extra Deck by sending the correct Fusion Materials you control to the GY. Once per turn, when a monster declares an attack, it can negate that attack, gain that monster's ATK until the end of the turn, then return that monster to the hand.",
    role:
      "Compact Dark Magician Extra Deck converter and combat-control Fusion.",
  },
  "Master of Chaos": {
    apiName: "Master of Chaos",
    status: "Released-card database entry",
    type: "Fusion Monster",
    race: "Spellcaster",
    attribute: "DARK",
    level: 8,
    atk: 3000,
    def: 2500,
    effect:
      '"Dark Magician" + 1 "Chaos" or "Black Luster Soldier" Ritual Monster. On Fusion Summon, it can revive a LIGHT or DARK monster. It can Tribute a LIGHT and DARK monster to banish all opposing monsters. If this Fusion Summoned card is destroyed, it can recover a Spell from the GY.',
    role:
      "Dark Magician Fusion payoff with revival, mass banishment, and Spell recovery.",
  },
  "Rahamu, Envoy of the Sacred Tome": {
    apiName: "Rahamu, Envoy of the Sacred Tome",
    status: "Released-card database entry",
    type: "Link Monster",
    race: "Fairy",
    attribute: "DARK",
    linkval: 2,
    atk: 1400,
    effect:
      "2 Effect Monsters. Once while Link Summoned and face-up, it grants a Normal Summon of a Level 5 or higher monster without Tributing. During the Main Phase, it can immediately Normal Summon a Level 5 or higher DARK monster. During the End Phase, it can return revealed monsters from the hand to the bottom of the Deck and draw the same number.",
    role:
      "Chaos Ritual Link bridge that unlocks its high-Level Normal Summons and can exchange stranded monsters for fresh draws.",
  },
  "Toon Dark Magician Girl": {
    apiName: "Toon Dark Magician Girl",
    status: "Released-card database entry",
    type: "Toon Monster",
    race: "Spellcaster",
    attribute: "DARK",
    level: 6,
    atk: 2000,
    def: 1700,
    effect:
      "Cannot be Normal Summoned or Set. It must first be Special Summoned by Tributing 1 monster while Toon World is controlled. It can attack directly unless the opponent controls a Toon monster, and gains 300 ATK for every Dark Magician or Magician of Black Chaos in either Graveyard.",
    role:
      "Toon Turbo's immediate direct attacker and Level 6 Spellcaster extender.",
  },
  "Toon Table of Contents": {
    apiName: "Toon Table of Contents",
    status: "Released-card database entry",
    type: "Spell Card",
    race: "Normal",
    effect: 'Add 1 "Toon" card from the Deck to the hand.',
    role:
      "Universal Toon search card that converts into the engine piece or interaction the hand needs.",
  },
  "Dominus Spark": {
    apiName: "Dominus Spark",
    status: "Released-card database entry",
    type: "Trap Card",
    race: "Normal",
    effect:
      "During a turn in which the opponent activated a monster effect in the hand or Graveyard, this card can be activated from the hand. It targets and banishes an opposing monster, then may let the opponent Special Summon from the hand if there are no Traps in its controller's Graveyard. Activating it from the hand locks that player out of EARTH, WATER, FIRE, and WIND monster effects for the rest of the Duel.",
    role:
      "Powerful hand-activated monster removal whose permanent Attribute lock must be accounted for by the autonomous pilot.",
  },
};
