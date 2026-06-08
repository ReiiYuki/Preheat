import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { handleCallTool, saveState } from './index';

const TEST_STATE_FILE = path.join(os.tmpdir(), `preheat-test-state-${Date.now()}.json`);
process.env.STATE_FILE = TEST_STATE_FILE;

describe('MCP Server Unit Tests', () => {
  const mockState = {
    user: null,
    projects: [
      {
        id: 'proj-1',
        name: 'Test Project',
        createdAt: Date.now(),
        plans: [
          {
            id: 'plan-1',
            title: 'Test Plan',
            content: 'Test content',
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ]
      }
    ],
    activeProjectId: null,
    activePlanId: null
  };

  beforeEach(async () => {
    await saveState(mockState);
  });

  afterEach(async () => {
    try {
      await fs.unlink(TEST_STATE_FILE);
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should list all plans via get_all_plans', async () => {
    const result = await handleCallTool('get_all_plans', {});
    const plans = JSON.parse(result.content[0].text);
    expect(plans).toHaveLength(1);
    expect(plans[0].projectId).toBe('proj-1');
    expect(plans[0].title).toBe('Test Plan');
  });

  it('should list plans for project via get_all_plans_by_project', async () => {
    const result = await handleCallTool('get_all_plans_by_project', { projectId: 'proj-1' });
    const plans = JSON.parse(result.content[0].text);
    expect(plans).toHaveLength(1);
    expect(plans[0].title).toBe('Test Plan');
  });

  it('should add a plan via create_plan', async () => {
    const result = await handleCallTool('create_plan', {
      projectId: 'proj-1',
      title: 'New Plan',
      content: 'New content'
    });
    expect(result.content[0].text).toContain('Successfully created plan');

    const getResult = await handleCallTool('get_all_plans_by_project', { projectId: 'proj-1' });
    const plans = JSON.parse(getResult.content[0].text);
    expect(plans).toHaveLength(2);
    expect(plans[1].title).toBe('New Plan');
    expect(plans[1].content).toBe('New content');
  });

  it('should update a plan via edit_plan', async () => {
    const result = await handleCallTool('edit_plan', {
      planId: 'plan-1',
      title: 'Updated Title',
      content: 'Updated content'
    });
    expect(result.content[0].text).toContain('Successfully updated plan');

    const getResult = await handleCallTool('get_all_plans_by_project', { projectId: 'proj-1' });
    const plans = JSON.parse(getResult.content[0].text);
    expect(plans[0].title).toBe('Updated Title');
    expect(plans[0].content).toBe('Updated content');
  });

  it('should remove a plan via remove_plan', async () => {
    const result = await handleCallTool('remove_plan', {
      planId: 'plan-1',
    });
    expect(result.content[0].text).toContain('Successfully removed plan');

    const getResult = await handleCallTool('get_all_plans_by_project', { projectId: 'proj-1' });
    const plans = JSON.parse(getResult.content[0].text);
    expect(plans).toHaveLength(0);
  });

  it('should throw error for unknown tool', async () => {
    await expect(handleCallTool('unknown_tool', {})).rejects.toThrow('Unknown tool');
  });
});
