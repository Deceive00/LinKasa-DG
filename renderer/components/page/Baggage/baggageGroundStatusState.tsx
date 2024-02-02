interface StatusStyleContext {
  applyStyle(): React.CSSProperties;
}

const baggageGroundStatus = [
  'receive for transport', 
  'in transit',
  'ready for pickup',
  'claimed by passenger'
];

export class ReceiveForTransportStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#264653",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class InTransitGroundStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#264653",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class ReadyForPickUpStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#2a9d8f",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
export class ClaimedStyle implements StatusStyleContext {
  applyStyle(): React.CSSProperties {
    return {
      borderRadius: "8px",
      backgroundColor: "#e9c46a",
      color: "white",
      padding: "8px",
      textAlign: "center",
      width: "fit-content",
    };
  }
}
