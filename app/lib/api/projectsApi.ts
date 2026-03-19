import { API_ENDPOINTS } from './endpoints';

export async function createProject(): Promise<string> {
  const response = await fetch(API_ENDPOINTS.PROJECTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to create project');
  }

  return data.projectId;
}

export async function getProject(projectId: string): Promise<{ sections: { section_key: string; questions: unknown[] }[] } | null> {
  const response = await fetch(`${API_ENDPOINTS.PROJECTS}?id=${projectId}`);
  const data = await response.json();
  if (!data.success) return null;
  return data.project;
}
