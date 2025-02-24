import { Advice, RouteConfig } from '../../types'
export function StopLightAdvice(routeConfig: RouteConfig): Advice[] {
    const advice = []
    const numberOfTrafficLights = routeConfig.trafficLights.length
    const numberOfTrafficLightsWithTransitPrioity = routeConfig.trafficLights.filter(tl => tl.transit == "1").length
    const routeLength = routeConfig.maxStopDistance
    const trafficLightDensity = numberOfTrafficLights / routeLength
    const trafficLightsWithTransitPriorityDensity = numberOfTrafficLightsWithTransitPrioity / routeLength
    if (trafficLightDensity > 0.5) {
        advice.push({
            agency: routeConfig.agency,
            route: routeConfig.route,
            message: "This route has a high density of traffic lights",
            details: `There are ${numberOfTrafficLights} traffic lights on this ${routeLength.toFixed(2)} km route`,
            type: "Stop Light Advice",
            date: Date.now(),
            priority: "high"
        })
    }

    advice.push({
        agency: routeConfig.agency,
        route: routeConfig.route,
        message: "This route has a low density of traffic lights with transit priority",
        details: `There are ${numberOfTrafficLightsWithTransitPrioity} traffic lights with transit priority on this ${routeLength.toFixed(2)} km route out of ${numberOfTrafficLights} total`,
        type: "Stop Light Advice",
        date: Date.now(),
        priority: "high"
    })

    return advice

}

export function speedLimitAdvice(routeConfig: RouteConfig): Advice[] {
    return [{
        agency: routeConfig.agency,
        route: routeConfig.route,
        message: "Not Implemented",
        details: "We are still working on coding this feature",
        type: "Speed Limit Advice",
        date: Date.now(),
        priority: "info"
    }]
}
export function leftTurnAdvice(routeConfig: RouteConfig): Advice[] {
    return [{
        agency: routeConfig.agency,
        route: routeConfig.route,
        message: "Not Implemented",
        details: "We are still working on coding this feature",
        type: "Left Turn Advice",
        date: Date.now(),
        priority: "info"
    }]
}
export function recoveryLocations(routeConfig: RouteConfig): Advice[] {
    return [{
        agency: routeConfig.agency,
        route: routeConfig.route,
        message: "Not Implemented",
        details: "We are still working on coding this feature",
        type: "Schedule/Headway Recovery Locations",
        date: Date.now(),
        priority: "info"
    }]
}