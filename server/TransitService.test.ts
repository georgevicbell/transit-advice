import { expect, jest, test } from '@jest/globals';
import TransitService from '../server/src/TransitService';
test('TransitService', (done) => {
    process.argv[4] = 'config.json';
    const onConfigUpdate = jest.fn(async () => {
        expect(onConfigUpdate).toHaveBeenCalled()
        done()
    })
    const transitService = new TransitService({
        onConfigUpdate: onConfigUpdate,
        onAgencyListUpdate: async () => { },
        onRouteListUpdate: async () => { },
        onRouteConfigUpdate: async () => { },
        onVehicleListUpdate: async () => { },
        onAdviceUpdate: async () => { },
    });
    expect(transitService).toBeDefined();



})