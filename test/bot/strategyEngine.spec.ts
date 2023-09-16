
import { StrategyEngine } from '../../src/bot/strategyEngine';
import { expect } from 'chai';

describe('StrategyEngine', () => {
    let engine: StrategyEngine;

    beforeEach(() => {
        // Create a new instance of StrategyEngine before each test
        engine = new StrategyEngine();
    });

    it('should start and stop manually', async () => {
        expect(engine.isEventRunning().status).to.be.false;

        engine.manualStart();
        expect(engine.isEventRunning().status).to.be.true;

        engine.manualStop();
        expect(engine.isEventRunning().status).to.be.false;
    });
});