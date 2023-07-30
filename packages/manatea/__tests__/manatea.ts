// @ts-ignore
import { orderCup } from '../src/index';

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
    cup.on(fn);
    await cup(2);
    expect(fn).toHaveBeenCalledWith(2, expect.anything());
    await cup(2);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should have clearable waiters', async () => {
    const cup = orderCup<number>(1);
    const fn = jest.fn();
    const waiter = cup.on(fn);
    waiter();
    await cup(2);
    expect(fn).not.toHaveBeenCalled();
  });

  it('can be used with functions', () => {
    const fn = () => 1;
    const cup = orderCup(() => fn);
    expect(cup()).toEqual(fn);
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

  it('should have flavors', async () => {
    const cup = orderCup<number, string>(
      '0',
      (unflavored, previouslyFlavored) => {
        const flavored = parseInt(unflavored, 10);
        if (previouslyFlavored == null) {
          return flavored;
        }
        return flavored + previouslyFlavored;
      },
    );
    const fn = jest.fn();
    cup.on(fn);
    expect(cup()).toBe(0);

    await cup('1');
    expect(cup()).toBe(1);
    expect(fn).toHaveBeenCalledWith(1, expect.anything());

    await cup('2');
    expect(cup()).toBe(3);
    expect(fn).toHaveBeenCalledWith(3, expect.anything());
  });

  describe('derived cups', () => {
    it('should have a valid default value', () => {
      const cup1 = orderCup<number>(1);
      const cup2 = orderCup<number>(2);
      const derivedCup = orderCup(sip => {
        const tea1 = sip(cup1);
        const tea2 = sip(cup2);
        return tea1 + tea2;
      });
      expect(derivedCup()).toBe(3);
    });

    it('should respond to changes', async () => {
      const cup1 = orderCup<number>(1);
      const cup2 = orderCup<number>(2);
      const derivedCup = orderCup(sip => {
        const tea1 = sip(cup1);
        const tea2 = sip(cup2);
        return tea1 + tea2;
      });

      const fn = jest.fn();
      derivedCup.on(fn);

      await cup2(5);
      await cup1(10);

      expect(derivedCup()).toBe(15);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith(6, expect.anything());
      expect(fn).toHaveBeenCalledWith(15, expect.anything());
    });

    it('should be handle to re-use the same cup multiple times', async () => {
      const cup = orderCup<number>(1);
      const derivedCup = orderCup(sip => {
        return sip(cup) + sip(cup);
      });

      const fn = jest.fn();
      derivedCup.on(tea => fn(tea));

      await cup(2);

      expect(derivedCup()).toBe(4);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('supports flavoring', async () => {
      const cup1 = orderCup<string>('1');
      const cup2 = orderCup<string>('2');
      const derivedCup = orderCup(
        sip => {
          const tea1 = sip(cup1);
          const tea2 = sip(cup2);
          return tea1 + tea2;
        },
        unflavoredTea => Number(unflavoredTea),
      );

      const fn = jest.fn();
      derivedCup.on(fn);

      expect(derivedCup()).toBe(12);

      await cup2('5');
      await cup1('10');
      expect(derivedCup()).toBe(105);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith(15, expect.anything());
      expect(fn).toHaveBeenCalledWith(105, expect.anything());
    });

    it('works with setters', async () => {
      const cup = orderCup<number>(0);
      const flavoring = jest.fn((unflavoredTea: number) => unflavoredTea);
      const derivedCup = orderCup(
        sip => sip(cup),
        unflavoredTea => flavoring(unflavoredTea),
      );

      // Change inner value when setting it
      await derivedCup(-1);
      expect(derivedCup()).toBe(-1);

      const fn = jest.fn();
      derivedCup.on(tea => fn(tea));

      // Here `cup`'s tea doesn't change, even if the derivedCup's one did, so derivedCup's value won't get updated
      await cup(0);
      expect(fn).not.toHaveBeenCalled();
      expect(derivedCup()).toBe(-1);

      // But if cup's tea changes, derivedCup's tea will be updated
      await cup(1);
      expect(derivedCup()).toBe(1);
    });
  });
});
