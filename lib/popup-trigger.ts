// Global popup trigger system
export const triggerLeadPopup = (path?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triggerLeadPopup', { 
      detail: { path } 
    }));
  }
};

export const hasSeenPopup = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('popupBlockerSeen') === 'true';
  }
  return false;
};
