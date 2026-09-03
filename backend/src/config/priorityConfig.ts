export interface PriorityConfig {
  defaultRadiusMeters: number;
  timeWindowDays: number;
  thresholdLow: number;
  thresholdHigh: number;
  baseCategoryWeights: Record<string, number>;
  confidenceMultiplier: number;
  nearbyReportMultiplier: number;
  maxNearbyReportContribution: number;
}

export const priorityConfig: PriorityConfig = {
  defaultRadiusMeters: parseInt(process.env.DEFAULT_RECURRENCE_RADIUS_METERS || '500', 10),
  timeWindowDays: parseInt(process.env.DEFAULT_RECURRENCE_TIME_WINDOW_DAYS || '30', 10),
  thresholdLow: parseInt(process.env.PRIORITY_THRESHOLD_LOW || '40', 10),
  thresholdHigh: parseInt(process.env.PRIORITY_THRESHOLD_HIGH || '70', 10),

  // Base weights (0-40) per civic category
  baseCategoryWeights: {
    drainage: 35,             // High flood/hazard potential
    damaged_infrastructure: 35, // High public safety hazard
    water_leakage: 30,         // Resource wastage & erosion
    pothole: 25,              // Traffic & vehicular accident hazard
    streetlight: 20,          // Night safety hazard
    garbage: 15               // Sanitation concern
  },

  // Max confidence contribution: confidence (0.0 to 1.0) * 20 => up to 20 pts
  confidenceMultiplier: 20,

  // Each nearby report within the radius adds 8 points (capped at 40 points)
  nearbyReportMultiplier: 8,
  maxNearbyReportContribution: 40
};
