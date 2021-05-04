// @ts-ignore
import { createCup } from '../src/index';

describe('Manatea', () => {
  it('should be updatable', async () => {
    const cup = createCup<number>(1);
    expect(cup()).toBe(1);
    await cup(2);
    expect(cup()).toBe(2);
    await cup(() => 3);
    expect(cup()).toBe(3);
    await cup(async () => 4);
    expect(cup()).toBe(4);
  });

  it('should be listenable', async () => {
    const cup = createCup<number>(1);
    const fn = jest.fn();
    cup.on(fn);
    await cup(2);
    expect(fn).toHaveBeenCalledWith(2);
    await cup(2);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should have clearable listeners', async () => {
    {
      const cup = createCup<number>(1);
      const fn = jest.fn();
      const listener = cup.on(fn);
      expect(listener.listening).toBe(true);
      listener();
      expect(listener.listening).toBe(false);
      await cup(2);
      expect(fn).not.toHaveBeenCalled();
    }
    {
      const cup = createCup<number>(1);
      const fn = jest.fn();
      const listener = cup.on(fn);
      expect(listener.listening).toBe(true);
      cup.clear();
      expect(listener.listening).toBe(false);
      await cup(2);
      expect(fn).not.toHaveBeenCalled();
    }
  });
});
