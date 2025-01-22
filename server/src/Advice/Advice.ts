import { Advice, RouteConfig } from '../types'
import { StopLightAdvice, leftTurnAdvice, recoveryLocations, speedLimitAdvice } from './Route/RouteAdvice'


function transitPriorityLanes(): Advice[] {
    return [{
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
    advice = [...advice, ...speedLimitAdvice()]
    advice = [...advice, ...leftTurnAdvice()]
    advice = [...advice, ...recoveryLocations()]
    advice = [...advice, ...transitPriorityLanes()]
    return advice
}
export function getAdviceForVehicles(): Advice[] {
    return []
}
