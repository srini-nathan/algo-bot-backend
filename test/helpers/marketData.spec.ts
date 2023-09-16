import { expect } from 'chai';
import { marketHrs, currentlyOpen, endOfWeek } from '../../src/helpers/marketData';
import { DateTime } from 'luxon';
import sinon from 'sinon';

describe('Market Hours Functions', function () {
    // Helper function to mock the current date and time
    function mockCurrentDateAndTime(dateTimeString: string, timeZone: string) {
        const clock = sinon.useFakeTimers({
            now: DateTime.fromISO(dateTimeString, { zone: timeZone }).toMillis(),
            toFake: ['Date'],
        });
        return clock;
    }

    // Restore the original clock after each test
    afterEach(function () {
        sinon.restore();
    });

    it('Should return market hours for Equity on a weekday in London timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-15T10:00:00.000Z', 'Europe/London');
        const result = await marketHrs('EQUITY', new Date(), 'Europe/London');

        expect(result.isOpen).to.be.true;

        clock.restore();
    });

    it('Should return market hours for Option on a weekday in India timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-15T10:00:00.000Z', 'Asia/Kolkata');
        const result = await marketHrs('OPTION', new Date(), 'Asia/Kolkata');

        expect(result.isOpen).to.be.true;

        clock.restore();
    });

    it('Should return market hours for Equity on a weekend in India timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-17T12:00:00.000Z', 'Asia/Kolkata');
        const result = await marketHrs('EQUITY', new Date(), 'Asia/Kolkata');

        expect(result.isOpen).to.be.false;

        clock.restore();
    });

    it('Should return market hours for Equity on a weekend in London timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-17T12:00:00.000Z', 'Europe/London');
        const result = await marketHrs('EQUITY', new Date(), 'Europe/London');

        expect(result.isOpen).to.be.false;

        clock.restore();
    });

    it('Should return whether the market is currently open for Equity in London timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-15T10:00:00.000Z', 'Europe/London');
        const result = await currentlyOpen('EQUITY', 'Europe/London');

        expect(result).to.be.true;

        clock.restore();
    });

    it('Should return endOfWeek for a Thursday in India timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-14T10:00:00.000Z', 'Asia/Kolkata');
        const result = await endOfWeek(new Date(), 'Asia/Kolkata');

        expect(result).to.be.false;

        clock.restore();
    });

    it('Should return endOfWeek for a Friday in India timezone', async function () {
        const clock = mockCurrentDateAndTime('2023-09-15T10:00:00.000Z', 'Asia/Kolkata');
        const result = await endOfWeek(new Date(), 'Asia/Kolkata');

        expect(result).to.be.true;

        clock.restore();
    });
});