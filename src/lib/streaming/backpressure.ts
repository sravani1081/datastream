// Local Backpressure Simulator & Buffer Monitor

import { BackpressureState } from '../../types/streaming';

export class BackpressureSimulator {
  private state: BackpressureState = {
    producerRateMsgPerSec: 250,
    consumerRateMsgPerSec: 200,
    bufferCapacity: 10000,
    currentBufferUsage: 1420,
    bufferUsagePct: 14.2,
    isBackpressureActive: false,
    droppedRecordsCount: 0,
    recoveryEstimatedSec: 0,
  };

  updateRates(producerRate: number, consumerRate: number, bufferCapacity = 10000): BackpressureState {
    const diff = producerRate - consumerRate;
    let newUsage = this.state.currentBufferUsage + diff;
    let dropped = this.state.droppedRecordsCount;

    if (newUsage > bufferCapacity) {
      dropped += newUsage - bufferCapacity;
      newUsage = bufferCapacity;
    } else if (newUsage < 0) {
      newUsage = 0;
    }

    const usagePct = Math.round((newUsage / bufferCapacity) * 1000) / 10;
    const isActive = usagePct > 80;

    let recoveryEst = 0;
    if (consumerRate > producerRate && newUsage > 0) {
      recoveryEst = Math.ceil(newUsage / (consumerRate - producerRate));
    }

    this.state = {
      producerRateMsgPerSec: producerRate,
      consumerRateMsgPerSec: consumerRate,
      bufferCapacity,
      currentBufferUsage: newUsage,
      bufferUsagePct: usagePct,
      isBackpressureActive: isActive,
      droppedRecordsCount: dropped,
      recoveryEstimatedSec: recoveryEst,
    };

    return this.state;
  }

  getState(): BackpressureState {
    return this.state;
  }
}
