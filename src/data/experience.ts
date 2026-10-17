import content from 'virtual:content';

/** Roles — edit them in content/experience.yml. */
export const experience = content.experience;

export const experienceById = (id: string) => experience.find((e) => e.id === id);
