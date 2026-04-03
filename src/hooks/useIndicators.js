/**
 * useIndicators — derives indicator series from candle data.
 *
 * Returns memoised results so lightweight-charts only re-renders
 * when the underlying candles or settings actually change.
 */

import { useMemo } from 'react';
import { useChartStore } from '../store/chartStore';
import { ema, sma, bollingerBands, vwap, rsi, macd } from '../utils/indicators';

export function useIndicators() {
  const {
    candles,
    overlays,
    panels,
    rsiPeriod,
    macdFast,
    macdSlow,
    macdSignal,
    bbandsStdDev,
    bbandsPeriod,
  } = useChartStore();

  const result = useMemo(() => {
    if (!candles.length) {
      return {
        ema9: [], ema20: [], ema50: [], sma200: [],
        bbands: null, vwapLine: [],
        rsiData: [], macdData: null,
      };
    }

    return {
      ema9:    overlays.ema9    ? ema(candles, 9)   : [],
      ema20:   overlays.ema20   ? ema(candles, 20)  : [],
      ema50:   overlays.ema50   ? ema(candles, 50)  : [],
      sma200:  overlays.sma200  ? sma(candles, 200) : [],
      bbands:  overlays.bbands  ? bollingerBands(candles, bbandsPeriod, bbandsStdDev) : null,
      vwapLine: overlays.vwap   ? vwap(candles)     : [],

      rsiData:  panels.rsi  ? rsi(candles, rsiPeriod) : [],
      macdData: panels.macd ? macd(candles, macdFast, macdSlow, macdSignal) : null,
    };
  }, [candles, overlays, panels, rsiPeriod, macdFast, macdSlow, macdSignal, bbandsStdDev, bbandsPeriod]);

  return result;
}
