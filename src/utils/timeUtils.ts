export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

export const shouldSuggestHighEnergy = (): boolean => {
  const timeOfDay = getTimeOfDay();
  return timeOfDay === 'morning';
};
