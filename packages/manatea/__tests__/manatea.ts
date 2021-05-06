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
    cup.on(tea => fn(tea));
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

  it('shouldn’t create infinite loops', async () => {
    const cup1 = createCup<number>(0);
    const cup2 = createCup<number>(0);
    let i = 0;
    cup1.on((_tea, context) => {
      if (i++ > 0) {
        throw 'e';
      }
      cup2(v => v + 1, context);
    });
    cup2.on((_tea, context) => {
      cup1(v => v + 1, context);
    });
    await cup1(1);
    expect(cup1()).toBe(1);
    expect(cup2()).toBe(1);
  });

  it('shouldn’t update with NaN', async () => {
    const cup = createCup(NaN);
    const fn = jest.fn();
    cup.on(fn);
    await cup(NaN);
    expect(fn).not.toHaveBeenCalled();
  });
});
