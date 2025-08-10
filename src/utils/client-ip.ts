// utility for getting client IP address through different methods

export async function getClientIP(): Promise<string | null> {
  // method 1: through external API
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    if (data.ip) {
      console.log("Got IP from ipify.org:", data.ip);
      return data.ip;
    }
  } catch (error) {
    console.warn("Failed to get IP from ipify.org:", error);
  }

  // method 2: through alternative API
  try {
    const response = await fetch("https://httpbin.org/ip");
    const data = await response.json();
    if (data.origin) {
      console.log("Got IP from httpbin.org:", data.origin);
      return data.origin;
    }
  } catch (error) {
    console.warn("Failed to get IP from httpbin.org:", error);
  }

  // method 3: WebRTC (may not work in some browsers/networks)
  try {
    const ip = await getIPViaWebRTC();
    if (ip) {
      console.log("Got IP via WebRTC:", ip);
      return ip;
    }
  } catch (error) {
    console.warn("Failed to get IP via WebRTC:", error);
  }

  console.warn("All IP detection methods failed");
  return null;
}

function getIPViaWebRTC(): Promise<string | null> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, 5000); // 5 second timeout

    try {
      const RTCPeerConnection =
        window.RTCPeerConnection ||
        (window as any).webkitRTCPeerConnection ||
        (window as any).mozRTCPeerConnection;

      if (!RTCPeerConnection) {
        clearTimeout(timeout);
        resolve(null);
        return;
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("");

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;

        const candidate = ice.candidate.candidate;
        const ipMatch = candidate.match(
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        );

        if (ipMatch) {
          const ip = ipMatch[1];
          // filter local IPs
          if (
            !ip.startsWith("192.168.") &&
            !ip.startsWith("10.") &&
            !ip.startsWith("172.") &&
            !ip.startsWith("127.") &&
            ip !== "0.0.0.0"
          ) {
            clearTimeout(timeout);
            pc.close();
            resolve(ip);
          }
        }
      };

      pc.createOffer().then((offer) => pc.setLocalDescription(offer));
    } catch (error) {
      clearTimeout(timeout);
      resolve(null);
    }
  });
}
