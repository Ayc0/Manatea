// @ts-ignore
import { orderCup } from '../../manatea/src';
import { useInfuser } from '../src';

import { renderHook, act } from '@testing-library/react-hooks';

describe('useInfuser', () => {
  it('should follow updates', async () => {
    const cup = orderCup<number>(0);

    const { result } = renderHook(() => useInfuser(cup));
    expect(result.current[0]).toBe(0);

    await act(async () => {
      await cup(1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('should trigger updates', async () => {
    const cup = orderCup<number>(0);

    const { result, waitForNextUpdate } = renderHook(() => useInfuser(cup));
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](-1);
    });
    await waitForNextUpdate();

    expect(cup()).toBe(-1);
  });

  it('should avoid infinite loops', async () => {
    const cup = orderCup<number>(0);

    const { result, waitForNextUpdate } = renderHook(() => useInfuser(cup));
    expect(result.current[0]).toBe(0);

    cup.on((tea, context) => result.current[1](tea + 2, context));

    await act(async () => {
      await cup(2);
    });

    expect(cup()).toBe(2);
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

    const { result, waitForNextUpdate } = renderHook(() => useInfuser(cup));
    expect(result.current[0]).toBe(0);

    const fn = jest.fn();
    cup.on(tea => fn(tea));

    await act(async () => {
      await result.current[1]('1');
    });
    expect(cup()).toBe(1);
    expect(fn).toHaveBeenCalledWith(1);

    await act(async () => {
      await result.current[1]('2');
    });
    expect(cup()).toBe(3);
    expect(fn).toHaveBeenCalledWith(3);
  });
});
