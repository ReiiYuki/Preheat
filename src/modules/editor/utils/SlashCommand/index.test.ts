import { describe, it, expect } from 'vitest';
import { SlashCommand } from './index';

describe('SlashCommand', () => {
  it('configures the extension correctly', () => {
    expect(SlashCommand.name).toBe('slashCommand');
    expect(SlashCommand.options.suggestion).toBeDefined();
  });
});
