import { orderCup, unstable_plate } from '../src/index';

describe('Manatea', () => {
  it('should be updatable', async () => {
    const cup = orderCup<number>(1);
    expect(cup()).toBe(1);
    await cup(2);
    expect(cup()).toBe(2);
    await cup(() => 3);
    expect(cup()).toBe(3);
    await cup(async () => 4);
    expect(cup()).toBe(4);
  });

  it('should be listenable', async () => {
    const cup = orderCup<number>(1);
    const fn = jest.fn();
    cup.on(tea => fn(tea));
    await cup(2);
    expect(fn).toHaveBeenCalledWith(2);
    await cup(2);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should have clearable servers', async () => {
    {
      const cup = orderCup<number>(1);
      const fn = jest.fn();
      const server = cup.on(fn);
      expect(server.listening).toBe(true);
      server();
      expect(server.listening).toBe(false);
      await cup(2);
      expect(fn).not.toHaveBeenCalled();
    }
    {
      const cup = orderCup<number>(1);
      const fn = jest.fn();
      const server = cup.on(fn);
      expect(server.listening).toBe(true);
      cup.clear();
      expect(server.listening).toBe(false);
      await cup(2);
      expect(fn).not.toHaveBeenCalled();
    }
  });

  it('shouldn’t create infinite loops', async () => {
    const cup1 = orderCup<number>(0);
    const cup2 = orderCup<number>(0);
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
    const cup = orderCup(NaN);
    const fn = jest.fn();
    cup.on(fn);
    await cup(NaN);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should work with plates', async () => {
    const cup1 = orderCup<number>(0);
    const cup2 = orderCup<string>('');
    const fn = jest.fn();
    const plate = unstable_plate([cup1, cup2]);
    plate.on(fn);
    await cup1(1);
    await cup2('1');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, [1, ''], new WeakSet());
    expect(fn).toHaveBeenNthCalledWith(2, [1, '1'], new WeakSet());
  });

  it('plates should be infinite-loop proof', async () => {
    const cup1 = orderCup<number>(0);
    const cup2 = orderCup<string>('');
    const plate = unstable_plate([cup1, cup2]);
    plate.on((teas, context) => {
      cup1(0, context);
    });
    await cup1(1);
    expect(cup1()).toBe(1);
    expect(cup2()).toBe('');
    await cup2('1');
    expect(cup1()).toBe(0);
    expect(cup2()).toBe('1');
  });
});
