import { Advice, RouteConfig } from '../types'
import { StopLightAdvice, leftTurnAdvice, recoveryLocations, speedLimitAdvice } from './Route/RouteAdvice'


function transitPriorityLanes(rc: RouteConfig): Advice[] {
    return [{
        agency: rc.agency,
        route: rc.route,
        message: "Not Implemented",
        details: "We are still working on coding this feature",
        type: "Transit Priority Lanes",
        date: Date.now(),
        priority: "info"
    }]
}
export function getAdviceForRoute(routeConfig: RouteConfig): Advice[] {
    var advice: Advice[] = []
    advice = [...advice, ...StopLightAdvice(routeConfig)]
    advice = [...advice, ...speedLimitAdvice(routeConfig)]
    advice = [...advice, ...leftTurnAdvice(routeConfig)]
    advice = [...advice, ...recoveryLocations(routeConfig)]
    advice = [...advice, ...transitPriorityLanes(routeConfig)]
    return advice
}
export function getAdviceForVehicles(): Advice[] {
    return []
}
