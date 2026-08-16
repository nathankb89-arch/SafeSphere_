export const EMERGENCY_ICONS = { fire: '🔥', flood: '🌊', accident: '🚗', medical: '🚑', landslide: '⛰️', earthquake: '🌍', outbreak: '🦠', other: '⚠️' }
export const getEmergencyIcon = (type) => EMERGENCY_ICONS[type] || '⚠️'
