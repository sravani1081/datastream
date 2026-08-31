// Stream Window Processing & Event-Time Watermark Simulator

import { StreamEvent, StreamWindow, WatermarkState } from '../../types/streaming';

export class WindowProcessor {
  private windows = new Map<string, StreamWindow>();
  private watermarkState: WatermarkState = {
    currentWatermarkMs: Date.now() - 5000,
    maxEventTimeMs: Date.now(),
    allowedLatenessMs: 10000,
    lateEventsCount: 0,
    droppedLateEventsCount: 0,
  };

  /**
   * Process event time against tumbling window
   */
  processTumblingWindow(
    events: StreamEvent[],
    windowSizeSec: number,
    aggregateFn: (recs: Record<string, unknown>[]) => Record<string, unknown>
  ): { closedWindows: StreamWindow[]; lateEvents: StreamEvent[] } {
    const closedWindows: StreamWindow[] = [];
    const lateEvents: StreamEvent[] = [];
    const windowSizeMs = windowSizeSec * 1000;

    events.forEach((evt) => {
      // Check watermark condition
      if (evt.eventTimestamp < this.watermarkState.currentWatermarkMs - this.watermarkState.allowedLatenessMs) {
        this.watermarkState.droppedLateEventsCount++;
        lateEvents.push(evt);
        return;
      }

      if (evt.eventTimestamp < this.watermarkState.currentWatermarkMs) {
        this.watermarkState.lateEventsCount++;
      }

      // Update max event time & watermark
      if (evt.eventTimestamp > this.watermarkState.maxEventTimeMs) {
        this.watermarkState.maxEventTimeMs = evt.eventTimestamp;
        this.watermarkState.currentWatermarkMs = evt.eventTimestamp - 5000; // 5s watermark delay
      }

      // Calculate window bounds
      const windowStart = Math.floor(evt.eventTimestamp / windowSizeMs) * windowSizeMs;
      const windowEnd = windowStart + windowSizeMs;
      const winKey = `tumbling_${windowStart}_${windowEnd}`;

      if (!this.windows.has(winKey)) {
        this.windows.set(winKey, {
          windowId: winKey,
          type: 'tumbling',
          startTimeMs: windowStart,
          endTimeMs: windowEnd,
          recordCount: 0,
          aggregatedResults: {},
          isClosed: false,
        });
      }

      const win = this.windows.get(winKey)!;
      win.recordCount++;

      // Close windows older than current watermark
      if (win.endTimeMs <= this.watermarkState.currentWatermarkMs && !win.isClosed) {
        win.isClosed = true;
        win.closedAtMs = Date.now();
        win.aggregatedResults = aggregateFn([evt.payload]);
        closedWindows.push(win);
      }
    });

    return { closedWindows, lateEvents };
  }

  getWatermarkState(): WatermarkState {
    return this.watermarkState;
  }
}
