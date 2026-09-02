import { DRILLS, formatPrescription, toWorkoutCategory, type Drill } from "@/lib/program";

export type Routine = {
  id: string;
  name: string;
  focus: string;
  minutes: number;
  level: "Beginner" | "All levels" | "Advanced";
  description: string;
  drillIds: string[];
};

export const ROUTINES: Routine[] = [
  {
    id: "hitting_power",
    name: "Power Hitting Session",
    focus: "Hitting",
    minutes: 55,
    level: "All levels",
    description: "Build bat speed and exit velocity with tee work, front toss and med ball power.",
    drillIds: [
      "dynamic_warmup",
      "tee_work",
      "front_toss",
      "exit_velo_drills",
      "med_ball_rot_throws",
      "cool_down",
    ],
  },
  {
    id: "hitting_contact",
    name: "Contact & Approach",
    focus: "Hitting",
    minutes: 45,
    level: "Beginner",
    description: "Clean mechanics, barrel control and situational at-bats.",
    drillIds: ["dynamic_warmup", "soft_toss", "opposite_field_drills", "situational_hitting", "cool_down"],
  },
  {
    id: "arm_care",
    name: "Arm Care & Long Toss",
    focus: "Throwing",
    minutes: 40,
    level: "All levels",
    description: "Protect the arm and add velocity with a structured throwing progression.",
    drillIds: [
      "dynamic_warmup",
      "band_external_rotations",
      "long_toss_program",
      "throwing_accuracy",
      "mobility_recovery",
    ],
  },
  {
    id: "infield_defense",
    name: "Infield Defense Block",
    focus: "Fielding",
    minutes: 50,
    level: "All levels",
    description: "Footwork, hands and game-speed reps for infielders.",
    drillIds: [
      "dynamic_warmup",
      "ground_ball_fundamentals",
      "forehand_backhand",
      "short_hop_drills",
      "double_play_footwork",
      "cool_down",
    ],
  },
  {
    id: "outfield_defense",
    name: "Outfield Reads & Routes",
    focus: "Fielding",
    minutes: 45,
    level: "All levels",
    description: "Drop steps, tracking fly balls and throwing to bases.",
    drillIds: ["dynamic_warmup", "outfield_drop_steps", "fly_ball_drills", "position_specific_throwing", "cool_down"],
  },
  {
    id: "speed_day",
    name: "Speed & Agility Day",
    focus: "Speed",
    minutes: 40,
    level: "All levels",
    description: "Get faster home-to-first with starts, sprints and change of direction.",
    drillIds: ["sprint_warmup", "explosive_starts", "sprints_20yd", "ladder_drills", "cone_agility", "cool_down"],
  },
  {
    id: "full_body_strength",
    name: "Full Body Strength",
    focus: "Strength",
    minutes: 55,
    level: "All levels",
    description: "Balanced lower/upper strength built for young athletes.",
    drillIds: [
      "dynamic_warmup",
      "goblet_squats",
      "romanian_deadlifts",
      "pushups",
      "one_arm_rows",
      "core_circuit",
      "cool_down",
    ],
  },
  {
    id: "explosive_power",
    name: "Explosive Power",
    focus: "Power",
    minutes: 45,
    level: "Advanced",
    description: "Jumps and med ball work that transfer straight to bat and arm speed.",
    drillIds: ["dynamic_warmup", "box_jumps", "broad_jumps", "med_ball_slams", "med_ball_rot_throws", "cool_down"],
  },
  {
    id: "baserunning",
    name: "Baserunning & Steals",
    focus: "Baserunning",
    minutes: 35,
    level: "All levels",
    description: "Jumps, leads, slides and first-step quickness.",
    drillIds: ["sprint_warmup", "stealing_starts", "baserunning", "sliding_practice", "cool_down"],
  },
  {
    id: "recovery_day",
    name: "Recovery Day",
    focus: "Recovery",
    minutes: 25,
    level: "All levels",
    description: "Flush soreness and stay loose between hard days.",
    drillIds: ["light_jog", "foam_rolling", "stretching", "hydration_goal"],
  },
];

export function routineDrills(routine: Routine): Array<{ id: string; drill: Drill }> {
  return routine.drillIds
    .filter((id) => DRILLS[id])
    .map((id) => ({ id, drill: DRILLS[id]! }));
}

export function drillWorkoutRow(drillId: string) {
  const drill = DRILLS[drillId]!;
  return {
    title: `${drill.name} — ${formatPrescription(drill.base)}`,
    category: toWorkoutCategory(drill.category),
    notes: drill.id,
  };
}

export const ALL_DRILLS = Object.values(DRILLS).sort((a, b) =>
  a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category),
);
