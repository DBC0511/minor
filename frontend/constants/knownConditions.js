/**
 * All 11 classes the backend model uses (see backend/app.py CLASS_NAMES + DISEASE_INFO).
 * Descriptions are short English reference text for the in-app guide.
 */
export const KNOWN_CONDITIONS = [
  {
    id: "Bacterial_spot",
    emoji: "🦠",
    name: "Bacterial spot",
    severity: "High",
    sevKey: "high",
    description:
      "Small water-soaked spots on leaves and fruit; spreads fast in warm, wet weather. Copper sprays help limit spread.",
  },
  {
    id: "Early_blight",
    emoji: "🍂",
    name: "Early blight",
    severity: "High",
    sevKey: "high",
    description:
      "Dark spots with concentric rings, often on older leaves first. Favors humidity; remove infected debris and use labeled fungicides.",
  },
  {
    id: "Late_blight",
    emoji: "☠️",
    name: "Late blight",
    severity: "Critical",
    sevKey: "critical",
    description:
      "Irregular dark lesions and fuzzy growth under leaves in cool, wet conditions. Very aggressive—act immediately.",
  },
  {
    id: "Leaf_Mold",
    emoji: "🌫️",
    name: "Leaf mold",
    severity: "Medium",
    sevKey: "medium",
    description:
      "Yellow patches on top, olive-green mold underneath. Common in humid, poorly ventilated tunnels and greenhouses.",
  },
  {
    id: "Septoria_leaf_spot",
    emoji: "🔴",
    name: "Septoria leaf spot",
    severity: "Medium",
    sevKey: "medium",
    description:
      "Many small circular spots with dark borders and tiny black specks. Usually starts on lower leaves after splashing rain.",
  },
  {
    id: "Spider_mites Two-spotted_spider_mite",
    emoji: "🕷️",
    name: "Two-spotted spider mite",
    severity: "High",
    sevKey: "high",
    description:
      "Fine yellow stippling, bronzing, and fine silk on leaf undersides. Hot, dry conditions favor outbreaks.",
  },
  {
    id: "Target_Spot",
    emoji: "🎯",
    name: "Target spot",
    severity: "High",
    sevKey: "high",
    description:
      "Dark brown spots with concentric rings resembling targets. Thrives in warm, humid canopies with poor airflow.",
  },
  {
    id: "Tomato_Yellow_Leaf_Curl_Virus",
    emoji: "🦟",
    name: "Yellow leaf curl virus",
    severity: "Medium",
    sevKey: "medium",
    description:
      "Upward leaf curling, yellowing, and stunting. Transmitted by whiteflies; resistant varieties and vector control are key.",
  },
  {
    id: "Tomato_mosaic_virus",
    emoji: "🧬",
    name: "Tomato mosaic virus",
    severity: "Medium",
    sevKey: "medium",
    description:
      "Mottled light and dark green on leaves; stunted growth. Spreads via infected seed, tools, and handling—sanitize and rotate.",
  },
  {
    id: "healthy",
    emoji: "✅",
    name: "Healthy",
    severity: "None",
    sevKey: "none",
    description:
      "No disease signs—uniform green color, normal growth. Keep good nutrition, spacing, and scouting to stay ahead of problems.",
  },
  {
    id: "powdery_mildew",
    emoji: "⬜",
    name: "Powdery mildew",
    severity: "Low",
    sevKey: "low",
    description:
      "White powdery patches on leaves. Often worse when days are warm and nights are humid; improve airflow and use labeled treatments.",
  },
];
