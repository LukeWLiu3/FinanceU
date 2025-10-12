export type ForumTopic = {
  id: string;
  title: string;
  blurb: string;
  description: string;
  highlights: string[];
};

export const forumTopics: ForumTopic[] = [
  {
    id: "finance",
    title: "Personal Finance",
    blurb: "Budgeting tips, investing basics, and planning for the future.",
    description:
      "Swap strategies on budgeting, saving, and building long-term wealth with other community members.",
    highlights: ["Budgeting", "Investing", "Credit building"],
  },
  {
    id: "general",
    title: "General Chat",
    blurb: "Share wins, ask questions, and hang out with the community.",
    description:
      "A relaxed lounge for anything on your mind—from productivity hacks to real-life wins and fails.",
    highlights: ["Daily wins", "Motivation", "Accountability"],
  },
  {
    id: "help",
    title: "Help & Support",
    blurb: "Stuck on something? Get advice from other learners.",
    description:
      "Get quick answers from peers and mentors on anything you’re working through with FinanceU.",
    highlights: ["Troubleshooting", "How-to guides", "App support"],
  },
  {
    id: "career",
    title: "Career Growth",
    blurb: "Discuss career moves, interviews, and professional goals.",
    description:
      "Talk job searches, salary negotiations, certifications, and everything that moves your career forward.",
    highlights: ["Job searching", "Networking", "Skill-building"],
  },
];

export const getTopicById = (id: string) =>
  forumTopics.find((topic) => topic.id === id);
