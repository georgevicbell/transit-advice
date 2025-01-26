import { expect, jest, test } from '@jest/globals';
import TransitService from '../server/src/TransitService';
import { RouteConfig } from './src/types';
jest.mock('./src/loaders/Toronto/LoadTorontoData', () => {
    return {
        LoadTorontoTrafficLights: (rc: RouteConfig) => Promise.resolve([]),
        LoadTorontoCameras: (rc: RouteConfig) => Promise.resolve([])

    }

});
test('TransitService', (done) => {
    process.argv[4] = 'tests/test.json';
    const onConfigUpdate = jest.fn(async () => {
        expect(onConfigUpdate).toHaveBeenCalled()
        done()
    })
    const onAdviceUpdate = jest.fn(async () => {
        expect(onAdviceUpdate).toHaveBeenCalled()
        done()
    })



    const transitService = new TransitService({
        onConfigUpdate: onConfigUpdate,
        onAgencyListUpdate: async () => { },
        onRouteListUpdate: async () => { },
        onRouteConfigUpdate: async () => { },
        onVehicleListUpdate: async () => { },
        onAdviceUpdate: onAdviceUpdate,
    });
    expect(transitService).toBeDefined();



}, 100000)