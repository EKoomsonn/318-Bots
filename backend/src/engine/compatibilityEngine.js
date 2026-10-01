/**
 * RedApp Biological Blood-Type Compatibility Engine
 * 
 * Enforces real-world clinical Red Blood Cell (RBC) transfusion compatibility rules
 * based on ABO and Rh antigens as specified in the RedApp Project Brief.
 */

// Mapping of Recipient blood type to all biologically compatible Donor blood types
const COMPATIBLE_DONORS_FOR_RECIPIENT = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] // Universal Recipient
};

// Mapping of Donor blood type to all recipients who can safely receive their blood
const COMPATIBLE_RECIPIENTS_FOR_DONOR = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal Donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

const ALL_BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

/**
 * Checks if donorBloodType can safely donate to recipientBloodType.
 * @param {string} donorBloodType - e.g. 'O-', 'A+'
 * @param {string} recipientBloodType - e.g. 'B+', 'AB+'
 * @returns {boolean}
 */
function isCompatible(donorBloodType, recipientBloodType) {
  if (!donorBloodType || !recipientBloodType) return false;
  const eligibleDonors = COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodType.toUpperCase()];
  if (!eligibleDonors) return false;
  return eligibleDonors.includes(donorBloodType.toUpperCase());
}

/**
 * Get all donor types that can fulfill a request for recipientBloodType.
 * @param {string} recipientBloodType
 * @returns {string[]}
 */
function getEligibleDonorTypes(recipientBloodType) {
  return COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodType?.toUpperCase()] || [];
}

/**
 * Get all recipient types that can receive blood from donorBloodType.
 * @param {string} donorBloodType
 * @returns {string[]}
 */
function getEligibleRecipientTypes(donorBloodType) {
  return COMPATIBLE_RECIPIENTS_FOR_DONOR[donorBloodType?.toUpperCase()] || [];
}

/**
 * Get full compatibility matrix for UI / API consumption
 */
function getCompatibilityMatrix() {
  const matrix = {};
  for (const recipient of ALL_BLOOD_TYPES) {
    matrix[recipient] = {
      canReceiveFrom: COMPATIBLE_DONORS_FOR_RECIPIENT[recipient],
      canDonateTo: COMPATIBLE_RECIPIENTS_FOR_DONOR[recipient]
    };
  }
  return {
    allTypes: ALL_BLOOD_TYPES,
    matrix,
    universalDonor: 'O-',
    universalRecipient: 'AB+'
  };
}

module.exports = {
  isCompatible,
  getEligibleDonorTypes,
  getEligibleRecipientTypes,
  getCompatibilityMatrix,
  ALL_BLOOD_TYPES,
  COMPATIBLE_DONORS_FOR_RECIPIENT,
  COMPATIBLE_RECIPIENTS_FOR_DONOR
};
