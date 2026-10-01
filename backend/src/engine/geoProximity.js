/**
 * RedApp Geolocation & Proximity Filter Engine
 * 
 * Implements the Haversine formula to calculate accurate great-circle
 * distance in kilometers (km) between hospital coordinates and registered donors.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Converts degrees to radians.
 */
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers (rounded to 1 decimal place)
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Ranks a list of donors by distance to a target hospital location.
 * Adds `distanceKm` property to each donor and sorts ascending (closest first).
 * @param {Array} donors 
 * @param {{latitude: number, longitude: number}} targetLocation 
 * @param {number} [maxRadiusKm] Optional filter for max distance
 * @returns {Array} Sorted and filtered donors
 */
function rankDonorsByProximity(donors, targetLocation, maxRadiusKm = null) {
  if (!targetLocation || typeof targetLocation.latitude !== 'number' || typeof targetLocation.longitude !== 'number') {
    return donors.map(d => ({ ...d, distanceKm: null }));
  }

  const ranked = donors.map(donor => {
    const distanceKm = calculateDistanceKm(
      targetLocation.latitude,
      targetLocation.longitude,
      donor.location.latitude,
      donor.location.longitude
    );
    return {
      ...donor,
      distanceKm
    };
  });

  const filtered = maxRadiusKm != null
    ? ranked.filter(d => d.distanceKm !== null && d.distanceKm <= maxRadiusKm)
    : ranked;

  return filtered.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}

module.exports = {
  calculateDistanceKm,
  rankDonorsByProximity
};
