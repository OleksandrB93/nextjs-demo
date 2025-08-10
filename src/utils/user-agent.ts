// utilities for parsing User Agent
export interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      browserVersion: 'Unknown',
      os: 'Unknown',
      osVersion: 'Unknown',
      device: 'Unknown'
    };
  }

  // determine browser
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
    const match = userAgent.match(/Edg\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
    const match = userAgent.match(/(?:Opera|OPR)\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }

  // determine OS
  let os = 'Unknown';
  let osVersion = 'Unknown';
  
  if (userAgent.includes('Windows NT')) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT ([0-9.]+)/);
    if (match) {
      const version = match[1];
      switch (version) {
        case '10.0': osVersion = '10/11'; break;
        case '6.3': osVersion = '8.1'; break;
        case '6.2': osVersion = '8'; break;
        case '6.1': osVersion = '7'; break;
        default: osVersion = version;
      }
    }
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
    if (userAgent.includes('Android')) {
      os = 'Android';
      const match = userAgent.match(/Android ([0-9.]+)/);
      osVersion = match ? match[1] : 'Unknown';
    }
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : 'Unknown';
  }

  // determine device
  let device = 'Desktop';
  if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
    device = 'Mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    device = 'Tablet';
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    device
  };
}
